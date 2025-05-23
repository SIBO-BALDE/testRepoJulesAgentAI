// src/pages/TasksPage.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import { getAllTasks, deleteTask } from '../services/taskService'; // Import task service

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [error, setError] = useState(''); // Added error state
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getAllTasks();
        setTasks(response.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError(err.response?.data?.message || err.message || "Could not fetch tasks.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleDeleteTask = async (taskId, taskTitle) => { // Made async
    if (window.confirm(`Are you sure you want to delete task "${taskTitle}"?`)) {
      try {
        await deleteTask(taskId);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        console.log(`Task ${taskId} deleted successfully.`);
      } catch (err) {
        console.error(`Failed to delete task ${taskId}:`, err);
        setError(err.response?.data?.message || err.message || `Could not delete task ${taskTitle}.`);
      }
    }
  };

  const handleEditTask = (taskId) => navigate(`/tasks/edit/${taskId}`);
  const handleAddTask = () => navigate('/tasks/new');

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.assignedTo && task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) return <div className="p-4 text-center">Loading tasks...</div>;
  // Error display can be added here or below

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Manage Tasks</h1>
        <button onClick={handleAddTask} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Task
        </button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-center">{error}</p>}
      
      <div className="mb-4">
        <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"/>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Due Date</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Assigned To</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? filteredTasks.map(task => (
              <tr key={task.id}>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{task.title}</td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{task.dueDate}</td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                    task.status === 'Completed' ? 'text-green-900' : task.status === 'In Progress' ? 'text-yellow-900' : 'text-red-900' // Default to red for Pending or other statuses
                  }`}>
                    <span aria-hidden className={`absolute inset-0 ${
                      task.status === 'Completed' ? 'bg-green-200' : task.status === 'In Progress' ? 'bg-yellow-200' : 'bg-red-200'
                    } opacity-50 rounded-full`}></span>
                    <span className="relative">{task.status}</span>
                  </span>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{task.assignedTo || 'N/A'}</td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                  <button onClick={() => handleEditTask(task.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button onClick={() => handleDeleteTask(task.id, task.title)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="text-center py-10 text-gray-500">No tasks found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TasksPage;
