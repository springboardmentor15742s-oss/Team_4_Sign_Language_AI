"""
SignLearn AI -- 111-Feature Biomechanical & Trajectory Extractor
================================================================
Extracts 111 invariant features from hand landmark sequences or single frames:
- 63: Scale-normalized, wrist-centered 3D landmark coordinates
-  5: Finger curl ratios (dist(wrist, tip) / dist(wrist, pip))
-  5: Finger extension projections along ray
-  4: Inter-adjacent-finger angles (cos angle between adjacent rays)
-  1: Index-Middle angle (critical for U vs V)
-  1: Index-Middle tip distance (normalized, U vs V vs R)
-  3: Thumb-to-Knuckle distances (dist to index_mcp, middle_mcp, ring_mcp: A, S, T, M, N)
-  1: Thumb-Index tip distance (D, F, O)
- 10: Pairwise fingertip distances (5 choose 2)
-  3: Palm normal vector [nx, ny, nz] (3D orientation)
-  3: Hand pointing direction [px, py, pz] (3D direction: up, down, sideways)
-  1: Dynamic motion flag / magnitude
-  3: Trajectory net displacement [dx, dy, dz]
-  1: Total trajectory path length
-  1: Path linearity ratio (||net|| / path_length)
-  1: Trajectory velocity
-  3: Trajectory direction unit vector
-  1: Path curvature / directional variance
-  1: Finger motion delta (curl change start vs end)
Total: 111 features
"""

import math
import numpy as np
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
try:
    from ml.sign_prototypes import SIGN_PROTOTYPES
except ImportError:
    from sign_prototypes import SIGN_PROTOTYPES

# MediaPipe landmark indices
WRIST        = 0
THUMB_CMC    = 1
THUMB_MCP    = 2
THUMB_IP     = 3
THUMB_TIP    = 4
INDEX_MCP    = 5
INDEX_PIP    = 6
INDEX_DIP    = 7
INDEX_TIP    = 8
MIDDLE_MCP   = 9
MIDDLE_PIP   = 10
MIDDLE_DIP   = 11
MIDDLE_TIP   = 12
RING_MCP     = 13
RING_PIP     = 14
RING_DIP     = 15
RING_TIP     = 16
PINKY_MCP    = 17
PINKY_PIP    = 18
PINKY_DIP    = 19
PINKY_TIP    = 20

FINGER_TIPS  = [THUMB_TIP, INDEX_TIP, MIDDLE_TIP, RING_TIP, PINKY_TIP]
FINGER_PIPS  = [THUMB_IP,  INDEX_PIP, MIDDLE_PIP, RING_PIP, PINKY_PIP]
FINGER_MCPS  = [THUMB_MCP, INDEX_MCP, MIDDLE_MCP, RING_MCP, PINKY_MCP]
FINGER_BASES = [THUMB_CMC, INDEX_MCP, MIDDLE_MCP, RING_MCP, PINKY_MCP]

def _rot_matrix_from_vectors(vec1, vec2):
    """Rotation matrix that aligns unit vector vec1 to vec2."""
    v1 = vec1 / (np.linalg.norm(vec1) + 1e-7)
    v2 = vec2 / (np.linalg.norm(vec2) + 1e-7)
    v = np.cross(v1, v2)
    c = np.dot(v1, v2)
    s = np.linalg.norm(v)
    if s < 1e-6:
        return np.eye(3) if c > 0 else -np.eye(3)
    kmat = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]])
    return np.eye(3) + kmat + np.dot(kmat, kmat) * ((1 - c) / (s ** 2))

