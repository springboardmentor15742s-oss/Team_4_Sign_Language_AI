## Database Design Notes

- Role-Based Access Control (RBAC) is implemented using the role field in the Users table.
- Each learner has exactly one learner profile.
- Learning goals are stored separately to allow multiple goals per learner.
- Practice history stores every practice attempt.
- Skill mastery tracks improvement for each sign.
- Courses contain multiple lessons.
- Progress tracking monitors learner completion.
- Feedback is stored for course improvement.