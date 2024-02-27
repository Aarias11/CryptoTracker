import React, { useState } from "react";
import { MdAdd, MdRemove, MdInfoOutline } from "react-icons/md";
import { Tooltip } from "@mui/material";

const mockHoldings = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    quantity: 0.5,
    currentPrice: 43000,
    averageBuyPrice: 40000,
    priceChange24h: 5,
    totalValue: 21500,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    quantity: 2,
    currentPrice: 3000,
    averageBuyPrice: 2500,
    priceChange24h: -3,
    totalValue: 6000,
  },
];

const PortfolioPage = () => {
  const [holdings, setHoldings] = useState(mockHoldings);
  const totalPortfolioValue = holdings.reduce(
    (acc, holding) => acc + holding.totalValue,
    0
  );

  const calculateProfitLoss = (holding) => {
    const profitLoss = (holding.currentPrice - holding.averageBuyPrice) * holding.quantity;
    return profitLoss.toFixed(2); // Adjust to your preferred decimal places
  };
  
  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-700">My Portfolio</h1>
        <p className="text-gray-600">
          Total Portfolio Value: ${totalPortfolioValue.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {holdings.map((holding) => (
          <div
            key={holding.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {holding.name} ({holding.symbol})
              </h2>
              <Tooltip title="Remove holding" placement="top">
                <MdRemove
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  size={24}
                />
              </Tooltip>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-gray-600">
                <span>Current Price:</span>
                <span>${holding.currentPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 mt-2">
                <span>Average Buy Price:</span>
                <span>${holding.averageBuyPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 mt-2">
                <span>Profit/Loss:</span>
                <span
                  className={
                    calculateProfitLoss(holding) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  ${calculateProfitLoss(holding)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 mt-2">
                <span>24h Change:</span>
                <span
                  className={
                    holding.priceChange24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {holding.priceChange24h}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
          <MdAdd className="mr-2" /> Add Holding
        </button>
      </div>
      {/* Holdings Table */}
      <div className="overflow-x-auto pt-3">
       <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-100">
            <tr>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">1h%</th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">24h%</th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">7d%</th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Holdings</th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg. Buy Price</th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Profit/Loss</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
  {holdings.map((holding) => (
    <tr key={holding.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{holding.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${holding.currentPrice.toLocaleString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.priceChange1h}%</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.priceChange24h}%</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.priceChange7d}%</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.quantity}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${holding.averageBuyPrice.toLocaleString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${calculateProfitLoss(holding)}
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default PortfolioPage;
