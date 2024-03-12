import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip as ChartTooltip, Legend, } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const Portfolio = () => {
  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
      label: 'Portfolio Value',
      data: [12000, 19000, 3000, 5000, 2000, 3000],
      fill: false,
      backgroundColor: 'rgb(75, 192, 192)',
      borderColor: 'rgba(75, 192, 192, 0.2)',
    }],
  };

  const pieChartData = {
    labels: ['Bitcoin', 'Ethereum', 'Ripple', 'Litecoin'],
    datasets: [{
      label: 'Asset Distribution',
      data: [300, 50, 100, 50],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    }],
  };

  return (
    <div className="dashboard-page p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {/* Other components like TotalPortfolioValue, HoldingsSummary, etc. */}

      {/* Line Chart Card */}
      <div className="card bg-white p-4 shadow-lg rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Portfolio Value Over Time</h2>
        <div className="chart-container">
          <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Pie Chart Card */}
      <div className="card bg-white p-4 shadow-lg rounded-lg mb-6 w-50">
        <h2 className="text-lg font-semibold mb-4">Asset Distribution</h2>
        <div className="chart-container">
          <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
