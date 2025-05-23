// src/pages/LeadsPage.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import { getAllLeads, deleteLead } from '../services/leadService'; // Import lead service

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [error, setError] = useState(''); // Added error state
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getAllLeads();
        setLeads(response.data);
      } catch (err) {
        console.error("Failed to fetch leads:", err);
        setError(err.response?.data?.message || err.message || "Could not fetch leads.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const handleDeleteLead = async (leadId, leadName) => { // Made async
    if (window.confirm(`Are you sure you want to delete lead "${leadName}"?`)) {
      try {
        await deleteLead(leadId);
        setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
        console.log(`Lead ${leadId} deleted successfully.`);
      } catch (err) {
        console.error(`Failed to delete lead ${leadId}:`, err);
        setError(err.response?.data?.message || err.message || `Could not delete lead ${leadName}.`);
      }
    }
  };

  const handleEditLead = (leadId) => navigate(`/leads/edit/${leadId}`);
  const handleAddLead = () => navigate('/leads/new');

  const filteredLeads = leads.filter(lead =>
    lead.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-4 text-center">Loading leads...</div>;
  // Error display can be added here or below as in CustomersPage example

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Manage Leads</h1>
        <button onClick={handleAddLead} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Add New Lead
        </button>
      </div>
      
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-center">{error}</p>}

      <div className="mb-4">
        <input type="text" placeholder="Search leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length > 0 ? filteredLeads.map(lead => (
              <tr key={lead.id}>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{lead.contactName}</td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{lead.companyName}</td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{lead.email}</td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">{lead.phone}</td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                   <span
                    className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                      lead.status === 'Qualified' ? 'text-green-900' : lead.status === 'Lost' ? 'text-red-900' : lead.status === 'Won' ? 'text-blue-900': 'text-yellow-900' 
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-0 ${
                        lead.status === 'Qualified' ? 'bg-green-200' : lead.status === 'Lost' ? 'bg-red-200' : lead.status === 'Won' ? 'bg-blue-200' : 'bg-yellow-200'
                      } opacity-50 rounded-full`}
                    ></span>
                    <span className="relative">{lead.status}</span>
                  </span>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                  <button onClick={() => handleEditLead(lead.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button onClick={() => handleDeleteLead(lead.id, lead.contactName)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="text-center py-10 text-gray-500">No leads found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default LeadsPage;
