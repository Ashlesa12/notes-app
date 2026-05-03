import { useEffect, useState } from "react";
import { API_BASE } from "./api";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import { Moon, Sun } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch notes from backend
  const fetchNotes = () => {
    setLoading(true);

    fetch(`${API_BASE}/notes`)
      .then((res) => res.json())
      .then((data) => {
        setNotes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load notes on first render
  useEffect(() => {
    fetchNotes();
  }, []);

  // Add note (optimistic UI)
const handleAdd = async (note) => {
  try {
    const res = await fetch(`${API_BASE}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });

    // 🔥 Instead of trusting local state → fetch from backend
    fetchNotes();
  } catch (err) {
    console.error(err);
  }
};

  // 🔥 FIXED DELETE FUNCTION
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
      });

      // 🔥 refresh from backend so UI matches server
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-teal dark:bg-navy transition-colors duration-500 text-navy dark:text-pale-lime pb-12">
      <Toaster position="top-center" />

      <header className="sticky top-0 z-10 bg-navy dark:bg-slate-900 border-b-4 border-olive dark:border-olive shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-pale-lime tracking-wide">
            Notes Vault
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full border-2 border-powder-blue/30 hover:bg-white/10 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-pale-lime" />
            ) : (
              <Moon className="w-5 h-5 text-powder-blue" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 mt-8">
        <NoteForm onAdd={handleAdd} />

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : (
          <NoteList notes={notes} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}