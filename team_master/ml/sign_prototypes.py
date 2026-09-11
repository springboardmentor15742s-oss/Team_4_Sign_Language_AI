"""
SignLearn AI -- Comprehensive ASL Sign Prototypes (60 Signs)
============================================================
Defines rich biomechanical, 3D spatial, and kinetic parameters for all 60 signs:
- 5 finger extension states [thumb, index, middle, ring, pinky] (0.0=curled..1.0=extended)
- Thumb position mode ('side', 'across', 'under_index', 'under_middle', 'under_ring',
                       'tucked', 'touch_index', 'touch_middle', 'open_o', 'wide_l', 'spread', 'up_k')
- Finger splay mode ('touch', 'spread', 'cross', 'hook')
- 3D Palm normal vector [nx, ny, nz] (camera=[0,0,-1], inward=[0,0,1], up=[0,-1,0], down=[0,1,0], left=[-1,0,0], right=[1,0,0])
- Hand pointing direction [px, py, pz] (up=[0,-1,0], right=[1,0,0], down=[0,1,0], forward=[0,0,-1])
- Motion trajectory profile:
  - is_dynamic: bool
  - trajectory_type: 'static', 'wave_out', 'down_forward', 'circle_chest', 'nod_vertical',
                     'pinch_close', 'j_curve', 'z_zigzag', 'flip_down', 'clap_in', 'tap_chin',
                     'tap_wrist', 'shake_horizontal', 'wag_index', 'circle_index', 'chop_down',
                     'circle_horizontal', 'lift_up', 'tap_together'
"""