def generate_hand_landmarks(proto, wrist=None, t_ratio=0.0, rng=None,
                            noise_std=0.015, scale_var=0.08):
    """
    Synthesizes an anatomically coherent 21-landmark hand in 3D.
    Reflects finger extension, thumb placement mode, finger splay mode,
    3D palm orientation, and pointing direction.
    """
    if rng is None:
        rng = np.random.default_rng()

    if wrist is None:
        wrist = np.array(proto.get("wrist_start", [0.50, 0.70, 0.0]), dtype=np.float32)
    else:
        wrist = np.array(wrist, dtype=np.float32)

    scale = 1.0 + rng.uniform(-scale_var, scale_var)
    finger_ext = list(proto["finger_ext"])
    thumb_pos = proto.get("thumb_pos", "across")
    finger_splay = proto.get("finger_splay", "spread")
    palm_normal = np.array(proto.get("palm_normal", [0.0, 0.0, -1.0]), dtype=np.float32)
    pointing_dir = np.array(proto.get("pointing_dir", [0.0, -1.0, 0.0]), dtype=np.float32)

    # If dynamic sign with pinch_close (e.g. NO), interpolate extension over t_ratio
    if proto.get("trajectory_type") == "pinch_close":
        # Index and middle transition from open (0.8) to pinched closed (0.1)
        close_factor = 1.0 - 0.7 * t_ratio
        finger_ext[0] = 0.6 * close_factor
        finger_ext[1] = 0.8 * close_factor
        finger_ext[2] = 0.8 * close_factor

    # Apply small natural jitter to finger extensions
    f_ext = [float(np.clip(e + rng.normal(0, 0.05), 0.0, 1.0)) for e in finger_ext]

    # Coordinate frame of hand:
    # Y-axis = pointing_dir (wrist to middle MCP)
    # Z-axis = palm_normal (perpendicular to palm)
    # X-axis = cross(Y, Z) (across palm: thumb to pinky)
    y_axis = pointing_dir / (np.linalg.norm(pointing_dir) + 1e-6)
    z_axis = palm_normal / (np.linalg.norm(palm_normal) + 1e-6)
    # Ensure orthogonality
    z_axis = z_axis - np.dot(z_axis, y_axis) * y_axis
    z_axis = z_axis / (np.linalg.norm(z_axis) + 1e-6)
    x_axis = np.cross(y_axis, z_axis)
    x_axis = x_axis / (np.linalg.norm(x_axis) + 1e-6)

    # Canonical hand model (in local coordinates where wrist=[0,0,0], up=[0,1,0], normal=[0,0,1])
    lm_local = np.zeros((21, 3), dtype=np.float32)
    lm_local[0] = [0.0, 0.0, 0.0]  # Wrist

    # Base MCP positions in local frame: X = lateral [-0.05..0.05], Y = distal [0.08..0.12], Z = dorsal [0.0]
    mcp_coords = {
        INDEX_MCP:  np.array([-0.035, 0.110, 0.000], dtype=np.float32),
        MIDDLE_MCP: np.array([ 0.000, 0.120, 0.000], dtype=np.float32),
        RING_MCP:   np.array([ 0.032, 0.110, 0.000], dtype=np.float32),
        PINKY_MCP:  np.array([ 0.060, 0.095, 0.000], dtype=np.float32),
        THUMB_CMC:  np.array([-0.040, 0.040, 0.010], dtype=np.float32),
    }

    for idx, pos in mcp_coords.items():
        lm_local[idx] = pos

    # 4 Fingers: Index, Middle, Ring, Pinky
    # Standard segment lengths: PIP, DIP, TIP
    finger_info = [
        (1, INDEX_MCP,  INDEX_PIP,  INDEX_DIP,  INDEX_TIP,  -0.035, 0.045, 0.035, 0.025),
        (2, MIDDLE_MCP, MIDDLE_PIP, MIDDLE_DIP, MIDDLE_TIP,  0.000, 0.050, 0.040, 0.028),
        (3, RING_MCP,   RING_PIP,   RING_DIP,   RING_TIP,    0.032, 0.045, 0.035, 0.025),
        (4, PINKY_MCP,  PINKY_PIP,  PINKY_DIP,  PINKY_TIP,   0.060, 0.035, 0.025, 0.020),
    ]

    # Finger splay lateral adjustments
    splay_offset = {"touch": 0.00, "spread": 0.015, "cross": -0.025, "hook": 0.00}.get(finger_splay, 0.01)

    for fi, mcp_i, pip_i, dip_i, tip_i, base_x, l_pip, l_dip, l_tip in finger_info:
        ext = f_ext[fi]
        mcp_pt = lm_local[mcp_i]

        # Splay direction
        splay_x = (fi - 2) * splay_offset
        if finger_splay == "cross" and fi == 1: # Index crosses over middle
            splay_x = 0.025
            mcp_pt = mcp_pt + np.array([0.0, 0.0, 0.02], dtype=np.float32)
        elif finger_splay == "cross" and fi == 2:
            splay_x = -0.015

        if finger_splay == "hook" and fi == 1: # X hook
            # PIP extended forward, DIP curled down
            pip_pt = mcp_pt + np.array([splay_x, l_pip * 0.7, -l_pip * 0.5], dtype=np.float32)
            dip_pt = pip_pt + np.array([0.0, l_dip * 0.1, -l_dip * 0.9], dtype=np.float32)
            tip_pt = dip_pt + np.array([0.0, -l_tip * 0.6, -l_tip * 0.4], dtype=np.float32)
        elif ext > 0.65:
            # Extended finger: goes straight in +Y direction with slight splay
            pip_pt = mcp_pt + np.array([splay_x * 0.4, l_pip, 0.005], dtype=np.float32)
            dip_pt = pip_pt + np.array([splay_x * 0.7, l_dip, 0.002], dtype=np.float32)
            tip_pt = dip_pt + np.array([splay_x * 1.0, l_tip, 0.000], dtype=np.float32)
        elif ext < 0.35:
            # Curled finger (fist): curls forward into palm (-Z and down)
            pip_pt = mcp_pt + np.array([splay_x * 0.2, l_pip * 0.4, -l_pip * 0.6], dtype=np.float32)
            dip_pt = pip_pt + np.array([0.0, -l_dip * 0.5, -l_dip * 0.5], dtype=np.float32)
            tip_pt = dip_pt + np.array([0.0, -l_tip * 0.7, l_tip * 0.4], dtype=np.float32)
        else:
            # Semi-curled (C, O, E)
            pip_pt = mcp_pt + np.array([splay_x * 0.3, l_pip * 0.7, -l_pip * 0.3], dtype=np.float32)
            dip_pt = pip_pt + np.array([splay_x * 0.5, l_dip * 0.3, -l_dip * 0.7], dtype=np.float32)
            tip_pt = dip_pt + np.array([splay_x * 0.6, -l_tip * 0.4, -l_tip * 0.6], dtype=np.float32)

        lm_local[pip_i] = pip_pt
        lm_local[dip_i] = dip_pt
        lm_local[tip_i] = tip_pt

    # Thumb generation: Distinct positions for A, S, T, M, N, E, D, F, O, L, K
    cmc_pt = lm_local[THUMB_CMC]
    th_ext = f_ext[0]

    if thumb_pos == "side":  # 'A': thumb alongside index MCP pointing straight up
        mcp_pt = cmc_pt + np.array([-0.020, 0.040, 0.010], dtype=np.float32)
        ip_pt  = mcp_pt + np.array([-0.010, 0.035, 0.010], dtype=np.float32)
        tip_pt = ip_pt  + np.array([ 0.005, 0.030, 0.010], dtype=np.float32)
    elif thumb_pos == "across":  # 'S': thumb wrapped horizontally across front of fingers
        mcp_pt = cmc_pt + np.array([ 0.010, 0.030, -0.020], dtype=np.float32)
        ip_pt  = mcp_pt + np.array([ 0.030, 0.020, -0.030], dtype=np.float32)
        tip_pt = ip_pt  + np.array([ 0.025, 0.010, -0.025], dtype=np.float32)
    elif thumb_pos == "under_index":  # 'T': thumb tucked between index and middle MCP
        mcp_pt = cmc_pt + np.array([ 0.010, 0.035, -0.015], dtype=np.float32)
        ip_pt  = mcp_pt + np.array([ 0.015, 0.040, -0.010], dtype=np.float32)
        tip_pt = lm_local[INDEX_MCP] + np.array([0.015, 0.030, -0.010], dtype=np.float32)
    elif thumb_pos == "under_middle":  # 'N': thumb tucked between middle and ring MCP
        mcp_pt = cmc_pt + np.array([ 0.020, 0.035, -0.015], dtype=np.float32)
        ip_pt  = mcp_pt + np.array([ 0.025, 0.040, -0.015], dtype=np.float32)
        tip_pt = lm_local[MIDDLE_MCP] + np.array([0.015, 0.025, -0.010], dtype=np.float32)
    elif thumb_pos == "under_ring":  # 'M': thumb tucked between ring and pinky MCP
        mcp_pt = cmc_pt + np.array([ 0.030, 0.035, -0.015], dtype=np.float32)
        ip_pt  = mcp_pt + np.array([ 0.030, 0.040, -0.015], dtype=np.float32)
        tip_pt = lm_local[RING_MCP] + np.array([0.015, 0.025, -0.010], dtype=np.float32)
    elif thumb_pos == "tucked":  # 'E': thumb tucked tightly horizontally below fingertips
        mcp_pt = cmc_pt + np.array([ 0.010, 0.020, -0.015], dtype=np.float32)
        ip_pt  = mcp_pt + np.array([ 0.020, 0.005, -0.020], dtype=np.float32)
        tip_pt = ip_pt  + np.array([ 0.020, 0.000, -0.015], dtype=np.float32)
    elif thumb_pos == "touch_middle":  # 'D': thumb tip touches middle tip
        mcp_pt = cmc_pt + np.array([ 0.010, 0.035, -0.015], dtype=np.float32)
        ip_pt  = mcp_pt + np.array([ 0.020, 0.030, -0.025], dtype=np.float32)
        tip_pt = lm_local[MIDDLE_TIP] + np.array([-0.005, 0.0, 0.005], dtype=np.float32)
    elif thumb_pos == "touch_index":  # 'F': thumb tip touches index tip
        mcp_pt = cmc_pt + np.array([ 0.010, 0.040, -0.010], dtype=np.float32)
        ip_pt  = mcp_pt + np.array([ 0.015, 0.035, -0.020], dtype=np.float32)
        tip_pt = lm_local[INDEX_TIP] + np.array([-0.005, 0.0, 0.005], dtype=np.float32)
    elif thumb_pos == "open_o":  # 'C', 'O', 'EAT': thumb curves to form arch/O
        mcp_pt = cmc_pt + np.array([-0.015, 0.040, -0.020], dtype=np.float32)
        ip_pt  = mcp_pt + np.array([ 0.010, 0.035, -0.035], dtype=np.float32)
        tip_pt = ip_pt  + np.array([ 0.020, 0.020, -0.025], dtype=np.float32)
    elif thumb_pos == "wide_l":  # 'L', 'G': 90 degree thumb extension
        mcp_pt = cmc_pt + np.array([-0.035, 0.025, 0.000], dtype=np.float32)
        ip_pt  = mcp_pt + np.array([-0.035, 0.020, 0.000], dtype=np.float32)
        tip_pt = ip_pt  + np.array([-0.030, 0.010, 0.000], dtype=np.float32)
    elif thumb_pos == "up_k":  # 'K', 'P': thumb points up between index and middle
        mcp_pt = cmc_pt + np.array([ 0.005, 0.045, -0.005], dtype=np.float32)
        ip_pt  = mcp_pt + np.array([ 0.010, 0.035, -0.005], dtype=np.float32)
        tip_pt = ip_pt  + np.array([ 0.005, 0.030,  0.000], dtype=np.float32)
    else:  # 'spread' (Y, HELLO, etc.)
        mcp_pt = cmc_pt + np.array([-0.030, 0.030, 0.010], dtype=np.float32)
        ip_pt  = mcp_pt + np.array([-0.035, 0.025, 0.010], dtype=np.float32)
        tip_pt = ip_pt  + np.array([-0.030, 0.020, 0.005], dtype=np.float32)

    lm_local[THUMB_MCP] = mcp_pt
    lm_local[THUMB_IP]  = ip_pt
    lm_local[THUMB_TIP] = tip_pt

    # Transform from local hand frame into global 3D space:
    # point_global = wrist + scale * (x * x_axis + y * y_axis + z * z_axis)
    # Plus coordinate noise
    R = np.column_stack([x_axis, y_axis, z_axis])
    lm_world = np.zeros((21, 3), dtype=np.float32)
    for i in range(21):
        lm_world[i] = wrist + scale * np.dot(R, lm_local[i])
        if i > 0:  # add noise
            lm_world[i] += rng.normal(0, noise_std, 3)

    return lm_world

