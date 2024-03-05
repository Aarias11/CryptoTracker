import React, { useState, useMemo, useContext } from 'react';
import CryptoExchanges from '../CryptoExchanges.json';
import Carousel from '../components/Carousel';
import Modal from '../components/Modal';
import ThemeContext from "../components/ThemeContext";


function ExchangesPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('trust_score_rank');
  const [sortOrder, setSortOrder] = useState('asc');
  const { theme } = useContext(ThemeContext); // useContext call corrected for use inside the component

  const openModal = (exchange) => {
    setSelectedExchange(exchange);
    setShowDetails(true);
  };

  const sortedAndFilteredExchanges = useMemo(() => {
    return CryptoExchanges
      .filter(exchange => exchange.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortKey && sortOrder === 'asc') {
          return a[sortKey] > b[sortKey] ? 1 : -1;
        } else if (sortKey) {
          return a[sortKey] < b[sortKey] ? 1 : -1;
        }
        return 0;
      });
  }, [searchTerm, sortKey, sortOrder]);

  const handleSort = (key) => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setSortKey(key);
  };

  return (
    <div className={`min-h-screen  p-8 ${
      theme === "dark" ? "bg-[#16171a] text-white" : "bg-white text-gray-900"
    }`}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-zinc-300  mb-6">
          Cryptocurrency Exchanges
        </h1>
        <p className="text-md text-zinc-200 mb-4">
          Cryptocurrency exchanges are pivotal platforms where traders and investors can buy, sell, or exchange cryptocurrencies. These platforms vary greatly in terms of features, security, and ease of use, directly impacting the trading experience and outcomes.
        </p>
        <Carousel exchanges={CryptoExchanges.filter(exchange => exchange.trust_score_rank <= 5)} />
        <div className={`overflow-x-auto  ${
      theme === "dark" ? "bg-[#1d1e22]  text-white" : "bg-white text-gray-900"
    }`}>
        <table className="min-w-full divide-y divide-gray-200 ">

            <thead>
              <tr>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" onClick={() => handleSort('trust_score_rank')}>
                  Rank
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Image
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" onClick={() => handleSort('name')}>
                  Name
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" onClick={() => handleSort('trade_volume_24h_btc')}>
                  BTC Trade Volume
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Incentives
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAndFilteredExchanges.map((exchange) => (
                <tr key={exchange.id} onClick={() => openModal(exchange)} className="border-b dark:border-gray-700 cursor-pointer">
                  <td class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ">{exchange.trust_score_rank}</td>
                  <td class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ">
                    <img src={exchange.image} alt={exchange.name} className="w-8 h-8 rounded-full" />
                  </td>
                  <td class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ">{exchange.name}</td>
                  <td class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ">{exchange.trade_volume_24h_btc.toLocaleString()} BTC</td>
                  <td class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ">{exchange.has_trading_incentive ? 'Yes' : 'No'}</td>
                </tr>
              ))}
              {sortedAndFilteredExchanges.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4">No exchanges found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showDetails && <Modal exchange={selectedExchange} onClose={() => setShowDetails(false)} />}
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Refresh Data
        </button>
      </div>
    </div>
  );
}

export default ExchangesPage;
