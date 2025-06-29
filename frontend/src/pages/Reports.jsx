// import React, { useState, useEffect } from 'react';
// import { Bar, Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
// import { saveAs } from 'file-saver';
// import axios from 'axios';
// import DashboardLayout from '../components/DashboardLayout';

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// const Reports = () => {
//   const [monthlyExpenses, setMonthlyExpenses] = useState([]);
//   const [categoryBreakdown, setCategoryBreakdown] = useState([]);
//   const [incomeVsExpenses, setIncomeVsExpenses] = useState({ income: 0, expenses: 0 });

//   useEffect(() => {
//     const fetchReportsData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           console.error('No token found. Please log in.');
//           return;
//         }

//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         // Fetch monthly expenses
//         const monthlyResponse = await axios.get('/reports/monthly-expenses', config);
//         setMonthlyExpenses(monthlyResponse.data);

//         // Fetch category breakdown
//         const categoryResponse = await axios.get('/reports/category-breakdown', config);
//         setCategoryBreakdown(categoryResponse.data);

//         // Fetch income vs expenses
//         const incomeExpenseResponse = await axios.get('/reports/income-vs-expenses', config);
//         setIncomeVsExpenses(incomeExpenseResponse.data);
//       } catch (error) {
//         console.error('Error fetching reports data:', error);
//       }
//     };

//     fetchReportsData();
//   }, []);
//   const handleGenerateMonthlyExpenses = () => {
//     const monthlyTotals = expenses.reduce((acc, expense) => {
//       const month = new Date(expense.date).toLocaleString('default', { month: 'long' });
//       acc[month] = (acc[month] || 0) + expense.amount;
//       return acc;
//     }, {});

//     const formattedMonthlyExpenses = Object.entries(monthlyTotals).map(([month, total]) => ({
//       month,
//       total,
//     }));

//     setMonthlyExpenses(formattedMonthlyExpenses);
//   };
//   const handleExportPDF = () => {
//     alert('Export to PDF functionality coming soon!');
//   };

//   const handleExportCSV = () => {
//     const csvData = [
//       ['Month', 'Expense'],
//       ...monthlyExpenses.map((item) => [item.month, item.expense]),
//     ];
//     const csvContent = csvData.map((row) => row.join(',')).join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, 'monthly_expenses.csv');
//   };

//   const barChartData = {
//     labels: monthlyExpenses.map((item) => item.month),
//     datasets: [
//       {
//         label: 'Monthly Expenses',
//         data: monthlyExpenses.map((item) => item.expense),
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const pieChartData = {
//     labels: categoryBreakdown.map((category) => category.name),
//     datasets: [
//       {
//         label: 'Category Breakdown',
//         data: categoryBreakdown.map((category) => category.amount),
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.6)',
//           'rgba(54, 162, 235, 0.6)',
//           'rgba(255, 206, 86, 0.6)',
//           'rgba(75, 192, 192, 0.6)',
//           'rgba(153, 102, 255, 0.6)',
//           'rgba(255, 159, 64, 0.6)',
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(75, 192, 192, 1)',
//           'rgba(153, 102, 255, 1)',
//           'rgba(255, 159, 64, 1)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-600 p-8 text-white">
//         <h1 className="text-4xl font-bold mb-6 underline">Reports</h1>

//         {/* Monthly Expense Reports */}
//         <div className="grid grid-cols-2 gap-6 mb-6">
//           {/* Bar Chart */}
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Monthly Expense Reports</h2>
//             <Bar
//               data={barChartData}
//               options={{
//                 plugins: {
//                   legend: { display: true },
//                   tooltip: { enabled: true },
//                 },
//                 scales: {
//                   y: {
//                     ticks: {
//                       color: 'white', // Ensure numbers are clearly visible
//                     },
//                   },
//                   x: {
//                     ticks: {
//                       color: 'white', // Ensure labels are clearly visible
//                     },
//                   },
//                 },
//               }}
//             />
//           </div>

//           {/* Pie Chart */}
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Category-wise Expense Breakdown</h2>
//             <Pie data={pieChartData} />
//           </div>
//         </div>

//         {/* Horizontal Line */}
//         <hr className="border-gray-300 my-6" />

