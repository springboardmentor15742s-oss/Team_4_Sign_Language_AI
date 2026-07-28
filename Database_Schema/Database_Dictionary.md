# Data Dictionary

# Data Dictionary

| Table Name            |                              Description                                      |
|-----------------------|-------------------------------------------------------------------------------|
| **Users**             | Stores authentication details and role information for all users (Learner, Instructor, Accessibility Trainer, Administrator). |
| **Learner_Profile**   | Stores learner-specific information such as learning level, goals, preferred language, daily target, practice history, and progress. |
| **Courses**           | Contains details of available sign language courses offered on the platform. |
| **Lessons**           | Stores individual lessons belonging to each course along with their content and order. |
| **Assessments**       | Records learner assessment scores, completion dates, and assessment status. |
| **Progress_Tracking** | Tracks learner progress and course completion percentage. |
| **Feedback**          | Stores learner ratings and comments for completed courses. |
| **Learning_Goals**    | Stores the learning goals selected by each learner. |
| **Practice_History**  | Maintains records of sign language practice sessions, including accuracy and duration. |
| **Skill_Mastery**     | Tracks mastery level and performance for each practiced sign. |

## Key Terms

|        Term          |                       Meaning                                      |
|----------------------|--------------------------------------------------------------------|
| **PK (Primary Key)** | A unique identifier for each record in a table.                    |
| **FK (Foreign Key)** | A field that creates a relationship between two tables.            |
| **INT**              | Integer numeric data type.                                         |
| **VARCHAR(n)**       | Variable-length character string with a maximum of *n* characters. |
| **TEXT**             | Used to store long text values.                                    |
| **DECIMAL(5,2)**     | Stores decimal values with up to 5 digits and 2 decimal places.    |
| **DATE**             | Stores only the date.                                              |
| **DATETIME**         | Stores both date and time information.                             |
| **ENUM**             | Stores one value from a predefined list (for example, user roles). |