# API Specification — Authentication & Learner Profile Module

**Project:** AI-Powered Sign Language Learning Platform
**Document Type:** REST API Specification (Design-Only, No Implementation)
**Module:** Authentication & Learner Profile
**Location in Repository:** `docs/api-specification.md`

---

## API Overview

The Authentication & Learner Profile module is the entry point of the AI-Powered Sign Language Learning Platform. It is responsible for two core responsibilities:

1. **Authentication** — registering new users, verifying credentials at login, and issuing a JSON Web Token (JWT) that identifies the user on subsequent requests.
2. **Learner Profile Management** — exposing the authenticated learner's profile data (learning level, progress, streaks, accuracy, etc.) and allowing controlled updates to that profile.

Every other module in the platform — lesson delivery, gesture recognition, assessments, gamification — depends on a valid identity established by this module. Accordingly, this specification defines the contract (endpoints, payloads, status codes, and validation rules) that the frontend and backend teams must implement against. **This document describes the API contract only; it does not include backend implementation code.**

---

## Authentication

The platform uses **JSON Web Token (JWT)** authentication, a stateless mechanism suited to a microservice-based backend.

**How it works, in simple terms:**

1. A user registers or logs in with valid credentials.
2. On successful login, the backend generates a signed JWT containing the user's identity (`userId`, `role`) and an expiry time.
3. The token is returned to the client, which stores it (e.g., in memory or secure storage) and attaches it to every subsequent request to a protected endpoint.
4. The backend verifies the token's signature and expiry on each request before processing it. No server-side session is stored — the token itself is the proof of identity.

**Protected endpoints require the following header:**

```
Authorization: Bearer <JWT_TOKEN>
```

Requests to protected endpoints without a valid, non-expired token are rejected with a `401 Unauthorized` response.

---

## 1. POST /auth/register

### Purpose
Registers a new user account with an assigned role (Learner, Instructor, or Admin).

### Endpoint
```
/auth/register
```

### HTTP Method
`POST`

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | `application/json` | Yes |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full name of the user |
| `email` | string | Yes | Unique email address, used as login identifier |
| `password` | string | Yes | Plain-text password (hashed server-side before storage) |
| `role` | string | Yes | One of: `Learner`, `Instructor`, `Admin` |

### Validation Rules
- `name`: required, 2–100 characters.
- `email`: required, must match a valid email format (`user@domain.tld`), must be unique across the system.
- `password`: required, minimum 8 characters, at least one letter and one number.
- `role`: required, must be one of the enumerated values (`Learner`, `Instructor`, `Admin`); any other value is rejected.

### Success Response — `201 Created`

Returned when the account is created successfully.

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "usr_8f21c3",
    "name": "Ayesha Khan",
    "email": "ayesha.khan@example.com",
    "role": "Learner",
    "createdAt": "2026-07-27T09:15:00Z"
  }
}
```

### Error Responses

| Status Code | Scenario | Example Response |
|--------------|----------|-------------------|
| `400 Bad Request` | Missing/invalid fields (e.g., malformed email, short password) | `{ "success": false, "error": "VALIDATION_ERROR", "message": "Password must be at least 8 characters long" }` |
| `409 Conflict` | Email already registered | `{ "success": false, "error": "EMAIL_EXISTS", "message": "An account with this email already exists" }` |
| `500 Internal Server Error` | Unexpected server/database failure | `{ "success": false, "error": "SERVER_ERROR", "message": "Something went wrong. Please try again later" }` |

### Example Request

```json
POST /auth/register
Content-Type: application/json

{
  "name": "Ayesha Khan",
  "email": "ayesha.khan@example.com",
  "password": "Learn@2026",
  "role": "Learner"
}
```

---

## 2. POST /auth/login

### Purpose
Authenticates an existing user with email and password, and issues a JWT for use with protected endpoints.

### Endpoint
```
/auth/login
```

### HTTP Method
`POST`

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | `application/json` | Yes |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Registered email address |
| `password` | string | Yes | Account password |

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfOGYyMWMzIiwicm9sZSI6IkxlYXJuZXIiLCJpYXQiOjE3NTM2MDQ1MDAsImV4cCI6MTc1MzY5MDkwMH0.s3cr3t-signature-placeholder",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "userId": "usr_8f21c3",
      "name": "Ayesha Khan",
      "role": "Learner"
    }
  }
}
```

**JWT Payload Example (decoded, for reference only):**

```json
{
  "userId": "usr_8f21c3",
  "role": "Learner",
  "iat": 1753604500,
  "exp": 1753690900
}
```

### Error Responses

| Status Code | Scenario | Example Response |
|--------------|----------|-------------------|
| `401 Unauthorized` | Incorrect email or password | `{ "success": false, "error": "INVALID_CREDENTIALS", "message": "Email or password is incorrect" }` |
| `500 Internal Server Error` | Unexpected server/database failure | `{ "success": false, "error": "SERVER_ERROR", "message": "Something went wrong. Please try again later" }` |

