import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { firestoreDB } from '../firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

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
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="New note"
          />
          <Button onClick={handleAddNote}>Add</Button>
        </div>
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="flex items-center gap-2">
              {editingNote && editingNote.id === note.id ? (
                <Input
                  type="text"
                  value={editingNote.text}
                  onChange={e => setEditingNote({ ...editingNote, text: e.target.value })}
                />
              ) : (
                <Label className="flex-grow">{note.text}</Label>
              )}
              <div className="flex gap-2">
                {editingNote && editingNote.id === note.id ? (
                  <Button onClick={handleUpdateNote} variant="outline">Update</Button>
                ) : (
                  <Button onClick={() => setEditingNote(note)} variant="outline">Edit</Button>
                )}
                <Button onClick={() => handleDeleteNote(note.id)} variant="destructive">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Notes;
