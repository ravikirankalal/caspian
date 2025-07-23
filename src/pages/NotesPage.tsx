import React from 'react';
import Notes from '../components/Notes';

const NotesPage: React.FC = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Notes />
    </div>
  );
};

export default NotesPage;