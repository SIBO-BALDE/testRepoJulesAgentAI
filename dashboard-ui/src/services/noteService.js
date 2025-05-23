// src/services/noteService.js
// Similar structure to other service files

let mockNotes = [
  { id: 'N1', title: 'Meeting Summary Q3 Planning', content: 'Discussed budget allocations, marketing strategies, and new product roadmap...', createdAt: '2024-07-15', updatedAt: '2024-07-15' },
  { id: 'N2', title: 'Ideas for Project Phoenix', content: 'Consider using new framework X, explore integration with Y service.', createdAt: '2024-07-20', updatedAt: '2024-07-21' },
  { id: 'N3', title: 'Client Feedback - ACME', content: 'Client is happy with progress, suggested minor UI tweaks.', createdAt: '2024-07-22', updatedAt: '2024-07-22' },
];

const simulateApiCall = (data, delay = 300) => 
  new Promise(resolve => setTimeout(() => resolve({ data }), delay));

const simulateError = (message, status = 500) =>
  new Promise((_, reject) => setTimeout(() => reject({ response: { data: { message }, status } }), 300));

export const getAllNotes = async () => {
  console.log('noteService.getAllNotes: Fetching all notes (mock)');
  return simulateApiCall([...mockNotes]);
};

export const getNoteById = async (id) => {
  console.log(`noteService.getNoteById: Fetching note ${id} (mock)`);
  const note = mockNotes.find(n => n.id === id);
  if (note) return simulateApiCall({ ...note });
  return simulateError(`Note with id ${id} not found`, 404);
};

export const createNote = async (noteData) => {
  console.log('noteService.createNote: Creating note (mock)', noteData);
  const currentDate = new Date().toISOString().split('T')[0];
  const newNote = { ...noteData, id: `N${Date.now()}`, createdAt: currentDate, updatedAt: currentDate };
  mockNotes.push(newNote);
  return simulateApiCall(newNote);
};

export const updateNote = async (id, noteData) => {
  console.log(`noteService.updateNote: Updating note ${id} (mock)`, noteData);
  const index = mockNotes.findIndex(n => n.id === id);
  if (index !== -1) {
    const currentDate = new Date().toISOString().split('T')[0];
    mockNotes[index] = { ...mockNotes[index], ...noteData, updatedAt: currentDate };
    return simulateApiCall({ ...mockNotes[index] });
  }
  return simulateError(`Note with id ${id} not found for update`, 404);
};

export const deleteNote = async (id) => {
  console.log(`noteService.deleteNote: Deleting note ${id} (mock)`);
  const index = mockNotes.findIndex(n => n.id === id);
  if (index !== -1) {
    mockNotes.splice(index, 1);
    return simulateApiCall({ message: 'Note deleted successfully' });
  }
  return simulateError(`Note with id ${id} not found for deletion`, 404);
};
