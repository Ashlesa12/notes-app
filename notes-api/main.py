from pymongo import MongoClient
from bson import ObjectId
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["notes_db"]
notes_collection = db["notes"]

class Note(BaseModel):
    title: str
    content: str

@app.get("/")
def home():
    return {"message": "Notes API running"}

# ✅ GET all notes
@app.get("/notes")
def get_notes():
    notes = list(notes_collection.find())

    for note in notes:
        note["_id"] = str(note["_id"])  # convert ObjectId → string

    return notes

# ✅ CREATE note
@app.post("/notes")
def create_note(note: Note):
    result = notes_collection.insert_one(note.dict())

    return {
        "message": "Note added",
        "id": str(result.inserted_id)
    }

# ✅ GET single note
@app.get("/notes/{note_id}")
def get_note(note_id: str):
    note = notes_collection.find_one({"_id": ObjectId(note_id)})

    if note:
        note["_id"] = str(note["_id"])
        return note

    return {"error": "Note not found"}

# ✅ DELETE note
@app.delete("/notes/{note_id}")
def delete_note(note_id: str):
    result = notes_collection.delete_one({"_id": ObjectId(note_id)})

    if result.deleted_count == 1:
        return {"message": "Deleted"}

    return {"error": "Note not found"}