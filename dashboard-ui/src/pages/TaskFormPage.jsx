// src/pages/TaskFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById, createTask, updateTask } from '../services/taskService'; // Import task service

const TaskFormPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(taskId);

  const [formData, setFormData] = useState({
    title: '', description: '', dueDate: '', status: 'Pending', assignedTo: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      setError('');
      const fetchTask = async () => {
        try {
          const response = await getTaskById(taskId);
          // Ensure date is in YYYY-MM-DD for the input type="date"
          setFormData({...response.data, dueDate: response.data.dueDate || ''});
        } catch (err) {
          console.error(`Failed to fetch task ${taskId}:`, err);
          setError(err.response?.data?.message || err.message || "Could not fetch task data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchTask();
    } else {
      setFormData({ title: '', description: '', dueDate: '', status: 'Pending', assignedTo: '' });
      setIsLoading(false);
    }
  }, [taskId, isEditing]);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (isEditing) {
        await updateTask(taskId, formData);
        console.log('Task updated successfully');
      } else {
        await createTask(formData);
        console.log('Task created successfully');
      }
      navigate('/tasks');
    } catch (err) {
      console.error("Failed to save task:", err);
      setError(err.response?.data?.message || err.message || "Failed to save task.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditing) return <div className="p-4 text-center">Loading task data...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">{isEditing ? 'Edit Task' : 'Add New Task'}</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-bold text-gray-700">Title</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required 
                 className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-bold text-gray-700">Description</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" 
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-bold text-gray-700">Due Date</label>
            <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleChange} 
                   className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-bold text-gray-700">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} 
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="mb-6">
            <label htmlFor="assignedTo" className="block text-sm font-bold text-gray-700">Assigned To</label>
            <input type="text" name="assignedTo" id="assignedTo" value={formData.assignedTo} onChange={handleChange} placeholder="User's name or email" 
                   className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div className="flex items-center justify-end space-x-3">
          <button type="button" onClick={() => navigate('/tasks')} disabled={isLoading}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50">
            {isLoading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Task' : 'Save Task')}
          </button>
        </div>
      </form>
    </div>
  );
};
export default TaskFormPage;
