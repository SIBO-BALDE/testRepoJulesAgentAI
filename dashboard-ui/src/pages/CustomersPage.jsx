// src/pages/CustomersPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCustomers, deleteCustomer } from '../services/customerService';
import SearchInput from '../components/common/SearchInput'; // Import SearchInput

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [error, setError] = useState(''); // Added error state
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getAllCustomers();
        setCustomers(response.data);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setError(err.response?.data?.message || err.message || "Could not fetch customers.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId, customerName) => {
    if (window.confirm(`Are you sure you want to delete customer "${customerName}"?`)) {
      try {
        await deleteCustomer(customerId);
        setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== customerId));
        console.log(`Customer ${customerId} deleted successfully.`);
      } catch (err) {
        console.error(`Failed to delete customer ${customerId}:`, err);
        setError(err.response?.data?.message || err.message || `Could not delete customer ${customerName}.`);
        // Optionally, re-fetch customers to ensure UI consistency if delete failed partially
        // or if there's a possibility of out-of-sync state.
      }
    }
  };

  // Navigate to edit page (to be created)
  const handleEditCustomer = (customerId) => {
    console.log(`Navigate to edit page for customer: ${customerId}`);
    navigate(`/customers/edit/${customerId}`);
  };
  
  // Navigate to add page (to be created)
  const handleAddCustomer = () => {
    console.log('Navigate to add new customer page');
    navigate('/customers/new');
  };

  // Filtered customers based on searchTerm
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (isLoading) return <div className="p-4 text-center">Loading customers...</div>;
  // if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>; // This was commented out in example, but good for UX

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Manage Customers</h1>
        <button
          onClick={handleAddCustomer}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add New Customer
        </button>
      </div>
      
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-center">{error}</p>}

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search customers..."
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Company
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{customer.name}</p>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{customer.email}</p>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{customer.company}</p>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                  <span
                    className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                      customer.status === 'Active' ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-0 ${
                        customer.status === 'Active' ? 'bg-green-200' : 'bg-red-200'
                      } opacity-50 rounded-full`}
                    ></span>
                    <span className="relative">{customer.status}</span>
                  </span>
                </td>
                <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                  <button
                    onClick={() => handleEditCustomer(customer.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersPage;
