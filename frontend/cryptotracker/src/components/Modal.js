// src/components/Modal.js
import React, { useEffect, useState } from 'react';

const Modal = ({ exchange, onClose }) => {
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchDescription = async () => {
      if (!exchange) return;

      try {
        // Assuming the API URL and endpoint for fetching exchange details
        const response = await fetch(`https://api.example.com/exchanges/${exchange.id}/description`);
        const data = await response.json();
        setDescription(data.description); // Assuming 'description' is the key in the response
      } catch (error) {
        console.error("Failed to fetch exchange description:", error);
        setDescription('Description not available.'); // Fallback text
      }
    };

    fetchDescription();
  }, [exchange]);

  if (!exchange) return null;

  return (
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full`} onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-medium">{exchange.name}</h3>
        <p>Rank: {exchange.trust_score_rank}</p>
        <p>BTC Trade Volume: {exchange.trade_volume_24h_btc}</p>
        <p>Incentives: {exchange.has_trading_incentive ? 'Yes' : 'No'}</p>
        <p>Country: {exchange.country}</p>
        <p>Description: {exchange.description}</p>
        <button className="absolute top-0 right-0 p-4" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
