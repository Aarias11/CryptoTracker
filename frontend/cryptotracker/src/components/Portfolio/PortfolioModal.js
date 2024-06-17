import React, { useState, useContext } from 'react';
import CryptoMarketCoins from '../../API/CryptoMarketCoins.json';
import { doc, setDoc, collection } from 'firebase/firestore';
import ThemeContext from "../ThemeContext/ThemeContext";
import { db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

function PortfolioModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [portfolioName, setPortfolioName] = useState(''); // Allow user to set portfolio name
  const { theme } = useContext(ThemeContext);
  const [user] = useAuthState(getAuth());
  const [errorMessage, setErrorMessage] = useState('');

  const filteredCryptos = searchTerm.length > 1 ? CryptoMarketCoins.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleSelectCrypto = (crypto) => {
    setSelectedCrypto(crypto);
    setSearchTerm(crypto.name); // Clear the search term to display the selected crypto name
    setQuantity('');
    setAvgPrice('');
  };

  const handleSave = async () => {
    if (!selectedCrypto || !quantity || !avgPrice || !purchaseDate || !portfolioName) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    setErrorMessage('');
    const cryptoEntry = {
      cryptoId: selectedCrypto.id,
      name: selectedCrypto.name,
      symbol: selectedCrypto.symbol,
      quantity: Number(quantity),
      averagePrice: Number(avgPrice),
      purchaseDate: purchaseDate
    };

    try {
      // Creating a new portfolio
      const newPortfolioRef = doc(collection(db, 'users', user.uid, 'portfolios'));
      await setDoc(newPortfolioRef, {
        name: portfolioName,
        cryptos: [cryptoEntry]
      });
      onClose(); // Close the modal after operation
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className={`p-6 rounded-lg shadow-lg max-w-md w-full ${theme === "dark" ? "bg-[#031021]" : "bg-white"}`}>
        <h3 className="text-lg font-bold mb-4">Create New Portfolio</h3>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Portfolio Name"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            className={`search-input w-full p-2 ${theme === "dark" ? "bg-[#031021] text-primary-200" : ""}`}
          />
        </div>
     
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Cryptocurrency"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`search-input w-full p-2 ${theme === "dark" ? "bg-[#031021] text-primary-200" : ""}`}
          />
          {filteredCryptos.length > 0 && (
            <ul className="border rounded shadow-lg max-h-40 overflow-auto mt-2">
              {filteredCryptos.map((crypto) => (
                <li key={crypto.id} className="p-2 cursor-pointer flex justify-between items-center"
                    onClick={() => handleSelectCrypto(crypto)}>
                  <span className="font-semibold">{crypto.name} ({crypto.symbol})</span>
                  <img className="w-6 h-6 rounded-full" src={crypto.image} alt={crypto.name} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={`search-input w-full p-2 ${theme === "dark" ? "bg-[#031021] text-primary-200" : ""}`}
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Average Price"
            value={avgPrice}
            onChange={(e) => setAvgPrice(e.target.value)}
            className={`search-input w-full p-2 ${theme === "dark" ? "bg-[#031021] text-primary-200" : ""}`}
          />
        </div>
        <div className="mb-4">
          <input
            type="date"
            placeholder="Purchase Date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className={`search-input w-full p-2 ${theme === "dark" ? "bg-[#031021] text-primary-200" : ""}`}
          />
        </div>
        <div className="flex justify-between">
          <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default PortfolioModal;
