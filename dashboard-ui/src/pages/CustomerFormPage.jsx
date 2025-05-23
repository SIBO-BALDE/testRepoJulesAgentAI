// src/pages/CustomerFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById, createCustomer, updateCustomer } from '../services/customerService'; // Import customer service

const CustomerFormPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(customerId);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    status: 'Active', // Default status
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      setError('');
      const fetchCustomer = async () => {
        try {
          const response = await getCustomerById(customerId);
          setFormData({
            name: response.data.name,
            email: response.data.email,
            company: response.data.company,
            status: response.data.status,
          });
        } catch (err) {
          console.error(`Failed to fetch customer ${customerId}:`, err);
          setError(err.response?.data?.message || err.message || "Could not fetch customer data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchCustomer();
    } else {
      // Reset form for new customer
      setFormData({ name: '', email: '', company: '', status: 'Active' });
      setIsLoading(false); // Not loading if creating new
    }
  }, [customerId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isEditing) {
        await updateCustomer(customerId, formData);
        console.log('Customer updated successfully');
      } else {
        await createCustomer(formData);
        console.log('Customer created successfully');
      }
      navigate('/customers');
    } catch (err) {
      console.error("Failed to save customer:", err);
      setError(err.response?.data?.message || err.message || "Failed to save customer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditing) return <div className="p-4 text-center">Loading customer data...</div>;
  // if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>; // Already handled below

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        {isEditing ? 'Edit Customer' : 'Add New Customer'}
      </h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="mb-4">
          <label htmlFor="company" className="block text-gray-700 text-sm font-bold mb-2">Company</label>
          <input type="text" name="company" id="company" value={formData.company} onChange={handleChange}
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="mb-6">
          <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex items-center justify-end space-x-3">
          <button type="button" onClick={() => navigate('/customers')}
                  disabled={isLoading}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50">
            {isLoading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Customer' : 'Save Customer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerFormPage;
