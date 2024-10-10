"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import StickyNote from '@/components/StickyNote';
import Auth from '@/components/Auth';

interface Note {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
  width: number;
  height: number;
  userName: string;
}

const colors = [
  '#fef3c7', '#e9d5ff', '#bfdbfe', '#d1fae5', '#fee2e2',
  '#ddd6fe', '#fde68a', '#c7d2fe', '#fecaca', '#d1d5db',
  '#fcd34d', '#a7f3d0', '#fdba74', '#f5d0fe', '#93c5fd'
];

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [draggingNote, setDraggingNote] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleLogin = useCallback((name: string) => {
    setUserName(name);
  }, []);

  const addNote = useCallback((e: React.MouseEvent) => {
    if (!boardRef.current || !userName) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      width: 200,
      height: 200,
      userName,
    };

    setNotes(prevNotes => [...prevNotes, newNote]);
  }, [userName]);

  const removeNote = useCallback((id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  }, []);

  const changeNoteColor = useCallback((id: string) => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, color: newColor } : note
      )
    );
  }, []);

  const handleNoteContentChange = useCallback((id: string, content: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note => (note.id === id ? { ...note, content } : note))
    );
  }, []);

  const resizeNote = useCallback((id: string, width: number, height: number) => {
    setNotes(prevNotes =>
      prevNotes.map(note => (note.id === id ? { ...note, width, height } : note))
    );
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent, id: string) => {
    if (!boardRef.current) return;

    const note = notes.find((n) => n.id === id);
    if (!note) return;

    const rect = boardRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left - note.x,
      y: e.clientY - rect.top - note.y,
    };

    setDraggingNote(id);
  }, [notes]);

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (!draggingNote || !boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.current.x;
    const y = e.clientY - rect.top - dragOffset.current.y;

    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === draggingNote ? { ...note, x, y } : note
      )
    );
  }, [draggingNote]);

  const handleDragEnd = useCallback(() => {
    setDraggingNote(null);
  }, []);

  useEffect(() => {
    console.log("Current userName:", userName);
    console.log("Current notes:", notes);
  }, [userName, notes]);

  if (!userName) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div 
      ref={boardRef}
      className="container mx-auto p-4 h-screen bg-yellow-50 overflow-hidden relative"
      onDoubleClick={addNote}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left text-gray-800">Talan Board</h1>
      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            position: 'absolute',
            left: `${note.x}px`,
            top: `${note.y}px`,
            width: `${note.width}px`,
            height: `${note.height}px`,
            transition: draggingNote === note.id ? 'none' : 'all 0.3s ease',
            zIndex: draggingNote === note.id ? 1000 : 1,
          }}
        >
          <StickyNote
            note={note}
            onRemove={removeNote}
            onColorChange={changeNoteColor}
            onContentChange={handleNoteContentChange}
            onResize={resizeNote}
            onDragStart={handleDragStart}
          />
        </div>
      ))}
    </div>
  );
}