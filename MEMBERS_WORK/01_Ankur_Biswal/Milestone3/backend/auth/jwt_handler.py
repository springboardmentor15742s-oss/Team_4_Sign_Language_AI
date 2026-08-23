"""
JWT Authentication Handler — SignLearn AI
Provides token creation and verification for the FastAPI backend.
"""
import os
import time
import hashlib
import json
import base64
from typing import Optional

SECRET_KEY = os.getenv("JWT_SECRET", "signlearn-ai-secret-2026-team4-infosys")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

def _b64url_decode(s: str) -> bytes:
    pad = 4 - len(s) % 4
    return base64.urlsafe_b64decode(s + "=" * (pad % 4))

def create_access_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    """Create a JWT-like token (HMAC-SHA256 signed)."""
    header = _b64url(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    payload = dict(data)
    payload["exp"] = int(time.time()) + expires_minutes * 60
    payload["iat"] = int(time.time())
    encoded_payload = _b64url(json.dumps(payload).encode())
    signing_input = f"{header}.{encoded_payload}"
    import hmac
    sig = hmac.new(SECRET_KEY.encode(), signing_input.encode(), hashlib.sha256).digest()
    return f"{signing_input}.{_b64url(sig)}"

def decode_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT token. Returns payload dict or None if invalid."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}"
        import hmac
        expected_sig = hmac.new(SECRET_KEY.encode(), signing_input.encode(), hashlib.sha256).digest()
        expected_b64 = _b64url(expected_sig)
        # Constant-time comparison
        if not hmac.compare_digest(sig_b64, expected_b64):
            return None
        payload = json.loads(_b64url_decode(payload_b64))
        if payload.get("exp", 0) < time.time():
            return None  # Expired
        return payload
    except Exception:
        return None

def get_password_hash(password: str) -> str:
    """Hash a password using SHA-256 + salt."""
    salt = hashlib.sha256(SECRET_KEY.encode()).hexdigest()[:16]
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()

def verify_password(plain: str, hashed: str) -> bool:
    return get_password_hash(plain) == hashed
