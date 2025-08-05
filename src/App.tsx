import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import NotesPage from './pages/NotesPage';
import FileUploadPage from './pages/FileUploadPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/toaster';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="caspian-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/files" element={<FileUploadPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