### Example Request

```json
POST /auth/login
Content-Type: application/json

{
  "email": "ayesha.khan@example.com",
  "password": "Learn@2026"
}
```

---

## 3. GET /profile

### Purpose
Retrieves the profile of the currently authenticated learner.

### Endpoint
```
/profile
```

### HTTP Method
`GET`

### Authorization Header

| Header | Value | Required |
|--------|-------|----------|
| Authorization | `Bearer <JWT_TOKEN>` | Yes |

### Success Response — `200 OK`

```json
{
  "success": true,
  "data": {
    "userId": "usr_8f21c3",
    "name": "Ayesha Khan",
    "email": "ayesha.khan@example.com",
    "role": "Learner",
    "learningLevel": "Intermediate",
    "preferredLanguage": "ASL",
    "completedLessons": 24,
    "currentModule": "Everyday Communication - Module 3",
    "accuracy": 87.5,
    "learningStreak": 12,
    "createdAt": "2026-05-10T08:30:00Z"
  }
}
```

### Profile Field Reference

| Field | Type | Description |
|-------|------|--------------|
| `userId` | string | Unique identifier of the user |
| `name` | string | Full name |
| `email` | string | Registered email address |
| `role` | string | Account role (`Learner`, `Instructor`, `Admin`) |
| `learningLevel` | string | Current proficiency level (`Beginner`, `Intermediate`, `Advanced`) |
| `preferredLanguage` | string | Preferred sign language variant (e.g., `ASL`, `BSL`) |
| `completedLessons` | integer | Count of lessons completed |
| `currentModule` | string | Name/identifier of the module currently in progress |
| `accuracy` | number | Rolling average gesture recognition accuracy (%) |
| `learningStreak` | integer | Current consecutive-day practice streak |
| `createdAt` | string (ISO 8601) | Account creation timestamp |

### Error Responses

| Status Code | Scenario | Example Response |
|--------------|----------|-------------------|
| `401 Unauthorized` | Missing, invalid, or expired token | `{ "success": false, "error": "UNAUTHORIZED", "message": "Authentication token is missing or invalid" }` |
| `404 Not Found` | Profile not found for the given user | `{ "success": false, "error": "PROFILE_NOT_FOUND", "message": "Learner profile does not exist" }` |
| `500 Internal Server Error` | Unexpected server/database failure | `{ "success": false, "error": "SERVER_ERROR", "message": "Something went wrong. Please try again later" }` |

### Example Request

```
GET /profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 4. PUT /profile

### Purpose
Updates editable fields of the authenticated learner's profile.

### Endpoint
```
/profile
```

### HTTP Method
`PUT`

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Authorization | `Bearer <JWT_TOKEN>` | Yes |
| Content-Type | `application/json` | Yes |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Updated full name |
| `preferredLanguage` | string | No | Updated preferred sign language variant |
| `learningLevel` | string | No | Learner-requested level change (`Beginner`, `Intermediate`, `Advanced`) |

> Only the fields listed above are editable through this endpoint. System-managed fields (`userId`, `email`, `role`, `completedLessons`, `accuracy`, `learningStreak`, `currentModule`, `createdAt`) are read-only and cannot be modified via this request.

### Validation
- At least one editable field must be present in the request body.
- `name`, if provided: 2–100 characters.
- `preferredLanguage`, if provided: must be a supported sign language code (e.g., `ASL`, `BSL`, `ISL`).
- `learningLevel`, if provided: must be one of `Beginner`, `Intermediate`, `Advanced`.
- Any attempt to modify a read-only field is ignored by the server and does not cause a failure.

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "userId": "usr_8f21c3",
    "name": "Ayesha M. Khan",
    "preferredLanguage": "ASL",
    "learningLevel": "Advanced"
  }
}
```

### Error Responses

| Status Code | Scenario | Example Response |
|--------------|----------|-------------------|
| `400 Bad Request` | Invalid field value (e.g., unsupported `learningLevel`) | `{ "success": false, "error": "VALIDATION_ERROR", "message": "learningLevel must be one of Beginner, Intermediate, Advanced" }` |
| `401 Unauthorized` | Missing, invalid, or expired token | `{ "success": false, "error": "UNAUTHORIZED", "message": "Authentication token is missing or invalid" }` |
| `404 Not Found` | Profile not found for the given user | `{ "success": false, "error": "PROFILE_NOT_FOUND", "message": "Learner profile does not exist" }` |
| `500 Internal Server Error` | Unexpected server/database failure | `{ "success": false, "error": "SERVER_ERROR", "message": "Something went wrong. Please try again later" }` |

### Example Request

```json
PUT /profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Ayesha M. Khan",
  "preferredLanguage": "ASL",
  "learningLevel": "Advanced"
}
```

---

## 5. GET /datasets

