import React, { useState, useContext } from "react";
import CryptoMarketCoins from "../../API/CryptoMarketCoins.json";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ThemeContext from "../ThemeContext/ThemeContext";
import { db } from "../../firebase"; // Ensure this is the correct path to your Firebase config
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

function AddCryptoModal({ isOpen, onClose, portfolioId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const { theme } = useContext(ThemeContext);
  const [user] = useAuthState(getAuth());

  const filteredCryptos = CryptoMarketCoins.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCrypto = (crypto) => {
    setSelectedCrypto(crypto);
    setSearchTerm(crypto.name); // Clear the search term
    setQuantity("");
    setAvgPrice("");
  };

  const handleSave = async () => {
    if (!selectedCrypto || !quantity || !avgPrice || !purchaseDate || !portfolioId) {
      console.error("All fields must be filled, and a portfolio must be selected.");
      return;
    }

    const newQuantity = Number(quantity);
    const newAvgPrice = Number(avgPrice);
    const newCryptoEntry = {
      cryptoId: selectedCrypto.id,
      name: selectedCrypto.name,
      symbol: selectedCrypto.symbol,
      quantity: newQuantity,
      averagePrice: newAvgPrice,
      purchaseDate: purchaseDate,
    };

    try {
      const portfolioRef = doc(db, 'users', user.uid, 'portfolios', portfolioId);
      const docSnap = await getDoc(portfolioRef);

      if (docSnap.exists()) {
        let cryptos = docSnap.data().cryptos || [];
        const index = cryptos.findIndex(c => c.cryptoId === selectedCrypto.id);

        if (index !== -1) {
          // Calculate new quantity and new average price
          const existingCrypto = cryptos[index];
          const totalQuantity = existingCrypto.quantity + newQuantity;
          const totalCost = existingCrypto.quantity * existingCrypto.averagePrice + newQuantity * newAvgPrice;
          const updatedAvgPrice = totalCost / totalQuantity;

          // Update existing crypto data
          cryptos[index] = {
            ...existingCrypto,
            quantity: totalQuantity,
            averagePrice: updatedAvgPrice
          };
        } else {
          // Add new crypto data
          cryptos.push(newCryptoEntry);
        }

        // Update Firestore
        await updateDoc(portfolioRef, { cryptos });
        onClose(); // Close the modal after operation
      } else {
        console.error("No portfolio found with the provided ID.");
      }
    } catch (error) {
      console.error("Error updating portfolio in Firestore:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div
        className={`p-6 rounded-lg shadow-lg max-w-md w-full z-50 ${
          theme === "dark" ? "bg-[#031021]" : "bg-white"
        }`}
      >
        <h3 className="text-lg font-bold mb-4">Add Crypto to Portfolio</h3>
        <input
          type="text"
          placeholder="Search Cryptocurrency"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`search-input w-full p-2 ${
            theme === "dark" ? "bg-[#031021] text-primary-200" : ""
          }`}
        />
        {filteredCryptos.length > 0 && searchTerm.length >= 3 && (
          <ul className="border rounded shadow-lg max-h-40 overflow-auto mt-2">
            {filteredCryptos.map((crypto) => (
              <li
                key={crypto.id}
                className="p-2 cursor-pointer flex justify-between items-center"
                onClick={() => handleSelectCrypto(crypto)}
              >
                <span className="font-semibold">
                  {crypto.name} ({crypto.symbol})
                </span>
                <img
                  className="w-6 h-6 rounded-full"
                  src={crypto.image}
                  alt={crypto.name}
                />
              </li>
            ))}
          </ul>
        )}

        <div className="mb-4">
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={`search-input w-full p-2 ${
              theme === "dark" ? "bg-[#031021] text-primary-200" : ""
            }`}
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Average Price"
            value={avgPrice}
            onChange={(e) => setAvgPrice(e.target.value)}
            className={`search-input w-full p-2 ${
              theme === "dark" ? "bg-[#031021] text-primary-200" : ""
            }`}
          />
        </div>
        <div className="mb-4">
          <input
            type="date"
            placeholder="Purchase Date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className={`search-input w-full p-2 ${
              theme === "dark" ? "bg-[#031021] text-primary-200" : ""
            }`}
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCryptoModal;
