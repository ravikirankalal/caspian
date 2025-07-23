import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
} from './ui/dialog';
import Masonry from 'react-masonry-css';

interface Note {
  id: string;
  title: string;
  content: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreateNoteFocused, setCreateNoteFocused] = useState(false);
  const createNoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const notesCollection = await getDocs(collection(db, 'notes'));
      setNotes(notesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note)));
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (createNoteRef.current && !createNoteRef.current.contains(event.target as Node)) {
        setCreateNoteFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddNote = async () => {
    if (newNote.title.trim() === '' && newNote.content.trim() === '') return;
    const docRef = await addDoc(collection(db, 'notes'), newNote);
    setNotes([...notes, { id: docRef.id, ...newNote }]);
    setNewNote({ title: '', content: '' });
    setCreateNoteFocused(false);
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

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setEditingNote(null)}>
      <div className="w-full max-w-6xl mx-auto">
        <div ref={createNoteRef} className="mb-8 mx-auto max-w-xl">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              {isCreateNoteFocused && (
                <Input
                  type="text"
                  value={newNote.title}
                  onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Title"
                  className="mb-2 border-none focus:ring-0 shadow-none"
                />
              )}
              <Textarea
                value={newNote.content}
                onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                onFocus={() => setCreateNoteFocused(true)}
                placeholder="Take a note..."
                className="border-none focus:ring-0 shadow-none resize-none"
              />
              {isCreateNoteFocused && (
                <div className="flex justify-end gap-2 mt-2">
                  <Button onClick={handleAddNote}>Add</Button>
                  <Button onClick={() => setCreateNoteFocused(false)} variant="ghost">Close</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid"
          columnClassName="masonry-grid_column">
          {notes.map(note => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{note.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingNote(note)} variant="outline">Edit</Button>
                </DialogTrigger>
                <Button onClick={() => handleDeleteNote(note.id)} variant="destructive">Delete</Button>
              </CardFooter>
            </Card>
          ))}
        </Masonry>

        {editingNote && (
            <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                type="text"
                value={editingNote.title}
                onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
                placeholder="Title"
              />
              <Textarea
                value={editingNote.content}
                onChange={e => setEditingNote({ ...editingNote, content: e.target.value })}
                placeholder="Take a note..."
              />
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateNote}>Update</Button>
              <Button onClick={() => setEditingNote(null)} variant="outline">Cancel</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </div>
    </Dialog>
  );
};

export default Notes;