// src/components/NoteForm.jsx
import { useState } from "react";
import { API_BASE } from "../api";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function NoteForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      
      if (!res.ok) throw new Error("Failed to add note");
      
      const data = await res.json();
      onAdd(data.note || data); // Adjust if your backend returns directly 'data' or nested 'data.note'
      toast.success("Note added successfully!");
      setTitle("");
      setContent("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10 p-6 bg-pale-lime dark:bg-slate-800 border-4 border-navy dark:border-powder-blue shadow-[8px_8px_0_rgba(48,80,102,1)] dark:shadow-[8px_8px_0_rgba(166,193,226,1)] rounded-none transition-all">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Give your note a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl font-bold bg-white dark:bg-slate-900 border-2 border-navy dark:border-powder-blue p-3 text-navy dark:text-pale-lime placeholder-navy/50 dark:placeholder-powder-blue/50 outline-none focus:ring-4 focus:ring-sage"
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Write something cool..."
          value={content}
          rows={4}
          onChange={(e) => setContent(e.target.value)}
          className="w-full resize-none bg-white dark:bg-slate-900 border-2 border-navy dark:border-powder-blue rounded-none p-3 text-navy dark:text-pale-lime placeholder-navy/50 dark:placeholder-powder-blue/50 outline-none focus:ring-4 focus:ring-sage"
        />
      </div>
      <div className="flex justify-end">
        <button 
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 bg-olive text-white dark:text-navy font-bold px-8 py-3 border-2 border-navy dark:border-powder-blue hover:bg-sage focus:ring-4 focus:ring-sage active:-translate-y-1 active:shadow-[2px_2px_0_rgba(48,80,102,1)] active:translate-x-1 transition-all shadow-[4px_4px_0_rgba(48,80,102,1)] dark:shadow-[4px_4px_0_rgba(166,193,226,1)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
          {isSubmitting ? "WAIT..." : "ADD NOTE"}
        </button>
      </div>
    </form>
  );
}