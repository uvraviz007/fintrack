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
      }
    };

    fetchReportsData();
  }, []);
  const handleGenerateMonthlyExpenses = () => {
    const monthlyTotals = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'long' });
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});

    const formattedMonthlyExpenses = Object.entries(monthlyTotals).map(([month, total]) => ({
      month,
      total,
    }));

    setMonthlyExpenses(formattedMonthlyExpenses);
  };
  const handleExportPDF = () => {
    alert('Export to PDF functionality coming soon!');
  };

  const handleExportCSV = () => {
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
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
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
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-r from-gray-600 via-gray-400 to-gray-500 p-8 text-white">
        <h1 className="text-4xl font-bold mb-6 underline">Reports</h1>

        {/* Monthly Expense Reports */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Monthly Expense Reports</h2>
            <Bar
              data={barChartData}
              options={{
                plugins: {
                  legend: { display: true },
                  tooltip: { enabled: true },
                },
                scales: {
                  y: {
                    ticks: {
                      color: 'white', // Ensure numbers are clearly visible
                    },
                  },
                  x: {
                    ticks: {
                      color: 'white', // Ensure labels are clearly visible
                    },
                  },
                },
              }}
            />
          </div>

          {/* Pie Chart */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Category-wise Expense Breakdown</h2>
            <Pie data={pieChartData} />
          </div>
        </div>

        {/* Horizontal Line */}
        <hr className="border-gray-300 my-6" />

        {/* Income vs Expenses */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Income vs Expenses</h2>
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-300 text-gray-800">
            <p>
              <strong>Income:</strong> ₹{incomeVsExpenses.income}
            </p>
            <p>
              <strong>Expenses:</strong> ₹{incomeVsExpenses.expenses}
            </p>
          </div>
        </div>
        <hr className='border-gray-400 mb-4'></hr>
        {/* create monthly expense section */}
        <div className="w-1/2 mb-4">
            <h2 className="text-2xl font-bold mb-4">Generate Monthly Expenses</h2>
            <button
              onClick={handleGenerateMonthlyExpenses}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Generate Monthly Expenses
            </button>
          </div>
          <hr className='border-gray-400 mb-4'></hr>
        {/* Export Options */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Export Reports</h2>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 mr-4"
          >
            Export to PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            Export to CSV
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;