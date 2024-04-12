import React, { useContext } from 'react';
import ThemeContext from "../components/ThemeContext/ThemeContext";

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
  const { theme } = useContext(ThemeContext); // Using ThemeContext







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




  // Conditional styles based on theme
  const tableTheme = theme === "dark" ? "" : "";
  const headerBgTheme = theme === "dark" ? "" : "";
  const bodyBgTheme = theme === "dark" ? "" : "";

  return (
    <div className="w-full screen dashboard-page px-14 pt-5">
      
      <div className='w-full flex  justify-between'>
      <h1 className="headline-28 mb-4 pt-2">Portfolio</h1>
      {/* Other components like TotalPortfolioValue, HoldingsSummary, etc. */}
        {/*Left Side Container */}
        {/* Profile Dock */}
    
        {/* Container */}
        <div className='w-[50%] h-[54px] border rounded-full label-12 p-1 px-6 flex gap-4 overflow-x-scroll flex-shrink-0 '>
          {/* Overview Container */}
          <div className='w-auto'>
            <p className='p-1'>Overview Total</p>
            <p className='px-1'>$4,203.39</p>
          </div>
          {/* Portfolio Container */}
          <div className='w-[350px] label-10  '>
            <h3 className='p-1 label-10'>My Portfolios</h3>
            <div className='px-1 flex gap-3 w-full overflow-x-scroll'>
              <div className='flex  gap-2'>
                <img className='w-[20px] h-[20px] border rounded-full' />
                <div className='flex flex-col'>
                  <span>Portfolio 1</span>
                  <span>$2,231.43</span>
                </div>
              </div>

              {/* ----------------------------------------- */}

              <div className='flex  gap-2'>
                <img className='w-[20px] h-[20px] border rounded-full' />
                <div className='flex flex-col'>
                  <span>Portfolio 2</span>
                  <span>$2,231.43</span>
                </div>
              </div>

              {/* ---------------------------------------------- */}


              <div className='flex  gap-2'>
                <img className='w-[20px] h-[20px] border rounded-full' />
                <div className='flex flex-col'>
                  <span>Portfolio 3</span>
                  <span>$2,231.43</span>
                </div>
              </div>

              {/* ---------------------------------------------- */}


              <div className='flex  gap-2'>
                <img className='w-[20px] h-[20px] border rounded-full' />
                <div className='flex flex-col'>
                  <span>Portfolio 4</span>
                  <span>$2,231.43</span>
                </div>
              </div>

              
            </div>
          </div>

          {/* Other Content */}
          <div className='w-[150px]  label-10'>
          <h3 className='p-1'>Community</h3>
          <div className='w-full flex px-1 gap-4'>
            <p>Track Portfolios +</p>
            <p>Start Question Thread</p>

          </div>
          </div>
        </div>
      
      </div>

      {/* CHARTS */}
      <div className='w-full h-auto xl:h-[500px] flex flex-col xl:grid xl:grid-cols-2 pb-4'>
        

      {/* Pie Chart Card */}
      <div className={`card w-full xl:w-[600px] h-[250px] p-4 shadow-lg rounded-lg mb-6 w-50 ${theme === "dark" ? " " : " "} `}>
        <h2 className="text-lg font-semibold mb-4">Asset Distribution</h2>
        <div className="chart-container">
          <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
      {/* Line Chart Card */}
      <div className={`card w-full xl:w-[600px] h-[250px] p-4 shadow-lg rounded-lg mb-6 ${theme === "dark" ? " " : " "}`}>
        <h2 className="text-lg font-semibold mb-4">Portfolio Value Over Time</h2>
        <div className="chart-container">
          <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>


      {/* ----------------------
      
      {/* Pie Chart Card */}
      <div className={`card w-full xl:w-[600px] h-[250px] p-4 shadow-lg rounded-lg mb-6 w-50 ${theme === "dark" ? " " : " "} `}>
        <h2 className="text-lg font-semibold mb-4">Asset Distribution</h2>
        <div className="chart-container">
          <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
      {/* Line Chart Card */}
      <div className={`card w-full xl:w-[600px] h-[250px] p-4 shadow-lg rounded-lg mb-6 ${theme === "dark" ? " " : " "}`}>
        <h2 className="text-lg font-semibold mb-4">Portfolio Value Over Time</h2>
        <div className="chart-container">
          <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
      </div>

      {/* Table */}

      <div
        className={`w-full h-full flex flex-col justify-center overflow-x-scroll lg:p-[50px]  ${
          theme === "dark" ? " " : ""
        }`}
      >
      <table className={`min-w-full divide-y divide-zinc-700 `}>
        <thead className={`${headerBgTheme}`}>
          <tr>
           
            {/* NAME */}
            <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider sticky left-[93px] z-40  ${theme === "dark" ? " bg-[#07172b]" : " bg-zinc-300"}`}>
              Name
            </th>
            {/* Price */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Price
            </th>
            {/* Low 24H */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Low 24H
            </th>
            {/* High 24H */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              High 24H
            </th>
            {/* 24H % */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              24H %
            </th>
            {/* Market Cap */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Market Cap
            </th>
            {/* Volume */}
            {/* <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Volume
            </th> */}
            {/* Circulating Supp */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Circulating Supply
            </th>
            {/* 7 Day */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              7 Day
            </th>
            {/* Holdings */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Holdings
            </th>
            {/* Avg Buy In Price */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Ave Buy Price
            </th>
            {/* Profit/Loss */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Profit/Loss
            </th>
            {/* Actions */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-zinc-600 bodyBgTheme`}>
      
            <tr key={crypto.id}>
              
              {/* Crypto Image, Name, & Symbol */}
              <td class={`px-5 py-3   text-left text-xs font-semibold  uppercase tracking-wider bodyBgTheme sticky left-[93px]  ${theme === "dark" ? " bg-[#07172b]" : " "}`}>
              
                  <div className="flex items-center gap-3">
                    
                    
                    <span className="font-light">
                      
                    </span>
                  </div>
                
              </td>
              {/* Crypto Price */}
              <td class="px-5 py-3  bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                
              </td>
              {/* Crypto Low24h */}
              <td class="px-5 py-3  bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                
              </td>
              {/* Crypto High24h */}
              <td class="px-5 py-3  bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                
              </td>
              {/* Crypto Change24h */}
              <td class="px-5 py-3  bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                <span
                  className={
                    crypto.change24h > 0
                      ? "text-green-500"
                      : crypto.change24h < 0
                      ? "text-red-500"
                      : "text-black"
                  }
                >
                 
                </span>
              </td>
              {/* Crypto Market Cap */}
              <td class="px-5 py-3 bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
               
              </td>
              {/* Crypto Volume */}
              {/* <td class="px-5 py-3 bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                ${Number(crypto.volume).toLocaleString()}
              </td> */}
              {/* Crypto Circulating Supply */}
              <td class="px-5 py-3 bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider pt-7 ">
                <div className=" items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full border"
                      style={{
                        width: `${
                          (crypto.supply / crypto.totalSupply) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold w-full">
                    
                  </span>
                </div>
              </td>
              {/* Implement visualization for weekly data */}
              {/* 7 Day Week */}
              <td class="px-5 py-3 bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                
              </td>
            </tr>
        
        </tbody>
      </table>

      </div>
      
    </div>
  );
};

export default Portfolio;
