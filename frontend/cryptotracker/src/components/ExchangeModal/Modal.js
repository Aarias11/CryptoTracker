import React, { useEffect, useState } from 'react';

const Modal = ({ exchange, onClose, theme }) => {
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
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50`} onClick={onClose}>
      <div className={`w-auto lg:w-[700px] h-auto relative top-36 mx-auto p-5 border shadow-lg rounded-md  pt-14  ${theme === "dark" ? "bg-[#031021] border-primary-900 shadow-lg shadow-black" : "bg-[#F5F9FE] border-primary-200 shadow-md shadow-primary-300"}`} onClick={(e) => e.stopPropagation()}>
        <div className='flex gap-4 items-center'>
        <h3 className="headline-28">{exchange.name} </h3>
        <img className='w-10 h-10 rounded-full' src={exchange.image} />
        </div>
        <div>
        <p className='body-semibold-16'>BTC Trade Volume: {exchange.trade_volume_24h_btc}</p>
        </div>
        <div className='pt-10'>
        <p className='body-semibold-16'>Rank: {exchange.trust_score_rank}</p>
        <p className='body-semibold-16'>Incentives: {exchange.has_trading_incentive ? 'Yes' : 'No'}</p>
        <p className='body-semibold-16'>Country: {exchange.country}</p>
        <p className='body-semibold-16'>Description: {exchange.description}</p>
        </div>
        <button className="absolute top-0 right-0 p-4" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
