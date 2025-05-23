// src/services/leadService.js
// Similar structure to customerService.js

let mockLeads = [
  { id: 'L1', contactName: 'Peter Pan', companyName: 'Neverland Solutions', email: 'peter@neverland.io', phone: '555-0101', status: 'New' },
  { id: 'L2', contactName: 'Wendy Darling', companyName: 'Storytime Inc.', email: 'wendy@storytime.co', phone: '555-0102', status: 'Contacted' },
  { id: 'L3', contactName: 'Captain Hook', companyName: 'Jolly Roger Co.', email: 'hook@jollyroger.com', phone: '555-0103', status: 'Qualified' },
];

const simulateApiCall = (data, delay = 300) => 
  new Promise(resolve => setTimeout(() => resolve({ data }), delay));

const simulateError = (message, status = 500) =>
  new Promise((_, reject) => setTimeout(() => reject({ response: { data: { message }, status } }), 300));

export const getAllLeads = async () => {
  console.log('leadService.getAllLeads: Fetching all leads (mock)');
  return simulateApiCall([...mockLeads]);
};

export const getLeadById = async (id) => {
  console.log(`leadService.getLeadById: Fetching lead ${id} (mock)`);
  const lead = mockLeads.find(l => l.id === id);
  if (lead) return simulateApiCall({ ...lead });
  return simulateError(`Lead with id ${id} not found`, 404);
};

export const createLead = async (leadData) => {
  console.log('leadService.createLead: Creating lead (mock)', leadData);
  const newLead = { ...leadData, id: `L${Date.now()}` }; // Ensure ID format is consistent if needed
  mockLeads.push(newLead);
  return simulateApiCall(newLead);
};

export const updateLead = async (id, leadData) => {
  console.log(`leadService.updateLead: Updating lead ${id} (mock)`, leadData);
  const index = mockLeads.findIndex(l => l.id === id);
  if (index !== -1) {
    mockLeads[index] = { ...mockLeads[index], ...leadData };
    return simulateApiCall({ ...mockLeads[index] });
  }
  return simulateError(`Lead with id ${id} not found for update`, 404);
};

export const deleteLead = async (id) => {
  console.log(`leadService.deleteLead: Deleting lead ${id} (mock)`);
  const index = mockLeads.findIndex(l => l.id === id);
  if (index !== -1) {
    mockLeads.splice(index, 1);
    return simulateApiCall({ message: 'Lead deleted successfully' });
  }
  return simulateError(`Lead with id ${id} not found for deletion`, 404);
};