### Purpose
Returns the list of all datasets integrated into the platform's gesture recognition pipeline (e.g., MNIST, ASL Alphabet, WLASL, RWTH-PHOENIX).

### Endpoint
```
/datasets
```

### HTTP Method
`GET`

### Authentication Requirement
Required. Any authenticated user (`Learner`, `Instructor`, `Admin`) may access this endpoint.

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Authorization | `Bearer <JWT_TOKEN>` | Yes |

### Request Parameters
None.

### Success Response — `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "dataset_key": "asl_alphabet",
      "dataset_name": "ASL Alphabet Dataset",
      "number_of_classes": 29
    },
    {
      "dataset_key": "sign_mnist",
      "dataset_name": "Sign Language MNIST Dataset",
      "number_of_classes": 24
    },
    {
      "dataset_key": "wlasl",
      "dataset_name": "WLASL (Word-Level American Sign Language)",
      "number_of_classes": 2000
    },
    {
      "dataset_key": "rwth_phoenix",
      "dataset_name": "RWTH-PHOENIX Dataset",
      "number_of_classes": 1080
    }
  ]
}
```

### Error Responses

| Status Code | Scenario | Example Response |
|--------------|----------|-------------------|
| `401 Unauthorized` | Missing, invalid, or expired token | `{ "success": false, "error": "UNAUTHORIZED", "message": "Authentication token is missing or invalid" }` |
| `500 Internal Server Error` | Unexpected server/database failure | `{ "success": false, "error": "SERVER_ERROR", "message": "Something went wrong. Please try again later" }` |

### Example Request

```
GET /datasets
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Status Codes

| Code | Meaning |
|------|---------|
| `200` | Dataset list returned successfully |
| `401` | Authentication token missing or invalid |
| `500` | Server/database failure |

---

## 6. GET /datasets/{dataset_key}

### Purpose
Returns detailed information about a single selected dataset.

### Endpoint
```
/datasets/{dataset_key}
```

### HTTP Method
`GET`

### Authentication Requirement
Required. Any authenticated user (`Learner`, `Instructor`, `Admin`) may access this endpoint.

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Authorization | `Bearer <JWT_TOKEN>` | Yes |

### Path Parameter

| Parameter | Type | Required | Description |
|-----------|------|----------|--------------|
| `dataset_key` | string | Yes | Unique identifier of the dataset (e.g., `asl_alphabet`, `sign_mnist`, `wlasl`, `rwth_phoenix`) |

### Validation
- `dataset_key` must correspond to a dataset registered in the platform's dataset registry.
- Unknown or misspelled `dataset_key` values result in a `404 Not Found` response.

### Example Request

```
GET /datasets/wlasl
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "data": {
    "dataset_key": "wlasl",
    "dataset_name": "WLASL (Word-Level American Sign Language)",
    "description": "A large-scale dataset for word-level American Sign Language recognition, used for dynamic sign and continuous sign language learning.",
    "number_of_classes": 2000,
    "class_labels": ["hello", "thank you", "please", "..."],
    "resolution": "1920x1080 (source video, resized to 224x224 for model input)",
    "data_format": "MP4 video clips with per-frame hand/pose landmark annotations",
    "sample_count": 21083,
    "language": "American Sign Language (ASL)",
    "source": "WLASL public research dataset"
  }
}
```

### Error Responses

| Status Code | Scenario | Example Response |
|--------------|----------|-------------------|
| `401 Unauthorized` | Missing, invalid, or expired token | `{ "success": false, "error": "UNAUTHORIZED", "message": "Authentication token is missing or invalid" }` |
| `404 Not Found` | `dataset_key` does not match any registered dataset | `{ "success": false, "error": "DATASET_NOT_FOUND", "message": "No dataset found for key 'xyz'" }` |
| `500 Internal Server Error` | Unexpected server/database failure | `{ "success": false, "error": "SERVER_ERROR", "message": "Something went wrong. Please try again later" }` |

### Status Codes

| Code | Meaning |
|------|---------|
| `200` | Dataset details returned successfully |
| `401` | Authentication token missing or invalid |
| `404` | Dataset key not found |
| `500` | Server/database failure |

---

## 7. POST /profile/goals

### Purpose
Allows a learner to set or update their personal learning goals.

### Endpoint
```
/profile/goals
```

### HTTP Method
`POST`

### Authentication
Required.

| Header | Value | Required |
|--------|-------|----------|
| Authorization | `Bearer <JWT_TOKEN>` | Yes |
| Content-Type | `application/json` | Yes |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `goals` | array of strings | Yes | One or more learning goals selected by the learner |

**Allowed goal values:** `"Learn ASL Alphabet"`, `"Learn Numbers"`, `"Daily Practice"`, `"Improve Accuracy"`, `"Conversation Skills"`, `"Beginner"`, `"Intermediate"`, `"Advanced"`

