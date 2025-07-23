import React from 'react';
import Notes from '../components/Notes';
import SidebarLayout from '../components/SidebarLayout';

const NotesPage: React.FC = () => {
  return (
    <SidebarLayout>
      <Notes />
    </SidebarLayout>
  );
};

export default NotesPage;