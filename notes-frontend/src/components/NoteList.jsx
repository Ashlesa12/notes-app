// src/components/NoteList.jsx
import { Calendar, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NoteList({ notes, onDelete }) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-400 dark:text-gray-500 mt-10">
        <svg className="w-24 h-24 mb-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <p className="text-xl font-medium">No notes found.</p>
        <p className="mt-2 text-sm">Write your first note above to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
      {notes.map((note, index) => (
        <div 
          key={note.id || index} 
          className="group relative bg-powder-blue dark:bg-slate-800 p-6 border-4 border-navy dark:border-powder-blue shadow-[6px_6px_0_rgba(48,80,102,1)] dark:shadow-[6px_6px_0_rgba(166,193,226,1)] hover:shadow-[10px_10px_0_rgba(48,80,102,1)] dark:hover:shadow-[10px_10px_0_rgba(166,193,226,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200"
        >
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
             {/* Delete button skeleton placeholder. Hook it up to API when ready */}
            <button 
  onClick={() => onDelete(index)}
  className="p-2 text-navy/60 hover:text-white hover:bg-navy dark:hover:bg-red-500/10 rounded-none border-2 border-transparent hover:border-navy transition-colors"
  aria-label="Delete note"
>
  <Trash2 className="w-5 h-5 stroke-[2.5]" />
</button>
          </div>

          <h2 className="font-extrabold text-xl mb-3 text-navy dark:text-white pr-8 border-b-2 border-navy/20 pb-2">
            {note.title}
          </h2>
          <p className="text-navy/80 dark:text-gray-300 font-medium text-base leading-relaxed mb-6 whitespace-pre-wrap">
            {note.content}
          </p>
          
          <div className="flex items-center text-sm text-navy/70 font-bold">
            <Calendar className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            {/* If your backend returns a created_at timestamp, parse it. Using static fallback for now */}
            <span>
              {note.created_at ? formatDistanceToNow(new Date(note.created_at), { addSuffix: true }) : "RECENTLY"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}