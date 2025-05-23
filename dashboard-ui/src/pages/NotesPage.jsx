// src/pages/NotesPage.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import { getAllNotes, deleteNote } from '../services/noteService'; // Import note service

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [error, setError] = useState(''); // Added error state
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getAllNotes();
        setNotes(response.data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        setError(err.response?.data?.message || err.message || "Could not fetch notes.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleDeleteNote = async (noteId, noteTitle) => { // Made async
    if (window.confirm(`Are you sure you want to delete note "${noteTitle}"?`)) {
      try {
        await deleteNote(noteId);
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
        console.log(`Note ${noteId} deleted successfully.`);
      } catch (err) {
        console.error(`Failed to delete note ${noteId}:`, err);
        setError(err.response?.data?.message || err.message || `Could not delete note ${noteTitle}.`);
      }
    }
  };

  const handleEditNote = (noteId) => navigate(`/notes/edit/${noteId}`);
  const handleAddNote = () => navigate('/notes/new');

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  if (isLoading) return <div className="p-4 text-center">Loading notes...</div>;
  // Error display can be added here or below

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Manage Notes</h1>
        <button onClick={handleAddNote} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Note
        </button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-center">{error}</p>}
      
      <div className="mb-6">
        <input type="text" placeholder="Search notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
      </div>
      
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <div key={note.id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{note.title}</h2>
                <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">{note.content.substring(0, 150)}{note.content.length > 150 ? '...' : ''}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Created: {formatDate(note.createdAt)}</p>
                <p className="text-xs text-gray-500 mb-4">Updated: {formatDate(note.updatedAt)}</p>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => handleEditNote(note.id)} className="text-sm text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDeleteNote(note.id, note.title)} className="text-sm text-red-600 hover:text-red-900">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No notes found.
        </div>
      )}
    </div>
  );
};
export default NotesPage;