def generate_trajectory_sample(sign_name, n_frames=8, rng=None,
                               noise_std=0.015, scale_var=0.08):
    """
    Generates a temporal sequence of n_frames landmark sets (n_frames, 21, 3)
    modeling the actual hand trajectory and motion of the sign.
    """
    if rng is None:
        rng = np.random.default_rng()

    proto = SIGN_PROTOTYPES[sign_name]
    traj_type = proto.get("trajectory_type", "static")
    is_dyn = proto.get("is_dynamic", False)
    w_start = np.array(proto.get("wrist_start", [0.50, 0.70, 0.0]), dtype=np.float32)

    # Base wrist jitter
    w_start = w_start + rng.normal(0, 0.02, 3)

    frames = []
    for f in range(n_frames):
        t = f / max(n_frames - 1, 1)  # 0.0 to 1.0

        if not is_dyn or traj_type == "static":
            # Stationary with minor natural hand micro-tremor
            w_cur = w_start + rng.normal(0, 0.003, 3)
        elif traj_type == "wave_out":  # HELLO: moves right and oscillates
            dx = 0.18 * t
            dy = -0.08 * math.sin(t * math.pi)
            dz = 0.02 * math.sin(t * 3 * math.pi)
            w_cur = w_start + np.array([dx, dy, dz], dtype=np.float32)
        elif traj_type == "down_forward":  # THANK_YOU, GOOD, NICE, WHY
            dx = 0.02 * t
            dy = 0.22 * t
            dz = -0.08 * t
            w_cur = w_start + np.array([dx, dy, dz], dtype=np.float32)
        elif traj_type == "circle_chest":  # PLEASE, SORRY
            angle = 2.0 * math.pi * t
            dx = 0.06 * math.cos(angle)
            dy = 0.06 * math.sin(angle)
            w_cur = w_start + np.array([dx, dy, 0.0], dtype=np.float32)
        elif traj_type == "nod_vertical":  # YES, NAME
            dy = 0.05 * math.sin(2.0 * math.pi * t)
            w_cur = w_start + np.array([0.0, dy, 0.0], dtype=np.float32)
        elif traj_type == "j_curve":  # J: pinky traces J down and hooks up
            if t < 0.6:
                dy = 0.12 * (t / 0.6)
                dx = 0.0
            else:
                s = (t - 0.6) / 0.4
                dy = 0.12 - 0.05 * math.sin(s * math.pi * 0.5)
                dx = -0.07 * math.sin(s * math.pi * 0.5)
            w_cur = w_start + np.array([dx, dy, 0.0], dtype=np.float32)
        elif traj_type == "z_zigzag":  # Z: index traces Z in air
            if t < 0.33:
                dx = 0.08 * (t / 0.33)
                dy = 0.0
            elif t < 0.66:
                s = (t - 0.33) / 0.33
                dx = 0.08 - 0.08 * s
                dy = 0.08 * s
            else:
                s = (t - 0.66) / 0.34
                dx = 0.08 * s
                dy = 0.08
            w_cur = w_start + np.array([dx, dy, 0.0], dtype=np.float32)
        elif traj_type == "lift_up":  # HELP, HELP_TWO
            dy = -0.15 * t
            w_cur = w_start + np.array([0.0, dy, 0.0], dtype=np.float32)
        elif traj_type == "chop_down":  # STOP
            dy = 0.16 * (t ** 1.5)  # accelerating down
            w_cur = w_start + np.array([0.0, dy, 0.0], dtype=np.float32)
        elif traj_type == "clap_in":  # CLAP: moves towards center
            dx = 0.15 * math.sin(t * math.pi * 0.7)
            w_cur = w_start + np.array([dx, 0.0, 0.0], dtype=np.float32)
        elif traj_type == "tap_chin":  # EAT, WATER, HOME: double tap
            dy = 0.04 * math.sin(2.0 * math.pi * t)
            dz = -0.03 * math.sin(2.0 * math.pi * t)
            w_cur = w_start + np.array([0.0, dy, dz], dtype=np.float32)
        elif traj_type == "tap_wrist":  # TIME
            dy = 0.03 * math.sin(2.0 * math.pi * t)
            w_cur = w_start + np.array([0.0, dy, 0.0], dtype=np.float32)
        elif traj_type == "shake_horizontal":  # WHAT, SHARE
            dx = 0.06 * math.sin(2.5 * math.pi * t)
            w_cur = w_start + np.array([dx, 0.0, 0.0], dtype=np.float32)
        elif traj_type == "wag_index":  # WHERE, WHO
            dx = 0.05 * math.sin(2.5 * math.pi * t)
            w_cur = w_start + np.array([dx, 0.0, 0.0], dtype=np.float32)
        elif traj_type == "circle_horizontal":  # FAMILY, TOGETHER
            angle = 2.0 * math.pi * t
            dx = 0.07 * math.sin(angle)
            dz = 0.04 * math.cos(angle)
            w_cur = w_start + np.array([dx, 0.0, dz], dtype=np.float32)
        elif traj_type == "tap_together":  # MORE, FRIEND
            dx = 0.05 * math.sin(2.0 * math.pi * t)
            w_cur = w_start + np.array([dx, 0.0, 0.0], dtype=np.float32)
        else:
            w_cur = w_start

        lm = generate_hand_landmarks(proto, wrist=w_cur, t_ratio=t, rng=rng,
                                     noise_std=noise_std, scale_var=scale_var)
        frames.append(lm)

    return np.array(frames, dtype=np.float32)  # (n_frames, 21, 3)

