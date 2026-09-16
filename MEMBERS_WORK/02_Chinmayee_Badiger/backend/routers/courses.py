"""
Milestone 3 - Courses & Lessons Router
GET /api/courses - List all courses
GET /api/courses/{course_id} - Single course with lessons
POST /api/courses/{course_id}/enroll - Enroll learner
GET /api/courses/enrolled/{learner_id} - Enrolled courses
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/courses", tags=["Courses & Lessons"])

COURSES = [
    {
        "course_id": "c001", "title": "ASL Alphabet Basics",
        "description": "Learn all 26 letters of the American Sign Language alphabet with real-time AI feedback.",
        "level": "Beginner", "category": "Alphabet", "duration_hours": 3, "lesson_count": 8,
        "instructor": "Dr. Sarah Chen", "thumbnail_color": "#0284C7",
        "lessons": [
            {"lesson_id":"l001","title":"Introduction to ASL","description":"Overview of American Sign Language history and basics.","duration_mins":12,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":1},
            {"lesson_id":"l002","title":"Letters A-E","description":"Hand shapes for the first five letters of the alphabet.","duration_mins":15,"video_url":"https://www.youtube.com/embed/tkMg8g8vVUo","sequence_order":2},
            {"lesson_id":"l003","title":"Letters F-J","description":"Hand shapes for letters F through J.","duration_mins":14,"video_url":"https://www.youtube.com/embed/0FcwzMq4iWg","sequence_order":3},
            {"lesson_id":"l004","title":"Letters K-O","description":"Hand shapes for letters K through O.","duration_mins":13,"video_url":"https://www.youtube.com/embed/tkMg8g8vVUo","sequence_order":4},
            {"lesson_id":"l005","title":"Letters P-T","description":"Hand shapes for letters P through T.","duration_mins":14,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":5},
            {"lesson_id":"l006","title":"Letters U-Z","description":"Hand shapes for the final letters U through Z.","duration_mins":12,"video_url":"https://www.youtube.com/embed/0FcwzMq4iWg","sequence_order":6},
            {"lesson_id":"l007","title":"Alphabet Practice","description":"Spell common words using the ASL alphabet.","duration_mins":20,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":7},
            {"lesson_id":"l008","title":"Alphabet Assessment","description":"Test your knowledge of all 26 ASL letters.","duration_mins":10,"video_url":"https://www.youtube.com/embed/tkMg8g8vVUo","sequence_order":8},
        ]
    },
    {
        "course_id": "c002", "title": "Common Everyday Phrases",
        "description": "Master 50 essential everyday phrases: greetings, farewells, thank you, please, and more.",
        "level": "Beginner", "category": "Phrases", "duration_hours": 4, "lesson_count": 6,
        "instructor": "Prof. James Wilson", "thumbnail_color": "#F97316",
        "lessons": [
            {"lesson_id":"l009","title":"Greetings & Farewells","description":"Hello, goodbye, good morning, good night.","duration_mins":18,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":1},
            {"lesson_id":"l010","title":"Please & Thank You","description":"Polite expressions in ASL.","duration_mins":15,"video_url":"https://www.youtube.com/embed/0FcwzMq4iWg","sequence_order":2},
            {"lesson_id":"l011","title":"Yes, No & Maybe","description":"Basic affirmation and negation signs.","duration_mins":12,"video_url":"https://www.youtube.com/embed/tkMg8g8vVUo","sequence_order":3},
            {"lesson_id":"l012","title":"I, You, We, They","description":"Pronouns in American Sign Language.","duration_mins":16,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":4},
            {"lesson_id":"l013","title":"Questions & Answers","description":"How to ask who, what, where, when, why in ASL.","duration_mins":20,"video_url":"https://www.youtube.com/embed/0FcwzMq4iWg","sequence_order":5},
            {"lesson_id":"l014","title":"Phrases Practice Quiz","description":"Test your common phrases knowledge.","duration_mins":10,"video_url":"https://www.youtube.com/embed/tkMg8g8vVUo","sequence_order":6},
        ]
    },
    {
        "course_id": "c003", "title": "Numbers, Colors & Time",
        "description": "Learn numbers 1-100, all colors, days of the week, months, and telling time in ASL.",
        "level": "Beginner", "category": "Core Vocabulary", "duration_hours": 5, "lesson_count": 7,
        "instructor": "Dr. Sarah Chen", "thumbnail_color": "#059669",
        "lessons": [
            {"lesson_id":"l015","title":"Numbers 1-10","description":"Counting from one to ten in ASL.","duration_mins":14,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":1},
            {"lesson_id":"l016","title":"Numbers 11-100","description":"Teens, tens, and larger numbers.","duration_mins":18,"video_url":"https://www.youtube.com/embed/0FcwzMq4iWg","sequence_order":2},
            {"lesson_id":"l017","title":"Colors","description":"Red, blue, green, yellow and all major colors.","duration_mins":15,"video_url":"https://www.youtube.com/embed/tkMg8g8vVUo","sequence_order":3},
            {"lesson_id":"l018","title":"Days of the Week","description":"Monday through Sunday in ASL.","duration_mins":12,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":4},
            {"lesson_id":"l019","title":"Months of the Year","description":"January through December in ASL.","duration_mins":14,"video_url":"https://www.youtube.com/embed/0FcwzMq4iWg","sequence_order":5},
            {"lesson_id":"l020","title":"Telling Time","description":"Hours, minutes, and time expressions.","duration_mins":16,"video_url":"https://www.youtube.com/embed/tkMg8g8vVUo","sequence_order":6},
            {"lesson_id":"l021","title":"Numbers & Time Quiz","description":"Comprehensive numbers and time assessment.","duration_mins":10,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":7},
        ]
    },
    {
        "course_id": "c004", "title": "Intermediate Conversations",
        "description": "Hold real conversations: family, work, weather, emotions, and describing your day.",
        "level": "Intermediate", "category": "Conversation", "duration_hours": 8, "lesson_count": 7,
        "instructor": "Prof. James Wilson", "thumbnail_color": "#7C3AED",
        "lessons": [
            {"lesson_id":"l022","title":"Family Members","description":"Mother, father, sibling, children and relatives.","duration_mins":18,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":1},
            {"lesson_id":"l023","title":"Emotions & Feelings","description":"Happy, sad, angry, excited, scared and more.","duration_mins":16,"video_url":"https://www.youtube.com/embed/0FcwzMq4iWg","sequence_order":2},
            {"lesson_id":"l024","title":"Food & Eating","description":"Common foods, restaurant vocabulary, ordering.","duration_mins":20,"video_url":"https://www.youtube.com/embed/tkMg8g8vVUo","sequence_order":3},
            {"lesson_id":"l025","title":"Jobs & Occupations","description":"Doctor, teacher, engineer, student and more.","duration_mins":18,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":4},
            {"lesson_id":"l026","title":"Weather & Seasons","description":"Weather conditions and seasonal vocabulary.","duration_mins":15,"video_url":"https://www.youtube.com/embed/0FcwzMq4iWg","sequence_order":5},
            {"lesson_id":"l027","title":"Describing Your Day","description":"Morning routines, activities, past and future tense.","duration_mins":22,"video_url":"https://www.youtube.com/embed/tkMg8g8vVUo","sequence_order":6},
            {"lesson_id":"l028","title":"Conversation Practice","description":"Role-play common daily scenarios.","duration_mins":25,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":7},
        ]
    },
    {
        "course_id": "c005", "title": "Medical & Emergency Signs",
        "description": "Critical signs for healthcare settings, emergencies, pain descriptions, and medical vocabulary.",
        "level": "Intermediate", "category": "Specialized", "duration_hours": 6, "lesson_count": 6,
        "instructor": "Dr. Emily Rodriguez", "thumbnail_color": "#DC2626",
        "lessons": [
            {"lesson_id":"l029","title":"Body Parts","description":"Head, arms, legs, internal organs and body regions.","duration_mins":20,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":1},
            {"lesson_id":"l030","title":"Pain & Symptoms","description":"Describing pain levels, symptoms, and discomfort.","duration_mins":18,"video_url":"https://www.youtube.com/embed/0FcwzMq4iWg","sequence_order":2},
            {"lesson_id":"l031","title":"Emergency Signs","description":"Help, call 911, danger, fire, accident.","duration_mins":15,"video_url":"https://www.youtube.com/embed/tkMg8g8vVUo","sequence_order":3},
            {"lesson_id":"l032","title":"Hospital Vocabulary","description":"Doctor, nurse, medicine, surgery, appointment.","duration_mins":20,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":4},
            {"lesson_id":"l033","title":"Mental Health Signs","description":"Anxiety, depression, therapy, and mental wellness.","duration_mins":18,"video_url":"https://www.youtube.com/embed/0FcwzMq4iWg","sequence_order":5},
            {"lesson_id":"l034","title":"Medical Assessment","description":"Test your medical vocabulary knowledge.","duration_mins":12,"video_url":"https://www.youtube.com/embed/tkMg8g8vVUo","sequence_order":6},
        ]
    },
    {
        "course_id": "c006", "title": "Professional & Workplace Signs",
        "description": "Advanced workplace communication: meetings, presentations, technology, business vocabulary.",
        "level": "Advanced", "category": "Professional", "duration_hours": 10, "lesson_count": 7,
        "instructor": "Prof. David Kim", "thumbnail_color": "#0F172A",
        "lessons": [
            {"lesson_id":"l035","title":"Office Vocabulary","description":"Computer, email, meeting, deadline, project.","duration_mins":22,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":1},
            {"lesson_id":"l036","title":"Meeting Language","description":"Agenda, present, vote, discuss, agree, disagree.","duration_mins":20,"video_url":"https://www.youtube.com/embed/0FcwzMq4iWg","sequence_order":2},
            {"lesson_id":"l037","title":"Technology Terms","description":"Software, hardware, internet, app, download.","duration_mins":18,"video_url":"https://www.youtube.com/embed/tkMg8g8vVUo","sequence_order":3},
            {"lesson_id":"l038","title":"Finance & Banking","description":"Money, payment, invoice, budget, salary.","duration_mins":20,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":4},
            {"lesson_id":"l039","title":"Presentations","description":"Structuring and delivering a signed presentation.","duration_mins":25,"video_url":"https://www.youtube.com/embed/0FcwzMq4iWg","sequence_order":5},
            {"lesson_id":"l040","title":"Legal & Formal","description":"Contract, rights, privacy, formal communication.","duration_mins":22,"video_url":"https://www.youtube.com/embed/tkMg8g8vVUo","sequence_order":6},
            {"lesson_id":"l041","title":"Professional Final Exam","description":"Comprehensive professional communication assessment.","duration_mins":20,"video_url":"https://www.youtube.com/embed/v1desDduz5M","sequence_order":7},
        ]
    },
]

class EnrollRequest(BaseModel):
    learner_id: str

@router.get("", summary="List all available courses")
def list_courses():
    return {"courses": [{k:v for k,v in c.items() if k != "lessons"} for c in COURSES], "total": len(COURSES)}

@router.get("/enrolled/{learner_id}", summary="Get enrolled courses for a learner")
def enrolled_courses(learner_id: str):
    import hashlib
    seed = int(hashlib.md5(learner_id.encode()).hexdigest(), 16) % 4
    enrolled = [c["course_id"] for c in COURSES[:seed+1]]
    return {"learner_id": learner_id, "enrolled_course_ids": enrolled, "count": len(enrolled)}

@router.get("/{course_id}", summary="Get a single course with lessons")
def get_course(course_id: str):
    course = next((c for c in COURSES if c["course_id"] == course_id), None)
    if not course:
        raise HTTPException(status_code=404, detail=f"Course {course_id} not found")
    return course

@router.get("/{course_id}/lessons", summary="Get lessons for a course")
def get_lessons(course_id: str):
    course = next((c for c in COURSES if c["course_id"] == course_id), None)
    if not course:
        raise HTTPException(status_code=404, detail=f"Course {course_id} not found")
    return {"course_id": course_id, "lessons": course["lessons"], "count": len(course["lessons"])}

@router.post("/{course_id}/enroll", summary="Enroll a learner in a course")
def enroll(course_id: str, req: EnrollRequest):
    course = next((c for c in COURSES if c["course_id"] == course_id), None)
    if not course:
        raise HTTPException(status_code=404, detail=f"Course {course_id} not found")
    return {"success": True, "message": f"Enrolled in '{course['title']}'", "learner_id": req.learner_id, "course_id": course_id}