//         {/* Income vs Expenses */}
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold mb-4">Income vs Expenses</h2>
//           <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-300 text-gray-800">
//             <p>
//               <strong>Income:</strong> ₹{incomeVsExpenses.income}
//             </p>
//             <p>
//               <strong>Expenses:</strong> ₹{incomeVsExpenses.expenses}
//             </p>
//           </div>
//         </div>
//         <hr className='border-gray-400 mb-4'></hr>
//         {/* create monthly expense section */}
//         <div className="w-1/2 mb-4">
//             <h2 className="text-2xl font-bold mb-4">Generate Monthly Expenses</h2>
//             <button
//               onClick={handleGenerateMonthlyExpenses}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
//             >
//               Generate Monthly Expenses
//             </button>
//           </div>
//           <hr className='border-gray-400 mb-4'></hr>
//         {/* Export Options */}
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold mb-4">Export Reports</h2>
//           <button
//             onClick={handleExportPDF}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 mr-4"
//           >
//             Export to PDF
//           </button>
//           <button
//             onClick={handleExportCSV}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
//           >
//             Export to CSV
//           </button>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Reports;

import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { saveAs } from 'file-saver';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Reports = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [incomeVsExpenses, setIncomeVsExpenses] = useState({ income: 0, expenses: 0 });

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. Please log in.');
          // You might want to redirect to a login page here
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch monthly expenses
        const monthlyResponse = await axios.get('/reports/monthly-expenses', config);
        setMonthlyExpenses(monthlyResponse.data);

        // Fetch category breakdown
        const categoryResponse = await axios.get('/reports/category-breakdown', config);
        setCategoryBreakdown(categoryResponse.data);

        // Fetch income vs expenses
        const incomeExpenseResponse = await axios.get('/reports/income-vs-expenses', config);
        setIncomeVsExpenses(incomeExpenseResponse.data);
      } catch (error) {
        console.error('Error fetching reports data:', error);
        // Handle error, e.g., show a toast notification
      }
    };

    fetchReportsData();
  }, []);

  // Placeholder for `expenses` array. In a real application, this would come from an API or state.
  // Assuming `expenses` would be fetched similarly to other data.
  const expenses = [
    { date: '2025-01-15', amount: 200, category: 'Food' },
    { date: '2025-01-20', amount: 50, category: 'Transport' },
    { date: '2025-02-10', amount: 150, category: 'Shopping' },
    { date: '2025-02-25', amount: 75, category: 'Food' },
    { date: '2025-03-05', amount: 300, category: 'Rent' },
    { date: '2025-03-18', amount: 60, category: 'Utilities' },
  ];

  const handleGenerateMonthlyExpenses = () => {
    const monthlyTotals = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});

    const formattedMonthlyExpenses = Object.entries(monthlyTotals).map(([month, total]) => ({
      month,
      expense: total, // Changed 'total' to 'expense' to match your chart data structure
    }));

    setMonthlyExpenses(formattedMonthlyExpenses);
  };

  const handleExportPDF = () => {
    // In a real application, you'd use a library like jsPDF or a backend service
    alert('Export to PDF functionality coming soon! For a real app, consider libraries like jsPDF or integrating with a backend PDF generation service.');
  };

  const handleExportCSV = () => {
    if (monthlyExpenses.length === 0) {
      alert('No monthly expense data to export. Please generate the report first.');
      return;
    }
    const csvData = [
      ['Month', 'Expense'],
      ...monthlyExpenses.map((item) => [item.month, item.expense]),
    ];
    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'monthly_expenses.csv');
  };

  const barChartData = {
    labels: monthlyExpenses.map((item) => item.month),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyExpenses.map((item) => item.expense),
        backgroundColor: 'rgba(129, 206, 226, 0.7)', // Softer blue
        borderColor: 'rgba(129, 206, 226, 1)',
        borderWidth: 1,
        borderRadius: 5, // Slightly rounded bars
      },
    ],
  };

  const pieChartData = {
    labels: categoryBreakdown.map((category) => category.name),
    datasets: [
      {
        label: 'Category Breakdown',
        data: categoryBreakdown.map((category) => category.amount),
        backgroundColor: [
          'rgba(255, 159, 177, 0.7)', // Softer red
          'rgba(129, 206, 226, 0.7)', // Softer blue
          'rgba(255, 223, 128, 0.7)', // Softer yellow
          'rgba(149, 223, 185, 0.7)', // Softer green
          'rgba(197, 160, 255, 0.7)', // Softer purple
          'rgba(255, 192, 128, 0.7)', // Softer orange
        ],
        borderColor: [
          'rgba(255, 159, 177, 1)',
          'rgba(129, 206, 226, 1)',
          'rgba(255, 223, 128, 1)',
          'rgba(149, 223, 185, 1)',
          'rgba(197, 160, 255, 1)',
          'rgba(255, 192, 128, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white font-sans">
        {/* Header */}
        <h1 className="text-5xl font-extrabold mb-10 text-center tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Financial Insights & Reports
        </h1>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Monthly Expense Reports Card */}
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-blue-300">Monthly Expense Trends</h2>
            <div className="h-80"> {/* Fixed height for consistent chart size */}
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // Allows the chart to fill its container
                  plugins: {
                    legend: {
                      display: true,
                      labels: {
                        color: 'rgb(200, 200, 200)', // Lighter legend text
                      },
                    },
                    tooltip: {
                      enabled: true,
                      backgroundColor: 'rgba(30, 41, 59, 0.9)', // Darker tooltip background
                      titleColor: 'rgb(255, 255, 255)',
                      bodyColor: 'rgb(200, 200, 200)',
                      borderColor: 'rgb(75, 192, 192)',
                      borderWidth: 1,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)', // Subtle grid lines
                      },
                      ticks: {
                        color: 'rgb(200, 200, 200)',
                      },
                    },
                    x: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      ticks: {
                        color: 'rgb(200, 200, 200)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Category-wise Expense Breakdown Card */}
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-purple-300">Category-wise Breakdown</h2>
            <div className="h-80 flex items-center justify-center"> {/* Centering pie chart */}
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'right', // Legend on the right for better use of space
                      labels: {
                        color: 'rgb(200, 200, 200)',
                      },
                    },
                    tooltip: {
                      enabled: true,
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      titleColor: 'rgb(255, 255, 255)',
                      bodyColor: 'rgb(200, 200, 200)',
                      borderColor: 'rgb(75, 192, 192)',
                      borderWidth: 1,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-10" /> {/* Thicker, darker separator */}

        {/* Income vs Expenses Section */}
        <div className="mb-10 bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700 hover:border-green-500 transition-all duration-300">
          <h2 className="text-3xl font-semibold mb-6 text-green-300">Income vs. Expenses Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
            <div className="bg-gray-700 rounded-lg p-5 shadow-inner flex items-center justify-between">
              <span className="text-gray-300">Total Income:</span>
              <span className="font-bold text-green-400 text-2xl">₹{incomeVsExpenses.income.toFixed(2)}</span>
            </div>
            <div className="bg-gray-700 rounded-lg p-5 shadow-inner flex items-center justify-between">
              <span className="text-gray-300">Total Expenses:</span>
              <span className="font-bold text-red-400 text-2xl">₹{incomeVsExpenses.expenses.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-6 text-xl text-center">
            {incomeVsExpenses.income > incomeVsExpenses.expenses ? (
              <p className="text-blue-400 font-medium">You're doing great! Your income exceeds your expenses.</p>
            ) : (
              <p className="text-yellow-400 font-medium">Keep an eye on your spending. Consider reviewing your budget.</p>
            )}
          </div>
        </div>

        <hr className="border-gray-700 my-10" />

        {/* Generate Monthly Expenses & Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Generate Report Section */}
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 hover:border-orange-500 transition-all duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-orange-300">Generate Reports</h2>
            <button
              onClick={handleGenerateMonthlyExpenses}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105"
            >
              Generate Monthly Expenses Report
            </button>
          </div>

          {/* Export Options Section */}
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-cyan-300">Export Options</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleExportPDF}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white font-semibold rounded-lg shadow-md hover:from-red-700 hover:to-pink-800 transition-all duration-300 transform hover:scale-105"
              >
                Export to PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-700 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-teal-800 transition-all duration-300 transform hover:scale-105"
              >
                Export to CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;