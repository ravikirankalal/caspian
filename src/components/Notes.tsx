import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { firestoreDB } from '../firebase';

export const db = firestoreDB;

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<{ id: string; text: string }[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<{ id: string; text: string } | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const notesCollection = await getDocs(collection(db, 'notes'));
      setNotes(notesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as { id: string; text: string })));
    };
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (newNote.trim() === '') return;
    const docRef = await addDoc(collection(db, 'notes'), { text: newNote });
    setNotes([...notes, { id: docRef.id, text: newNote }]);
    setNewNote('');
  };

  const handleDeleteNote = async (id: string) => {
    await deleteDoc(doc(db, 'notes', id));
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleUpdateNote = async () => {
    if (!editingNote) return;
    await updateDoc(doc(db, 'notes', editingNote.id), { text: editingNote.text });
    setNotes(notes.map(note => (note.id === editingNote.id ? editingNote : note)));
    setEditingNote(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          className="border p-2 flex-grow"
          placeholder="New note"
        />
        <button onClick={handleAddNote} className="bg-blue-500 text-white p-2 ml-2">Add</button>
      </div>
      <ul>
        {notes.map(note => (
          <li key={note.id} className="flex items-center mb-2">
            {editingNote && editingNote.id === note.id ? (
              <input
                type="text"
                value={editingNote.text}
                onChange={e => setEditingNote({ ...editingNote, text: e.target.value })}
                className="border p-2 flex-grow"
              />
            ) : (
              <span className="flex-grow">{note.text}</span>
            )}
            <div className="flex">
              {editingNote && editingNote.id === note.id ? (
                <button onClick={handleUpdateNote} className="bg-green-500 text-white p-2 mr-2">Update</button>
              ) : (
                <button onClick={() => setEditingNote(note)} className="bg-yellow-500 text-white p-2 mr-2">Edit</button>
              )}
              <button onClick={() => handleDeleteNote(note.id)} className="bg-red-500 text-white p-2">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;