### Validation Rules
- `goals`: required, must be a non-empty array.
- Each value in `goals` must exactly match one of the allowed goal values listed above.
- Duplicate values within the same request are de-duplicated server-side rather than rejected.

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Learning goals updated successfully",
  "data": {
    "userId": "usr_8f21c3",
    "goals": ["Learn ASL Alphabet", "Daily Practice", "Improve Accuracy"]
  }
}
```

### Error Responses

| Status Code | Scenario | Example Response |
|--------------|----------|-------------------|
| `400 Bad Request` | `goals` missing, empty, or contains an unrecognized value | `{ "success": false, "error": "VALIDATION_ERROR", "message": "goals contains an invalid value: 'Fluent Speaker'" }` |
| `401 Unauthorized` | Missing, invalid, or expired token | `{ "success": false, "error": "UNAUTHORIZED", "message": "Authentication token is missing or invalid" }` |
| `500 Internal Server Error` | Unexpected server/database failure | `{ "success": false, "error": "SERVER_ERROR", "message": "Something went wrong. Please try again later" }` |

### Example Request

```json
POST /profile/goals
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "goals": ["Learn ASL Alphabet", "Daily Practice", "Improve Accuracy"]
}
```

### Status Codes

| Code | Meaning |
|------|---------|
| `200` | Learning goals updated successfully |
| `400` | Invalid or missing `goals` field |
| `401` | Authentication token missing or invalid |
| `500` | Server/database failure |

---

## 8. GET /api/ai/supported-signs

### Purpose
List signs supported/exposed by the practice API.

### Endpoint
```
/api/ai/supported-signs
```

### HTTP Method
`GET`

### Authentication Requirement
Not specified in the provided route implementation.

### Request Parameters
None.

### Response Format
The backend returns exactly the following structure:

- `alphabet` — the letters A–Z.
- `dynamic_words` — a fixed list of six dynamic/word-level signs: `HELLO`, `THANK YOU`, `YES`, `NO`, `PLEASE`, `SORRY`.
- `all` — `alphabet` concatenated with `dynamic_words`.
- `note` — a static message explaining that the current landmark classifier is optimized for alphabet signs; dynamic words are exposed for UI planning and later sequence-model integration, **not** because the classifier currently recognizes them.

### Exact Example Response

```json
{
  "alphabet": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  "dynamic_words": ["HELLO", "THANK YOU", "YES", "NO", "PLEASE", "SORRY"],
  "all": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "HELLO", "THANK YOU", "YES", "NO", "PLEASE", "SORRY"],
  "note": "The current landmark classifier is optimized for alphabet signs; dynamic words are exposed for UI planning and later sequence-model integration."
}
```

### Response Field Descriptions

| Field | Type | Description |
|-------|------|--------------|
| `alphabet` | array of strings | The 26 letters A–Z, supported by the current landmark classifier. |
| `dynamic_words` | array of strings | Six word-level signs (`HELLO`, `THANK YOU`, `YES`, `NO`, `PLEASE`, `SORRY`) exposed for UI planning and future sequence-model integration — **not currently recognized by the classifier**. |
| `all` | array of strings | `alphabet` + `dynamic_words` combined, in that order. |
| `note` | string | Static explanatory text clarifying that the classifier is optimized for alphabet signs and that dynamic words are forward-looking/UI-planning entries. |

### Example Request

```
GET /api/ai/supported-signs
```

### Status/Error Behavior
No error responses are defined in the provided route implementation for this endpoint; only a successful response is confirmed.

| Code | Meaning |
|------|---------|
| `200` | Supported signs list returned successfully |

---

## 9. POST /api/ai/evaluate

### Purpose
Evaluate hand landmarks and predict sign gesture.

### Endpoint
```
/api/ai/evaluate
```

### HTTP Method
`POST`

### Authentication Requirement
Not specified in the provided route implementation.

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | `application/json` | Yes |

### Request Parameters
None (all input is provided in the request body).

### Request Body (`EvaluateRequest`)

| Field | Type | Required | Description |
|-------|------|----------|--------------|
| `landmarks` | `list[Any]`, optional | One of `landmarks` / `landmarks_flat` required | MediaPipe hand landmarks. Expected to contain 21 landmarks; each landmark can be represented as `{x, y, z}`. A `(21, 3)` nested list is also supported. |
| `landmarks_flat` | `list[float]`, optional | One of `landmarks` / `landmarks_flat` required | Optional flat 63-float MediaPipe landmark vector, representing 21 landmarks × 3 coordinates. |
| `sign_name` | string, optional, max length 32 | No | Target sign selected by the learner; alias for `expected_sign`. The backend strips whitespace and converts the value to uppercase. |
| `expected_sign` | string, optional, max length 32 | No | Target sign for practice/quiz. The backend strips whitespace and converts the value to uppercase. If `expected_sign` is missing but `sign_name` is provided, the backend automatically sets `expected_sign = sign_name`. |
| `session_id` | string, optional, max length 64 | No | Client-supplied identifier for a practice/quiz attempt. |
| `source` | literal, optional | No | One of `webcam`, `upload`, `dataset`, `test`. Defaults to `webcam` if omitted. |

### Landmark Resolution and Validation
- The endpoint resolves the landmark payload by using `landmarks_flat` if it is provided; otherwise it uses `landmarks`.
- If **both** `landmarks` and `landmarks_flat` are missing, the backend raises `422 Unprocessable Entity` with:
  ```json
  {
    "detail": "Provide landmarks or landmarks_flat"
  }
  ```
- `sign_name` and `expected_sign` are both normalized by the backend (whitespace stripped, converted to uppercase).

### Example Request

**Using `landmarks` — abbreviated for documentation.** The example below shows a single landmark object for brevity only; a real production request must contain all **21** MediaPipe landmarks in the `landmarks` array.

```json
POST /api/ai/evaluate
Content-Type: application/json

