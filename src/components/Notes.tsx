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
import RichTextEditor from './RichTextEditor';

interface Note {
  id: string;
  title: string;
  content: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '<p></p>' }); // Initialize with empty paragraph
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
        // Optionally clear the new note if it's empty when unfocused
        if (newNote.title.trim() === '' && (newNote.content.trim() === '<p></p>' || newNote.content.trim() === '')) {
          setNewNote({ title: '', content: '<p></p>' });
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [newNote]); // Depend on newNote to re-evaluate the condition

  const handleAddNote = async () => {
    // Check if title is empty OR if content is empty (considering <p></p> as empty)
    if (newNote.title.trim() === '' && (newNote.content.trim() === '<p></p>' || newNote.content.trim() === '')) {
      return;
    }
    const docRef = await addDoc(collection(db, 'notes'), newNote);
    setNotes([...notes, { id: docRef.id, ...newNote }]);
    setNewNote({ title: '', content: '<p></p>' }); // Reset to empty paragraph
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
              <div
                className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                  isCreateNoteFocused ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <Input
                  type="text"
                  value={newNote.title}
                  onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Title"
                  className="mb-2 border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none min-h-0"
                />
              </div>
              <RichTextEditor
                content={newNote.content}
                onChange={content => setNewNote({ ...newNote, content })}
                onFocus={() => setCreateNoteFocused(true)}
                placeholder="Take a note..."
              />
              <div
                className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                  isCreateNoteFocused ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="flex justify-end gap-2 mt-2 min-h-0">
                  <Button onClick={handleAddNote}>Add</Button>
                  <Button 
                    onClick={() => {
                      setCreateNoteFocused(false);
                      setNewNote({ title: '', content: '<p></p>' }); // Clear new note on close
                    }}
                    variant="ghost"
                  >
                    Close
                  </Button>
                </div>
              </div>
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
                <div dangerouslySetInnerHTML={{ __html: note.content }} />
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
              <RichTextEditor
                content={editingNote.content}
                onChange={content => editingNote && setEditingNote({ ...editingNote, content })}
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