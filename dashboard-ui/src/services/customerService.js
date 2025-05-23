// src/services/customerService.js
import apiClient from './api'; // Assuming apiClient is set up for actual calls

// In-memory store for mock data
let mockCustomers = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', company: 'Wonderland Inc.', status: 'Active' },
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com', company: 'BuildIt Co.', status: 'Active' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', company: 'Peanuts LLC', status: 'Inactive' },
];

const simulateApiCall = (data, delay = 300) => 
  new Promise(resolve => setTimeout(() => resolve({ data }), delay));

const simulateError = (message, status = 500) =>
  new Promise((_, reject) => setTimeout(() => reject({ response: { data: { message }, status } }), 300));


export const getAllCustomers = async () => {
  console.log('customerService.getAllCustomers: Fetching all customers (mock)');
  // Real: return apiClient.get('/customers');
  return simulateApiCall([...mockCustomers]); // Return a copy
};

export const getCustomerById = async (id) => {
  console.log(`customerService.getCustomerById: Fetching customer ${id} (mock)`);
  const customer = mockCustomers.find(c => c.id === id);
  // Real: return apiClient.get(`/customers/${id}`);
  if (customer) return simulateApiCall({ ...customer }); // Return a copy
  return simulateError(`Customer with id ${id} not found`, 404);
};

export const createCustomer = async (customerData) => {
  console.log('customerService.createCustomer: Creating customer (mock)', customerData);
  const newCustomer = { ...customerData, id: Date.now().toString() };
  mockCustomers.push(newCustomer);
  // Real: return apiClient.post('/customers', customerData);
  return simulateApiCall(newCustomer);
};

export const updateCustomer = async (id, customerData) => {
  console.log(`customerService.updateCustomer: Updating customer ${id} (mock)`, customerData);
  const index = mockCustomers.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCustomers[index] = { ...mockCustomers[index], ...customerData };
    // Real: return apiClient.put(`/customers/${id}`, customerData);
    return simulateApiCall({ ...mockCustomers[index] });
  }
  return simulateError(`Customer with id ${id} not found for update`, 404);
};

export const deleteCustomer = async (id) => {
  console.log(`customerService.deleteCustomer: Deleting customer ${id} (mock)`);
  const index = mockCustomers.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCustomers.splice(index, 1);
    // Real: return apiClient.delete(`/customers/${id}`);
    return simulateApiCall({ message: 'Customer deleted successfully' });
  }
  return simulateError(`Customer with id ${id} not found for deletion`, 404);
};