{
  "sign_name": "A",
  "landmarks": [
    { "x": 0.51, "y": 0.72, "z": 0.0 }
  ],
  "session_id": "practice-001",
  "source": "webcam"
}
```

**Using `landmarks_flat` — alternative form.** `landmarks_flat` must contain exactly 63 float values (21 landmarks × 3 coordinates); actual values are omitted here rather than inventing them:

```json
{
  "sign_name": "A",
  "landmarks_flat": [ /* 63 floating-point values */ ]
}
```

### Success Response — `200 OK` (`EvaluateResponse`)

`EvaluateResponse` contains exactly the following fields:

```json
{
  "predicted_sign": "A",
  "accuracy_percentage": 92.5,
  "is_correct": true,
  "corrections": [
    "Hand angle optimal",
    "Good thumb position"
  ]
}
```

### Response Field Descriptions

| Field | Type | Description |
|-------|------|--------------|
| `predicted_sign` | string | The sign predicted by the gesture classifier. |
| `accuracy_percentage` | float | The gesture accuracy score returned by the classifier. |
| `is_correct` | boolean | Whether the predicted sign matches the expected sign. |
| `corrections` | list of strings | A list of coaching/correction messages generated for the learner. |

### Error Responses

| Status Code | Scenario | Response Body |
|--------------|----------|-----------------|
| `422 Unprocessable Entity` | Neither `landmarks` nor `landmarks_flat` is provided, or landmark validation fails | `{ "detail": "Provide landmarks or landmarks_flat" }` (shown for the missing-landmarks case) |
| `503 Service Unavailable` | The gesture model is unavailable (backend catches gesture model failures) | `{ "detail": "Gesture model unavailable: ..." }` |

> Other standard FastAPI error responses (e.g., `500` for an unhandled server exception) may be possible as general framework behavior, but are not explicitly confirmed by the provided route implementation.

### Additional Related Endpoints
`POST /api/ai/evaluate/detailed` and `GET /api/ai/health` also exist on this router but are outside the scope of this task; see [Implementation Notes](#implementation-notes).

---

## HTTP Status Codes

| Code | Meaning | Used When |
|------|---------|-----------|
| `200 OK` | Request succeeded | Successful `GET`/`PUT` operations |
| `201 Created` | Resource created successfully | Successful `POST /auth/register` |
| `400 Bad Request` | Client sent invalid or malformed data | Failed validation on request fields |
| `401 Unauthorized` | Authentication missing or invalid | Bad login credentials, missing/expired/invalid JWT |
| `403 Forbidden` | Authenticated but not permitted | Valid token, but role lacks permission for the action |
| `404 Not Found` | Requested resource does not exist | Profile not found for the authenticated user |
| `409 Conflict` | Request conflicts with existing state | Duplicate email during registration |
| `500 Internal Server Error` | Unexpected failure on the server | Database/service failure not caused by client input |

---

## Validation Rules

Consolidated validation rules applied across this module's endpoints:

| Rule | Applies To | Description |
|------|-------------|--------------|
| Email format | `email` | Must match a standard email pattern (`local-part@domain.tld`) |
| Email uniqueness | `email` | Must not already exist in the `users` collection/table |
| Password length | `password` | Minimum 8 characters, at least one letter and one number |
| Required fields | `name`, `email`, `password`, `role` (register); `email`, `password` (login) | Request is rejected with `400` if any required field is missing |
| Valid role values | `role` | Must be exactly one of `Learner`, `Instructor`, `Admin` |
| Valid learning level | `learningLevel` | Must be one of `Beginner`, `Intermediate`, `Advanced` |
| Token presence and validity | All protected endpoints | A syntactically valid, unexpired, correctly signed JWT must be present in the `Authorization` header |

---

## API Workflow

The diagram below shows the typical client journey through this module, from registration to profile management.

```mermaid
flowchart TD
    A[Register: POST /auth/register] --> B[Login: POST /auth/login]
    B --> C[Receive JWT Token]
    C --> D[Access Protected APIs with Authorization Header]
    D --> E[Get Profile: GET /profile]
    D --> F[Update Profile: PUT /profile]
    E --> G[View Learning Progress and Stats]
    F --> G
