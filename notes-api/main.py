from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json

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

notes = []

# 🔹 Load notes from file when server starts
def load_notes():
    global notes
    try:
        with open("notes.json", "r") as f:
            notes = json.load(f)
    except:
        notes = []

# 🔹 Save notes to file
def save_notes():
    with open("notes.json", "w") as f:
        json.dump(notes, f)

load_notes()

class Note(BaseModel):
    title: str
    content: str

@app.get("/")
def home():
    return {"message": "Notes API running"}

@app.get("/notes")
def get_notes():
    return notes

@app.post("/notes")
def create_note(note: Note):
    notes.append(note.dict())   # convert to dict for JSON saving
    save_notes()
    return {"message": "Note added", "note": note}

@app.get("/notes/{note_id}")
def get_note(note_id: int):
    if note_id < len(notes):
        return notes[note_id]
    return {"error": "Note not found"}

@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    if note_id < len(notes):
        deleted = notes.pop(note_id)
        save_notes()
        return {"message": "Deleted", "note": deleted}
    return {"error": "Note not found"}