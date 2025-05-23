// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';

import { getAllCustomers } from '../services/customerService'; // Adjust path if needed
import { getAllLeads } from '../services/leadService';     // Adjust path if needed

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// StatCard component (assuming it's still defined inline or imported)
const StatCard = ({ title, value, icon, description }) => ( // Added icon back for completeness from original
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="flex items-center">
      {icon && <div className="mr-4 text-3xl text-blue-500">{icon}</div>}
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
    </div>
  </div>
);


const DashboardPage = () => {
  const [customerStatusData, setCustomerStatusData] = useState(null);
  const [leadStatusData, setLeadStatusData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // For loading state

  // Mock data for stat cards (as before)
  const stats = [
    { title: 'Total Customers', value: '1,234', description: 'Growing steadily' },
    { title: 'New Leads This Month', value: '86', description: '+5 since last month' },
    { title: 'Pending Tasks', value: '12', description: '3 overdue' },
    { title: 'Revenue (MTD)', value: '$15,780', description: 'Target: $20,000' },
  ];


  useEffect(() => {
    const fetchDataForCharts = async () => {
      setIsLoading(true);
      try {
        // Fetch Customer Data
        const customerResponse = await getAllCustomers();
        if (customerResponse && customerResponse.data) {
          const statuses = customerResponse.data.reduce((acc, customer) => {
            acc[customer.status] = (acc[customer.status] || 0) + 1;
            return acc;
          }, {});
          setCustomerStatusData({
            labels: Object.keys(statuses),
            datasets: [{
              label: 'Customer Statuses',
              data: Object.values(statuses),
              backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 205, 86, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(153, 102, 255, 0.6)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 205, 86, 1)', 'rgba(54, 162, 235, 1)', 'rgba(153, 102, 255, 1)'],
              borderWidth: 1,
            }],
          });
        }

        // Fetch Lead Data
        const leadResponse = await getAllLeads();
        if (leadResponse && leadResponse.data) {
          const statuses = leadResponse.data.reduce((acc, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1;
            return acc;
          }, {});
          setLeadStatusData({
            labels: Object.keys(statuses),
            datasets: [{
              label: 'Lead Statuses',
              data: Object.values(statuses),
              backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 205, 86, 0.6)'],
              borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 205, 86, 1)'],
              borderWidth: 1,
            }],
          });
        }
      } catch (error) {
        console.error("Failed to fetch data for charts:", error);
        // Handle error state if necessary
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataForCharts();
  }, []);
  
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Customer Status Distribution' }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Often legend is not needed if direct labeling or title is clear
      title: { display: true, text: 'Lead Status Overview' }
    },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } 
  };


  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>
      {/* Stat Cards Section (as before) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => ( <StatCard key={index} title={stat.title} value={stat.value} description={stat.description} icon={stat.icon}/> ))}
      </div>

      {/* Chart Placeholders Section - Now with actual charts */}
      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">Loading charts...</p>
          {/* Optional: Add a spinner component here */}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Customer Statuses</h2>
            {customerStatusData && customerStatusData.labels && customerStatusData.labels.length > 0 ? (
              <Pie data={customerStatusData} options={pieOptions} />
            ) : (
              <p className="text-center text-gray-500 py-10">No customer data available for chart.</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Lead Statuses</h2>
            {leadStatusData && leadStatusData.labels && leadStatusData.labels.length > 0 ? (
              <Bar data={leadStatusData} options={barOptions} />
            ) : (
              <p className="text-center text-gray-500 py-10">No lead data available for chart.</p>
            )}
          </div>
        </div>
      )}
      {/* ... (Optional: Recent Activity Section as before) ... */}
    </div>
  );
};

export default DashboardPage;
