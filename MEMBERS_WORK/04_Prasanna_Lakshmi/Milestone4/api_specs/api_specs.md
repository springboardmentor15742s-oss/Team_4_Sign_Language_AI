# Prasanna's REST API Specifications (`team_master/api_specs/api_specs.md`)

## Endpoints

1. `POST /auth/register` — User registration with role selection (Learner, Instructor, Trainer, Admin).
2. `POST /auth/login` — User login returning JWT bearer token.
3. `GET /profile/{user_id}` — Retrieve learner profile details & active goals.
4. `PUT /profile/{user_id}` — Update learner profile & target daily practice minutes.
5. `GET /datasets` — List integrated sign language dataset metadata (Sign Language MNIST, ASL Alphabet, WLASL).
6. `GET /datasets/{key}` — Retrieve specific dataset parameters & sample counts.
