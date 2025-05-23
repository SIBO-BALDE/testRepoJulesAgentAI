// src/pages/LeadFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeadById, createLead, updateLead } from '../services/leadService'; // Import lead service

const LeadFormPage = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(leadId);

  const [formData, setFormData] = useState({
    contactName: '',
    companyName: '',
    email: '',
    phone: '',
    status: 'New', // Default status
  });
  const [isLoading, setIsLoading] = useState(false); // Keep for loading state
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      setError('');
      const fetchLead = async () => {
        try {
          const response = await getLeadById(leadId);
          setFormData(response.data); // Assuming service returns { data: lead }
        } catch (err) {
          console.error(`Failed to fetch lead ${leadId}:`, err);
          setError(err.response?.data?.message || err.message || "Could not fetch lead data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchLead();
    } else {
      // Reset form for new lead
      setFormData({ contactName: '', companyName: '', email: '', phone: '', status: 'New' });
      setIsLoading(false);
    }
  }, [leadId, isEditing]);

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
        await updateLead(leadId, formData);
        console.log('Lead updated successfully');
      } else {
        await createLead(formData);
        console.log('Lead created successfully');
      }
      navigate('/leads');
    } catch (err) {
      console.error("Failed to save lead:", err);
      setError(err.response?.data?.message || err.message || "Failed to save lead.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditing) return <div className="p-4 text-center">Loading lead data...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        {isEditing ? 'Edit Lead' : 'Add New Lead'}
      </h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="contactName" className="block text-sm font-bold text-gray-700">Contact Name</label>
          <input type="text" name="contactName" id="contactName" value={formData.contactName} onChange={handleChange} required
                 className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div className="mb-4">
          <label htmlFor="companyName" className="block text-sm font-bold text-gray-700">Company Name</label>
          <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange}
                 className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required
                 className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-bold text-gray-700">Phone</label>
          <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange}
                 className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div className="mb-6">
          <label htmlFor="status" className="block text-sm font-bold text-gray-700">Status</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
            <option value="Won">Won</option>
          </select>
        </div>
        <div className="flex items-center justify-end space-x-3">
          <button type="button" onClick={() => navigate('/leads')} disabled={isLoading}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50">
            {isLoading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Lead' : 'Save Lead')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadFormPage;
