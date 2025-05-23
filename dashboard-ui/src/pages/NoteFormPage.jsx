// src/pages/NoteFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoteById, createNote, updateNote } from '../services/noteService'; // Import note service

const NoteFormPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(noteId);

  const [formData, setFormData] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      setError('');
      const fetchNote = async () => {
        try {
          const response = await getNoteById(noteId);
          setFormData({ title: response.data.title, content: response.data.content });
        } catch (err) {
          console.error(`Failed to fetch note ${noteId}:`, err);
          setError(err.response?.data?.message || err.message || "Could not fetch note data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchNote();
    } else {
      setFormData({ title: '', content: '' });
      setIsLoading(false);
    }
  }, [noteId, isEditing]);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (isEditing) {
        await updateNote(noteId, formData);
        console.log('Note updated successfully');
      } else {
        await createNote(formData);
        console.log('Note created successfully');
      }
      navigate('/notes');
    } catch (err) {
      console.error("Failed to save note:", err);
      setError(err.response?.data?.message || err.message || "Failed to save note.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditing) return <div className="p-4 text-center">Loading note data...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">{isEditing ? 'Edit Note' : 'Add New Note'}</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-bold text-gray-700">Title</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required 
                 className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-bold text-gray-700">Content</label>
          <textarea name="content" id="content" value={formData.content} onChange={handleChange} rows="10" required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 whitespace-pre-wrap"></textarea>
        </div>
        <div className="flex items-center justify-end space-x-3">
          <button type="button" onClick={() => navigate('/notes')} disabled={isLoading}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50">
            {isLoading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Note' : 'Save Note')}
          </button>
        </div>
      </form>
    </div>
  );
};
export default NoteFormPage;
