// src/services/taskService.js
// Similar structure to customerService.js and leadService.js

let mockTasks = [
  { id: 'T1', title: 'Follow up with ACME Corp', description: 'Discuss new proposal', dueDate: '2024-08-15', status: 'Pending', assignedTo: 'John Doe' },
  { id: 'T2', title: 'Prepare Q3 presentation', description: 'Sales figures and projections', dueDate: '2024-08-20', status: 'In Progress', assignedTo: 'Jane Smith' },
  { id: 'T3', title: 'Team meeting', description: 'Weekly sync', dueDate: '2024-08-05', status: 'Completed', assignedTo: 'John Doe' },
];

const simulateApiCall = (data, delay = 300) => 
  new Promise(resolve => setTimeout(() => resolve({ data }), delay));

const simulateError = (message, status = 500) =>
  new Promise((_, reject) => setTimeout(() => reject({ response: { data: { message }, status } }), 300));

export const getAllTasks = async () => {
  console.log('taskService.getAllTasks: Fetching all tasks (mock)');
  return simulateApiCall([...mockTasks]);
};

export const getTaskById = async (id) => {
  console.log(`taskService.getTaskById: Fetching task ${id} (mock)`);
  const task = mockTasks.find(t => t.id === id);
  if (task) return simulateApiCall({ ...task });
  return simulateError(`Task with id ${id} not found`, 404);
};

export const createTask = async (taskData) => {
  console.log('taskService.createTask: Creating task (mock)', taskData);
  const newTask = { ...taskData, id: `T${Date.now()}` }; // Ensure ID format is consistent
  mockTasks.push(newTask);
  return simulateApiCall(newTask);
};

export const updateTask = async (id, taskData) => {
  console.log(`taskService.updateTask: Updating task ${id} (mock)`, taskData);
  const index = mockTasks.findIndex(t => t.id === id);
  if (index !== -1) {
    mockTasks[index] = { ...mockTasks[index], ...taskData };
    return simulateApiCall({ ...mockTasks[index] });
  }
  return simulateError(`Task with id ${id} not found for update`, 404);
};

export const deleteTask = async (id) => {
  console.log(`taskService.deleteTask: Deleting task ${id} (mock)`);
  const index = mockTasks.findIndex(t => t.id === id);
  if (index !== -1) {
    mockTasks.splice(index, 1);
    return simulateApiCall({ message: 'Task deleted successfully' });
  }
  return simulateError(`Task with id ${id} not found for deletion`, 404);
};