SIGN_PROTOTYPES = {
    # ── 26 ALPHABET LETTERS ──
    "A": {
        "finger_ext": [0.3, 0.0, 0.0, 0.0, 0.0],
        "thumb_pos": "side",          # Thumb alongside index MCP pointing UP
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],  # Facing camera
        "pointing_dir": [0.0, -1.0, 0.0], # Pointing up
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "B": {
        "finger_ext": [0.0, 1.0, 1.0, 1.0, 1.0],
        "thumb_pos": "across",        # Thumb tucked across palm
        "finger_splay": "touch",       # 4 fingers touching together
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "C": {
        "finger_ext": [0.5, 0.5, 0.5, 0.5, 0.5],
        "thumb_pos": "open_o",
        "finger_splay": "spread",
        "palm_normal": [-1.0, 0.0, 0.0],  # Facing sideways/inward
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "D": {
        "finger_ext": [0.2, 1.0, 0.0, 0.0, 0.0],
        "thumb_pos": "touch_middle",  # Thumb tip touches middle tip
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "E": {
        "finger_ext": [0.1, 0.15, 0.15, 0.15, 0.15],
        "thumb_pos": "tucked",        # Thumb tucked under all curled fingertips
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "F": {
        "finger_ext": [0.2, 0.1, 1.0, 1.0, 1.0],
        "thumb_pos": "touch_index",   # Thumb and index tips touch (circle)
        "finger_splay": "spread",      # Middle, ring, pinky spread apart
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "G": {
        "finger_ext": [0.8, 1.0, 0.0, 0.0, 0.0],
        "thumb_pos": "wide_l",
        "finger_splay": "touch",
        "palm_normal": [-1.0, 0.0, 0.0],  # Palm facing left/inward
        "pointing_dir": [1.0, 0.0, 0.0],  # Pointing horizontally right
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "H": {
        "finger_ext": [0.0, 1.0, 1.0, 0.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "touch",       # Index and middle horizontal & touching
        "palm_normal": [-1.0, 0.0, 0.0],
        "pointing_dir": [1.0, 0.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "I": {
        "finger_ext": [0.0, 0.0, 0.0, 0.0, 1.0],
        "thumb_pos": "across",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "J": {
        "finger_ext": [0.0, 0.0, 0.0, 0.0, 1.0],
        "thumb_pos": "across",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "j_curve",  # Pinky draws a J curve down and hooks up
        "wrist_start": [0.50, 0.60, 0.0],
    },
    "K": {
        "finger_ext": [0.6, 1.0, 0.8, 0.0, 0.0],
        "thumb_pos": "up_k",          # Thumb between index and middle pointing up
        "finger_splay": "spread",      # Index up, middle at 45 deg forward
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "L": {
        "finger_ext": [1.0, 1.0, 0.0, 0.0, 0.0],
        "thumb_pos": "wide_l",        # 90 deg between thumb and index
        "finger_splay": "spread",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "M": {
        "finger_ext": [0.2, 0.0, 0.0, 0.0, 0.0],
        "thumb_pos": "under_ring",    # Thumb under index, middle, ring (peeking at pinky)
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "N": {
        "finger_ext": [0.2, 0.0, 0.0, 0.0, 0.0],
        "thumb_pos": "under_middle",  # Thumb under index & middle (peeking at ring)
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "O": {
        "finger_ext": [0.4, 0.4, 0.4, 0.4, 0.4],
        "thumb_pos": "open_o",        # All 5 fingertips meet
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "P": {
        "finger_ext": [0.6, 1.0, 0.8, 0.0, 0.0],
        "thumb_pos": "up_k",
        "finger_splay": "spread",
        "palm_normal": [0.0, 1.0, 0.0],   # Palm facing DOWN
        "pointing_dir": [0.0, 1.0, 0.0],  # Pointing DOWNWARDS
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.60, 0.0],
    },
    "Q": {
        "finger_ext": [0.8, 1.0, 0.0, 0.0, 0.0],
        "thumb_pos": "wide_l",
        "finger_splay": "touch",
        "palm_normal": [0.0, 1.0, 0.0],   # Palm facing DOWN
        "pointing_dir": [0.0, 1.0, 0.0],  # Pointing DOWNWARDS
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.60, 0.0],
    },
    "R": {
        "finger_ext": [0.0, 1.0, 1.0, 0.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "cross",       # Index and middle CROSSED over each other
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "S": {
        "finger_ext": [0.2, 0.0, 0.0, 0.0, 0.0],
        "thumb_pos": "across",        # Thumb wrapped horizontally over all fingers
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "T": {
        "finger_ext": [0.3, 0.0, 0.0, 0.0, 0.0],
        "thumb_pos": "under_index",   # Thumb tucked between index and middle
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "U": {
        "finger_ext": [0.0, 1.0, 1.0, 0.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "touch",       # Index and middle pressed tight together
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "V": {
        "finger_ext": [0.0, 1.0, 1.0, 0.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "spread",      # Index and middle spread apart in V-shape
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "W": {
        "finger_ext": [0.0, 1.0, 1.0, 1.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "spread",      # Index, middle, ring spread apart
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "X": {
        "finger_ext": [0.0, 0.5, 0.0, 0.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "hook",        # Index bent in a hook
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "Y": {
        "finger_ext": [1.0, 0.0, 0.0, 0.0, 1.0],
        "thumb_pos": "spread",
        "finger_splay": "spread",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.70, 0.0],
    },
    "Z": {
        "finger_ext": [0.0, 1.0, 0.0, 0.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "z_zigzag", # Index traces Z zig-zag in air
        "wrist_start": [0.45, 0.60, 0.0],
    },

    # ── 25 COMMON WORDS (Many are inherently dynamic) ──
    "HELLO": {
        "finger_ext": [0.9, 1.0, 1.0, 1.0, 1.0],
        "thumb_pos": "spread",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "wave_out", # Near temple [0.55, 0.30] moving outward to [0.72, 0.25]
        "wrist_start": [0.55, 0.35, 0.0],
    },
    "THANK_YOU": {
        "finger_ext": [0.8, 1.0, 1.0, 1.0, 1.0],
        "thumb_pos": "spread",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, 1.0],   # Starts palm toward chin, moves forward
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "down_forward", # From chin [0.50, 0.38] moving down-forward [0.50, 0.65]
        "wrist_start": [0.50, 0.40, -0.05],
    },
    "PLEASE": {
        "finger_ext": [0.8, 1.0, 1.0, 1.0, 1.0],
        "thumb_pos": "spread",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, 1.0],   # Palm flat against chest
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "circle_chest", # Circles clockwise against chest [0.50, 0.55]
        "wrist_start": [0.50, 0.55, 0.05],
    },
    "YES": {
        "finger_ext": [0.2, 0.0, 0.0, 0.0, 0.0],
        "thumb_pos": "across",        # S-fist
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "nod_vertical", # S-fist nods up and down
        "wrist_start": [0.50, 0.55, 0.0],
    },
    "NO": {
        "finger_ext": [0.6, 0.8, 0.8, 0.0, 0.0],
        "thumb_pos": "spread",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "pinch_close", # Index + middle snap closed onto thumb
        "wrist_start": [0.50, 0.55, 0.0],
    },
    "HELP": {
        "finger_ext": [0.9, 0.0, 0.0, 0.0, 0.0],
        "thumb_pos": "side",          # Thumbs-up fist
        "finger_splay": "touch",
        "palm_normal": [-1.0, 0.0, 0.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "lift_up", # Thumbs-up fist lifts upward
        "wrist_start": [0.50, 0.65, 0.0],
    },
    "LOVE": {
        "finger_ext": [0.2, 0.0, 0.0, 0.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, 1.0],   # Fist pressed against opposite chest
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.45, 0.50, 0.05],
    },
    "SORRY": {
        "finger_ext": [0.2, 0.0, 0.0, 0.0, 0.0],
        "thumb_pos": "across",        # A/S fist
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, 1.0],   # Fist against chest
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "circle_chest", # Fist circles against chest
        "wrist_start": [0.50, 0.52, 0.05],
    },
    "GOOD": {
        "finger_ext": [0.8, 1.0, 1.0, 1.0, 1.0],
        "thumb_pos": "spread",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, 1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "down_forward", # From chin down to chest height
        "wrist_start": [0.50, 0.40, 0.0],
    },
    "BAD": {
        "finger_ext": [0.8, 1.0, 1.0, 1.0, 1.0],
        "thumb_pos": "spread",
        "finger_splay": "touch",
        "palm_normal": [0.0, 1.0, 0.0],   # Flips palm DOWN
        "pointing_dir": [0.0, 0.0, -1.0],
        "is_dynamic": True,
        "trajectory_type": "flip_down",    # Chin down, flips palm facing floor
        "wrist_start": [0.50, 0.40, 0.0],
    },
    "NAME": {
        "finger_ext": [0.0, 1.0, 1.0, 0.0, 0.0],
        "thumb_pos": "across",        # H-hand
        "finger_splay": "touch",
        "palm_normal": [-1.0, 0.0, 0.0],
        "pointing_dir": [1.0, 0.0, 0.0],  # Horizontal pointing
        "is_dynamic": True,
        "trajectory_type": "nod_vertical", # H-hands tap together twice
        "wrist_start": [0.50, 0.55, 0.0],
    },
    "NICE": {
        "finger_ext": [0.8, 1.0, 1.0, 1.0, 1.0],
        "thumb_pos": "spread",
        "finger_splay": "touch",
        "palm_normal": [0.0, 1.0, 0.0],   # Palm facing down, sliding forward
        "pointing_dir": [0.0, 0.0, -1.0], # Pointing forward
        "is_dynamic": True,
        "trajectory_type": "down_forward", # Flat hand slides forward over palm
        "wrist_start": [0.50, 0.60, 0.0],
    },
    "HOME": {
        "finger_ext": [0.4, 0.4, 0.4, 0.4, 0.4],
        "thumb_pos": "open_o",        # Flattened O hand
        "finger_splay": "touch",
        "palm_normal": [-1.0, 0.0, 0.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "tap_chin",     # Taps chin then moves back to ear
        "wrist_start": [0.55, 0.40, 0.0],
    },
    "EAT": {
        "finger_ext": [0.4, 0.4, 0.4, 0.4, 0.4],
        "thumb_pos": "open_o",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, 1.0],   # Facing mouth
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "tap_chin",     # Taps toward mouth repeatedly
        "wrist_start": [0.50, 0.38, 0.0],
    },
    "WATER": {
        "finger_ext": [0.0, 1.0, 1.0, 1.0, 0.0],
        "thumb_pos": "across",        # W-hand
        "finger_splay": "spread",
        "palm_normal": [-1.0, 0.0, 0.0],  # Palm facing left
        "pointing_dir": [0.0, -1.0, 0.0], # Pointing up at chin
        "is_dynamic": True,
        "trajectory_type": "tap_chin",     # W-hand taps against chin twice
        "wrist_start": [0.52, 0.38, 0.0],
    },
    "TIME": {
        "finger_ext": [0.0, 1.0, 0.0, 0.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "touch",
        "palm_normal": [0.0, 1.0, 0.0],   # Palm down pointing at wrist
        "pointing_dir": [0.0, 1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "tap_wrist",    # Index taps wrist twice
        "wrist_start": [0.45, 0.65, 0.0],
    },
    "WHAT": {
        "finger_ext": [1.0, 1.0, 1.0, 1.0, 1.0],
        "thumb_pos": "spread",
        "finger_splay": "spread",
        "palm_normal": [0.0, -1.0, 0.0],  # Palms facing UP
        "pointing_dir": [0.0, 0.0, -1.0], # Pointing forward
        "is_dynamic": True,
        "trajectory_type": "shake_horizontal", # Hands shake side-to-side horizontally
        "wrist_start": [0.50, 0.65, 0.0],
    },
    "WHERE": {
        "finger_ext": [0.0, 1.0, 0.0, 0.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "wag_index",    # Index finger wags left and right
        "wrist_start": [0.50, 0.50, 0.0],
    },
    "WHEN": {
        "finger_ext": [0.0, 1.0, 0.0, 0.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "circle_index", # Index circles in vertical circle
        "wrist_start": [0.50, 0.50, 0.0],
    },
    "HOW": {
        "finger_ext": [0.3, 0.3, 0.3, 0.3, 0.3],
        "thumb_pos": "open_o",
        "finger_splay": "touch",
        "palm_normal": [0.0, 1.0, 0.0],   # Starts palms down, rolls palms up
        "pointing_dir": [0.0, 0.0, -1.0],
        "is_dynamic": True,
        "trajectory_type": "flip_down",
        "wrist_start": [0.50, 0.60, 0.0],
    },
    "WHO": {
        "finger_ext": [0.8, 0.5, 0.0, 0.0, 0.0],
        "thumb_pos": "touch_chin",    # Thumb tip at chin
        "finger_splay": "touch",
        "palm_normal": [-1.0, 0.0, 0.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "wag_index",    # Index curls and uncurls
        "wrist_start": [0.50, 0.40, 0.0],
    },
    "WHY": {
        "finger_ext": [1.0, 0.0, 0.0, 0.0, 1.0], # Drops into Y hand
        "thumb_pos": "spread",
        "finger_splay": "spread",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "down_forward", # Forehead down into Y-shape
        "wrist_start": [0.55, 0.30, 0.0],
    },
    "MORE": {
        "finger_ext": [0.4, 0.4, 0.4, 0.4, 0.4],
        "thumb_pos": "open_o",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [1.0, 0.0, 0.0],  # Pointing inward to center
        "is_dynamic": True,
        "trajectory_type": "tap_together", # Both flattened O-hands tap together
        "wrist_start": [0.45, 0.60, 0.0],
    },
    "STOP": {
        "finger_ext": [0.0, 1.0, 1.0, 1.0, 1.0],
        "thumb_pos": "across",
        "finger_splay": "touch",
        "palm_normal": [-1.0, 0.0, 0.0],  # Edge of hand down
        "pointing_dir": [0.0, 0.0, -1.0],
        "is_dynamic": True,
        "trajectory_type": "chop_down",    # Chops straight down onto flat palm
        "wrist_start": [0.50, 0.45, 0.0],
    },
    "FRIEND": {
        "finger_ext": [0.0, 0.6, 0.0, 0.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "hook",        # Curved index hook
        "palm_normal": [0.0, 1.0, 0.0],
        "pointing_dir": [1.0, 0.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "tap_together", # Hook index fingers together
        "wrist_start": [0.50, 0.55, 0.0],
    },

    # ── 9 TWO-HANDED GESTURES ──
    "NAMASTE": {
        "finger_ext": [0.8, 1.0, 1.0, 1.0, 1.0],
        "thumb_pos": "spread",
        "finger_splay": "touch",
        "palm_normal": [-1.0, 0.0, 0.0],  # Palms facing EACH OTHER (pressed)
        "pointing_dir": [0.0, -1.0, 0.0], # Pointing up at center chest
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.60, 0.0],
    },
    "PEACE": {
        "finger_ext": [0.0, 1.0, 1.0, 0.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "spread",      # V-shape
        "palm_normal": [0.0, 0.0, -1.0],  # Facing camera
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.60, 0.0],
    },
    "FAMILY": {
        "finger_ext": [0.2, 0.1, 1.0, 1.0, 1.0], # F-hands
        "thumb_pos": "touch_index",
        "finger_splay": "spread",
        "palm_normal": [0.0, 0.0, -1.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "circle_horizontal", # F-hands touch, circle around, touch pinkies
        "wrist_start": [0.45, 0.55, 0.0],
    },
    "TOGETHER": {
        "finger_ext": [0.2, 0.2, 0.2, 0.2, 0.2],
        "thumb_pos": "across",
        "finger_splay": "touch",
        "palm_normal": [-1.0, 0.0, 0.0],  # Fists together
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "circle_horizontal", # Fists circle together horizontally
        "wrist_start": [0.50, 0.58, 0.0],
    },
    "CLAP": {
        "finger_ext": [0.8, 1.0, 1.0, 1.0, 1.0],
        "thumb_pos": "spread",
        "finger_splay": "spread",
        "palm_normal": [-1.0, 0.0, 0.0],  # Palms facing center
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "clap_in",      # Rapid movement towards center and recoil
        "wrist_start": [0.35, 0.60, 0.0],
    },
    "PRAY": {
        "finger_ext": [0.8, 1.0, 1.0, 1.0, 1.0],
        "thumb_pos": "spread",
        "finger_splay": "touch",
        "palm_normal": [-1.0, 0.0, 0.0],  # Palms pressed together
        "pointing_dir": [0.0, -1.0, -0.2],# Pointing slightly forward-up
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.50, 0.60, 0.0],
    },
    "HELP_TWO": {
        "finger_ext": [0.9, 0.0, 0.0, 0.0, 0.0],
        "thumb_pos": "side",
        "finger_splay": "touch",
        "palm_normal": [-1.0, 0.0, 0.0],
        "pointing_dir": [0.0, -1.0, 0.0],
        "is_dynamic": True,
        "trajectory_type": "lift_up",      # Lifting motion with both hands
        "wrist_start": [0.50, 0.65, 0.0],
    },
    "LOVE_TWO": {
        "finger_ext": [0.1, 0.0, 0.0, 0.0, 0.0],
        "thumb_pos": "across",
        "finger_splay": "touch",
        "palm_normal": [0.0, 0.0, 1.0],   # Both crossed arms hugging chest
        "pointing_dir": [-0.5, -0.8, 0.0],
        "is_dynamic": False,
        "trajectory_type": "static",
        "wrist_start": [0.45, 0.50, 0.08],
    },
    "SHARE": {
        "finger_ext": [0.0, 1.0, 1.0, 1.0, 1.0],
        "thumb_pos": "across",
        "finger_splay": "touch",
        "palm_normal": [-1.0, 0.0, 0.0],  # Edge of hand
        "pointing_dir": [0.0, 0.0, -1.0],
        "is_dynamic": True,
        "trajectory_type": "shake_horizontal", # Slides back and forth on base palm
        "wrist_start": [0.50, 0.60, 0.0],
    },
}