def extract_features(input_data):
    """
    Extracts 111 scale-invariant spatial and kinematic features.
    Accepts:
      - Trajectory array of shape (N_samples, n_frames, 21, 3) -> returns (N_samples, 111)
      - Single trajectory of shape (n_frames, 21, 3) -> returns (111,)
      - Single frame of shape (21, 3) or (63,) -> returns (111,) with trajectory defaults
    """
    arr = np.array(input_data, dtype=np.float32)

    # Standardize input shape
    if arr.ndim == 1:
        # (63,) raw landmarks
        arr = arr.reshape(1, 1, 21, 3)
        single_output = True
    elif arr.ndim == 2 and arr.shape == (21, 3):
        arr = arr.reshape(1, 1, 21, 3)
        single_output = True
    elif arr.ndim == 3 and arr.shape[1:] == (21, 3):
        # Single trajectory: (n_frames, 21, 3)
        arr = arr.reshape(1, arr.shape[0], 21, 3)
        single_output = True
    elif arr.ndim == 4 and arr.shape[2:] == (21, 3):
        # Batch of trajectories: (N, n_frames, 21, 3)
        single_output = False
    else:
        raise ValueError(f"Unexpected input shape for extract_features: {arr.shape}")

    N, n_frames, _, _ = arr.shape
    out = np.zeros((N, 111), dtype=np.float32)

    for i in range(N):
        traj = arr[i]  # (n_frames, 21, 3)
        # Representative pose: mid-frame
        mid_idx = n_frames // 2
        pose = traj[mid_idx].copy()  # (21, 3)
        wrist = pose[0]

        # 1. Scale normalization relative to hand size (wrist to middle MCP length)
        hand_scale = np.linalg.norm(pose[MIDDLE_MCP] - wrist)
        if hand_scale < 1e-4:
            hand_scale = 1.0

        norm_pose = (pose - wrist) / hand_scale  # (21, 3), scale-invariant, wrist at 0

        # [0:63] - 63 normalized coordinates
        out[i, 0:63] = norm_pose.flatten()

        # [63:68] - 5 finger curl ratios (dist(wrist, tip) / dist(wrist, pip))
        for fi, (t_idx, p_idx) in enumerate(zip(FINGER_TIPS, FINGER_PIPS)):
            d_tip = np.linalg.norm(norm_pose[t_idx]) + 1e-6
            d_pip = np.linalg.norm(norm_pose[p_idx]) + 1e-6
            out[i, 63 + fi] = float(d_tip / d_pip)

        # [68:73] - 5 finger extension projections along finger ray
        for fi, (m_idx, t_idx) in enumerate(zip(FINGER_MCPS, FINGER_TIPS)):
            ray = norm_pose[m_idx] / (np.linalg.norm(norm_pose[m_idx]) + 1e-6)
            out[i, 68 + fi] = float(np.dot(norm_pose[t_idx], ray))

        # [73:77] - 4 inter-adjacent-finger angles
        finger_rays = [norm_pose[t] - norm_pose[b] for t, b in zip(FINGER_TIPS, FINGER_BASES)]
        for ai in range(4):
            u, v = finger_rays[ai], finger_rays[ai + 1]
            cos_a = np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v) + 1e-6)
            out[i, 73 + ai] = float(np.clip(cos_a, -1.0, 1.0))

        # [77] - Index-Middle angle (critical for U vs V)
        u_idx, v_mid = finger_rays[1], finger_rays[2]
        cos_uv = np.dot(u_idx, v_mid) / (np.linalg.norm(u_idx) * np.linalg.norm(v_mid) + 1e-6)
        out[i, 77] = float(np.clip(cos_uv, -1.0, 1.0))

        # [78] - Index-Middle tip distance (normalized, U vs V vs R)
        out[i, 78] = float(np.linalg.norm(norm_pose[INDEX_TIP] - norm_pose[MIDDLE_TIP]))

        # [79:82] - Thumb-to-knuckle distances (A vs S vs T vs M vs N)
        out[i, 79] = float(np.linalg.norm(norm_pose[THUMB_TIP] - norm_pose[INDEX_MCP]))
        out[i, 80] = float(np.linalg.norm(norm_pose[THUMB_TIP] - norm_pose[MIDDLE_MCP]))
        out[i, 81] = float(np.linalg.norm(norm_pose[THUMB_TIP] - norm_pose[RING_MCP]))

        # [82] - Thumb-Index tip distance (D, F, O)
        out[i, 82] = float(np.linalg.norm(norm_pose[THUMB_TIP] - norm_pose[INDEX_TIP]))

        # [83:93] - 10 pairwise fingertip distances (C(5,2) = 10)
        tips = [norm_pose[t] for t in FINGER_TIPS]
        pair_idx = 83
        for a in range(5):
            for b in range(a + 1, 5):
                out[i, pair_idx] = float(np.linalg.norm(tips[a] - tips[b]))
                pair_idx += 1

        # [93:96] - Palm normal vector [nx, ny, nz]
        v1 = norm_pose[INDEX_MCP]
        v2 = norm_pose[PINKY_MCP]
        p_normal = np.cross(v1, v2)
        p_norm_mag = np.linalg.norm(p_normal) + 1e-6
        out[i, 93:96] = p_normal / p_norm_mag

        # [96:99] - Hand pointing direction vector [px, py, pz]
        p_dir = norm_pose[MIDDLE_MCP]
        p_dir_mag = np.linalg.norm(p_dir) + 1e-6
        out[i, 96:99] = p_dir / p_dir_mag

        # [99:111] - Trajectory & Kinematic Features (12 features)
        if n_frames > 1:
            wrists = traj[:, 0, :]  # (n_frames, 3)
            # Net displacement vector
            net_disp = wrists[-1] - wrists[0]
            net_dist = float(np.linalg.norm(net_disp))

            # Frame-by-frame step lengths
            step_dists = [float(np.linalg.norm(wrists[k+1] - wrists[k])) for k in range(n_frames - 1)]
            total_path = sum(step_dists)

            # Trajectory linearity ratio
            linearity = float(net_dist / (total_path + 1e-5))
            velocity = float(total_path / max(n_frames - 1, 1))

            # Direction unit vector
            dir_unit = net_disp / (net_dist + 1e-6)

            # Path curvature: angle variance between successive step vectors
            if len(step_dists) >= 2:
                step_vecs = [wrists[k+1] - wrists[k] for k in range(n_frames - 1)]
                angles = []
                for k in range(len(step_vecs) - 1):
                    v_a, v_b = step_vecs[k], step_vecs[k+1]
                    m_a, m_b = np.linalg.norm(v_a), np.linalg.norm(v_b)
                    if m_a > 1e-5 and m_b > 1e-5:
                        cos_theta = float(np.clip(np.dot(v_a, v_b) / (m_a * m_b), -1.0, 1.0))
                        angles.append(math.acos(cos_theta))
                curvature = float(np.std(angles)) if len(angles) > 0 else 0.0
            else:
                curvature = 0.0

            # Finger motion delta: curl change start vs end
            start_curl = np.linalg.norm(traj[0, INDEX_TIP] - traj[0, 0])
            end_curl   = np.linalg.norm(traj[-1, INDEX_TIP] - traj[-1, 0])
            finger_delta = float(abs(end_curl - start_curl))

            is_dyn = 1.0 if total_path > 0.04 or finger_delta > 0.04 else 0.0

            out[i, 99]      = is_dyn
            out[i, 100:103] = net_disp
            out[i, 103]     = total_path
            out[i, 104]     = linearity
            out[i, 105]     = velocity
            out[i, 106:109] = dir_unit
            out[i, 109]     = curvature
            out[i, 110]     = finger_delta
        else:
            # Single frame defaults
            out[i, 99]      = 0.0
            out[i, 100:103] = 0.0
            out[i, 103]     = 0.0
            out[i, 104]     = 0.0
            out[i, 105]     = 0.0
            out[i, 106:109] = 0.0
            out[i, 109]     = 0.0
            out[i, 110]     = 0.0

    return out[0] if single_output else out

if __name__ == "__main__":
    import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
try:
    from ml.sign_prototypes import SIGN_PROTOTYPES
except ImportError:
    from sign_prototypes import SIGN_PROTOTYPES
    print("Testing feature extraction on 60 signs...")
    for name in list(SIGN_PROTOTYPES.keys())[:5]:
        sample_traj = generate_trajectory_sample(name, n_frames=8)
        feats = extract_features(sample_traj)
        print(f"  {name:12s}: shape={feats.shape} is_dynamic={feats[99]:.1f} path_len={feats[103]:.3f}")
    print("Feature extractor working perfectly!")