```

---

## Sequence Diagram

The following sequence diagram illustrates the interactions between the User, Frontend, Backend API, and Database during registration and login.

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant D as Database

    U->>F: Enter registration details
    F->>B: POST /auth/register
    B->>D: Check if email already exists
    D-->>B: Email not found
    B->>B: Hash password
    B->>D: Insert new user record
    D-->>B: User created
    B-->>F: 201 Created (user data)
    F-->>U: Show registration success

    U->>F: Enter login credentials
    F->>B: POST /auth/login
    B->>D: Fetch user by email
    D-->>B: User record with hashed password
    B->>B: Verify password hash
    B->>B: Generate signed JWT
    B-->>F: 200 OK (JWT token)
    F-->>U: Store token, redirect to dashboard
```

---

## Sequence Diagram — Gesture Recognition Pipeline

The following sequence diagram illustrates the interactions between the Client, API Gateway, Dataset Preprocessing Pipeline, Gesture Recognition Model, and Database when a video frame is submitted for gesture prediction.

```mermaid
sequenceDiagram
    participant C as Client
    participant G as API Gateway
    participant P as Dataset Preprocessing Pipeline
    participant M as Gesture Recognition Model
    participant D as Database

    C->>G: Upload/stream raw video frames
    G->>P: Forward frames for preprocessing
    P->>P: Frame extraction
    P->>P: Resizing
    P->>P: Normalization
    P->>P: Landmark extraction
    P->>M: Send processed frames and landmarks
    M->>M: Predict sign gesture
    M->>M: Compute confidence score
    M->>D: Store prediction result and metadata
    D-->>M: Acknowledge write
    M-->>G: Return prediction and confidence score
    G-->>C: Return prediction results
```

---

## Backend Processing Flow — POST /api/ai/evaluate

Based on the router implementation, a single evaluation request is processed as follows:

1. Frontend captures the learner's hand using the webcam.
2. MediaPipe provides 21 hand landmarks.
3. Frontend sends the target sign and landmarks to `POST /api/ai/evaluate`.
4. FastAPI validates the request.
5. Backend resolves the landmarks from `landmarks` or `landmarks_flat`.
6. Gesture classifier is loaded.
7. Classifier predicts the sign using the landmarks.
8. Classifier returns predicted sign, accuracy percentage, and correctness.
9. Backend generates correction messages.
10. Backend returns the `EvaluateResponse` JSON to the frontend.
11. Frontend displays the predicted sign, accuracy, correctness, and corrections.

