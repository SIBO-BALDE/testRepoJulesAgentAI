// src/pages/DashboardPage.jsx
import React from 'react';
// Optional: import { FaUsers, FaChartLine, FaTasks } from 'react-icons/fa'; // Example icons

// Placeholder for StatCard component (or define inline)
const StatCard = ({ title, value, icon, description }) => (
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
  // Mock data for stat cards
  const stats = [
    { title: 'Total Customers', value: '1,234', description: 'Growing steadily' /* icon: <FaUsers /> */ },
    { title: 'New Leads This Month', value: '86', description: '+5 since last month' /* icon: <FaUsers /> */ },
    { title: 'Pending Tasks', value: '12', description: '3 overdue' /* icon: <FaTasks /> */ },
    { title: 'Revenue (MTD)', value: '$15,780', description: 'Target: $20,000' /* icon: <FaChartLine /> */ },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>

      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            // icon={stat.icon} // Uncomment if using icons
            description={stat.description}
          />
        ))}
      </div>

      {/* Chart Placeholders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales Trend (Placeholder)</h2>
          <div className="bg-gray-200 h-64 flex items-center justify-center rounded">
            <p className="text-gray-500">Chart will be displayed here</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Task Completion Rate (Placeholder)</h2>
          <div className="bg-gray-200 h-64 flex items-center justify-center rounded">
            <p className="text-gray-500">Another chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Optional: Recent Activity or Quick Links Section */}
      {/* <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-200">
          <li className="py-3"><span className="text-sm text-gray-600">New customer registered: John Doe</span></li>
          <li className="py-3"><span className="text-sm text-gray-600">Task "Follow up with ACME Corp" completed.</span></li>
          <li className="py-3"><span className="text-sm text-gray-600">Lead "BigFish Inc." converted to customer.</span></li>
        </ul>
      </div> */}
    </div>
  );
};

export default DashboardPage;
