import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Label } from './ui/label';

interface Note {
  id: string;
  title: string;
  content: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const notesCollection = await getDocs(collection(db, 'notes'));
      setNotes(notesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note)));
    };
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (newNote.title.trim() === '' || newNote.content.trim() === '') return;
    const docRef = await addDoc(collection(db, 'notes'), newNote);
    setNotes([...notes, { id: docRef.id, ...newNote }]);
    setNewNote({ title: '', content: '' });
  };

  const handleDeleteNote = async (id: string) => {
    await deleteDoc(doc(db, 'notes', id));
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleUpdateNote = async () => {
    if (!editingNote) return;
    await updateDoc(doc(db, 'notes', editingNote.id), { title: editingNote.title, content: editingNote.content });
    setNotes(notes.map(note => (note.id === editingNote.id ? editingNote : note)));
    setEditingNote(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingNote ? 'Edit Note' : 'Create Note'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={editingNote ? editingNote.title : newNote.title}
              onChange={e => 
                editingNote 
                  ? setEditingNote({ ...editingNote, title: e.target.value })
                  : setNewNote({ ...newNote, title: e.target.value })
              }
              placeholder="Note title"
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Input
              id="content"
              type="text"
              value={editingNote ? editingNote.content : newNote.content}
              onChange={e => 
                editingNote 
                  ? setEditingNote({ ...editingNote, content: e.target.value })
                  : setNewNote({ ...newNote, content: e.target.value })
              }
              placeholder="Note content"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {editingNote ? (
            <>
              <Button onClick={handleUpdateNote}>Update</Button>
              <Button onClick={() => setEditingNote(null)} variant="outline">Cancel</Button>
            </>
          ) : (
            <Button onClick={handleAddNote}>Add Note</Button>
          )}
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{note.content}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button onClick={() => setEditingNote(note)} variant="outline">Edit</Button>
              <Button onClick={() => handleDeleteNote(note.id)} variant="destructive">Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notes;