This sequence does **not** include a database write — the provided implementation does not persist the evaluation result to the database. See [Database Boundary](#database-boundary--ai-evaluation-endpoint).

---

## Sequence Diagram — AI Gesture Evaluation

```mermaid
sequenceDiagram
    participant L as Learner
    participant F as Frontend
    participant M as MediaPipe
    participant B as FastAPI Backend
    participant G as Gesture Classifier
    participant C as Correction Generator

    L->>F: Perform sign
    F->>M: Capture/process hand
    M->>F: Return 21 landmarks
    F->>B: POST /api/ai/evaluate (sign_name + landmarks)
    B->>B: Validate request
    B->>G: Predict gesture
    G->>B: predicted_sign + accuracy + is_correct
    B->>C: Generate corrections
    C->>B: corrections
    B->>F: JSON evaluation response
    F->>L: Display result and feedback
```

---

## Frontend to Backend Gesture Evaluation Flow

**Step 1 — User selects a sign**
The learner chooses the sign they want to practice.

**Step 2 — Camera captures hand**
The frontend accesses the webcam.

**Step 3 — MediaPipe detects hand landmarks**
MediaPipe extracts 21 hand landmarks.

**Step 4 — Frontend creates API request**
The frontend sends `sign_name` and landmarks.

**Step 5 — Backend validates request**
FastAPI checks whether `landmarks` or `landmarks_flat` is provided.

**Step 6 — Landmark processing**
Backend converts the payload into the format required by the gesture classifier.

**Step 7 — Gesture prediction**
The classifier predicts the performed sign and calculates the accuracy/correctness information.

**Step 8 — Correction generation**
The backend generates coaching feedback.

**Step 9 — API response**
The backend returns `predicted_sign`, `accuracy_percentage`, `is_correct`, and `corrections`.

**Step 10 — Frontend displays feedback**
The learner sees the result and correction messages.

---

## Error Handling

| Error Code | Scenario | Example Message |
|------------|----------|------------------|
| `400` | Invalid email format during registration | "Email address format is invalid" |
| `400` | Password shorter than 8 characters | "Password must be at least 8 characters long" |
| `400` | Missing required field | "name is required" |
| `400` | Invalid role value | "role must be one of Learner, Instructor, Admin" |
| `401` | Incorrect login credentials | "Email or password is incorrect" |
| `401` | Missing or expired JWT on protected route | "Authentication token is missing or invalid" |
| `403` | Valid token but action not permitted for role | "You do not have permission to perform this action" |
| `404` | Profile not found | "Learner profile does not exist" |
| `409` | Duplicate email during registration | "An account with this email already exists" |
| `500` | Unexpected server or database error | "Something went wrong. Please try again later" |

---

## API Summary Table

| Method | Endpoint | Description | Authentication Required |
|--------|----------|--------------|---------------------------|
| POST | `/auth/register` | Register a new user with a role | No |
| POST | `/auth/login` | Authenticate a user and issue a JWT | No |
| GET | `/profile` | Retrieve the authenticated learner's profile | Yes |
| PUT | `/profile` | Update the authenticated learner's profile | Yes |

---

## Database Boundary — AI Evaluation Endpoint

The AI evaluation API evaluates the gesture and returns the result. **It does not directly persist practice results to the database.** Database persistence is handled separately, after the frontend receives the evaluation response.

The following fields — drawn from the request and response of `POST /api/ai/evaluate` — may later be passed into that separate database-persistence workflow. This document does not claim that `POST /api/ai/evaluate` itself writes them:

- `learner_id`
- `sign_name`
- `predicted_sign`
- `accuracy_percentage`
- `is_correct`
- `corrections`
- `duration_seconds`
- `session_id`
- `created_at`

---

## AI Evaluation API Summary

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| GET | `/api/ai/supported-signs` | Returns signs supported/exposed by the practice API, grouped into `alphabet`, `dynamic_words`, and `all` | None | `alphabet`, `dynamic_words`, `all`, `note` |
| POST | `/api/ai/evaluate` | Evaluates a learner's hand gesture against a target sign and returns the prediction, accuracy, correctness, and coaching corrections | `sign_name`/`expected_sign` + `landmarks`/`landmarks_flat`, optional `session_id`, `source` | `predicted_sign`, `accuracy_percentage`, `is_correct`, `corrections` |

---

## Assumptions

- Passwords are hashed server-side (e.g., bcrypt) before storage; plain-text passwords are never persisted.
- JWTs are signed with a server-held secret/key and expire after a fixed duration (assumed 24 hours / `86400` seconds in examples).
- Email addresses are treated as case-insensitive unique identifiers.
- `role` is assigned at registration and is not self-editable via `PUT /profile`; role changes are assumed to require an Admin-level operation outside this module's scope.
- Fields such as `completedLessons`, `accuracy`, `learningStreak`, and `currentModule` are computed and updated by other modules (Lesson, Assessment, Gamification) and are exposed here as read-only.
- Refresh-token/token-revocation mechanisms are out of scope for this specification and are assumed to be addressed in a future security-hardening iteration.
- Rate limiting and brute-force login protection are assumed to be handled at the API gateway level, as defined in the System Architecture document, and are not re-specified here.

---

## What Changed — Revision 1 (Initial AI Endpoint Draft, Superseded Below)

This update adds documentation for the two AI gesture-evaluation endpoints, sourced from Chinmayee's backend information (Milestone 2 Task 2) and Pragathi's Task 4 database-handoff context. No backend code was written or modified — documentation only. Specifically, this update added:

- **§8 `GET /api/ai/supported-signs`** — purpose, method, endpoint, conceptual response grouping (`alphabet`, `dynamic_words`, `all`), and status codes, with the exact response schema marked as to be confirmed.
- **§9 `POST /api/ai/evaluate`** — purpose, method, endpoint, request body (`sign_name`, `expected_sign`, `landmarks`, `landmarks_flat`, `session_id`, `source`), validation requirements (21-point/63-number rules), example requests, success response fields, and anticipated-but-unconfirmed error handling.
- **"Frontend → Backend Workflow — AI Gesture Evaluation"** — a 15-step walkthrough from webcam activation through to retry handling.
- **"Sequence Diagram — AI Gesture Evaluation"** — a Mermaid sequence diagram covering Learner → Frontend → Webcam/MediaPipe → Backend API → Feature Extraction → Gesture Model and back.
- **"Database Boundary — AI Evaluation Endpoint"** — a note clarifying that this endpoint evaluates and returns results only, and does not itself persist to the database, plus the field list relevant to that later persistence step.
- **"AI Evaluation API Summary"** — a `Method | Endpoint | Purpose | Request | Response` table covering both new endpoints.

All previously existing sections (API Overview, Authentication, endpoints 1–7, HTTP Status Codes, Validation Rules, API Workflow, the two earlier Sequence Diagrams, Error Handling, API Summary Table, Assumptions) are unchanged.

---

## Information To Be Confirmed (Status After Revision 2 — Confirmed Backend Code)

The following items from Revision 1 are now resolved by the actual backend router/schema code and are documented directly in §8/§9 above:

- ~~Exact JSON response schema for `GET /api/ai/supported-signs`~~ — confirmed (`alphabet`, `dynamic_words`, `all`, `note`).
- ~~Success status code for `POST /api/ai/evaluate`~~ — confirmed as `200 OK` via `response_model=EvaluateResponse`.
- ~~Error response schema~~ — confirmed: `422` (missing landmarks) and `503` (gesture model unavailable).
- ~~Precedence when both `sign_name` and `expected_sign` are supplied~~ — confirmed: if `expected_sign` is missing but `sign_name` is provided, the backend sets `expected_sign = sign_name`. Behavior when **both** are explicitly supplied with different values is not stated in the provided code and remains open (see below).
- ~~Server-side behavior when both `landmarks` and `landmarks_flat` are supplied~~ — confirmed: `landmarks_flat` takes precedence if provided.
- ~~Accepted value set for `source`~~ — confirmed: `webcam`, `upload`, `dataset`, `test` (default `webcam`).
- ~~Whether `session_id`/`source` are mandatory~~ — confirmed optional (`session_id` max length 64; `source` defaults to `webcam`).

**Still to be confirmed with Chinmayee:**

- Whether `GET /api/ai/supported-signs` and `POST /api/ai/evaluate` require JWT authentication, or are public endpoints — not stated in the provided route implementation.
- Behavior when both `sign_name` and `expected_sign` are explicitly supplied with **different** values (only the "one missing, one provided" auto-fill case is confirmed).
- Whether unhandled server exceptions surface as a generic `500` or another status — only `422` and `503` are confirmed in the provided code.
- Whether `duration_seconds` is ever accepted as part of the `POST /api/ai/evaluate` request body, or is calculated entirely client-side before being handed to the separate database-persistence workflow (it is not part of the confirmed `EvaluateRequest`/`EvaluateResponse` schema).

---

## Implementation Notes

- `POST /api/ai/evaluate` uses the standard `EvaluateResponse` schema (`predicted_sign`, `accuracy_percentage`, `is_correct`, `corrections`).
- `POST /api/ai/evaluate/detailed` exists on the same router as a separate debug/teammate-integration endpoint, but is outside the scope of this documentation task.
- `GET /api/ai/health` also exists on this router as an additional available endpoint, outside the scope of this documentation task.
- `GET /api/ai/supported-signs` exposes the `alphabet` and `dynamic_words` lists described above.
- The current classifier is optimized for alphabet signs; `dynamic_words` are exposed for UI planning and future sequence-model integration, not current recognition.
- Database persistence happens separately, outside `POST /api/ai/evaluate` (see [Database Boundary](#database-boundary--ai-evaluation-endpoint)).

---

## What I Changed — Revision 2 (Confirmed Backend Code)

Updated `api-specification.md` on the basis of the actual backend router/schema information (FastAPI router at `/api/ai`, `EvaluateRequest`/`EvaluateResponse` Pydantic models), replacing the earlier draft's "to be confirmed" placeholders with confirmed behavior. No backend code was written or modified. Specifically:

- **§8 `GET /api/ai/supported-signs`** rewritten with the exact response body (`alphabet` = A–Z, `dynamic_words` = the six confirmed words, `all`, and the `note` field), and the clarification that dynamic words are UI-planning entries, not currently classifier-recognized.
- **§9 `POST /api/ai/evaluate`** rewritten with the confirmed `EvaluateRequest` schema (field types, max lengths, the `source` literal/default, the `sign_name`→`expected_sign` auto-fill rule, and `landmarks_flat` taking precedence over `landmarks`), the confirmed `422` validation error body, and the confirmed `503` gesture-model-unavailable error.
- Replaced the abbreviated single-landmark request example with an explicit note that it is abbreviated for documentation and that production requests require all 21 landmarks; the `landmarks_flat` example no longer shows invented 63 values.
- Replaced the prior workflow/sequence-diagram trio with: **"Backend Processing Flow — POST /api/ai/evaluate"** (11 steps, no DB write), a corrected **"Sequence Diagram — AI Gesture Evaluation"** (Learner → Frontend → MediaPipe → FastAPI Backend → Gesture Classifier → Correction Generator), and a new **"Frontend to Backend Gesture Evaluation Flow"** (10 labeled steps).
- Updated the **AI Evaluation API Summary** table's `/api/ai/supported-signs` row to list the confirmed response fields instead of "to be confirmed."
- Added this **Implementation Notes** section and updated the confirmation-tracking section above to show which Revision 1 unknowns are now resolved and which remain open.
- **Database Boundary** section, endpoints 1–7, Authentication, HTTP Status Codes, Validation Rules, API Workflow, the original Sequence Diagram, Error Handling, API Summary Table, and Assumptions are unchanged from the prior version.
