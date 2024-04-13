import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import PortfolioModal from './PortfolioModal';

function Docker({ onSelectPortfolio }) {
  const [user] = useAuthState(getAuth());
  const [portfolios, setPortfolios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const portfoliosCollection = collection(db, "users", user.uid, "portfolios");
      const unsubscribe = onSnapshot(portfoliosCollection, (querySnapshot) => {
        const portfoliosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          balance: doc.data().cryptos.reduce((acc, crypto) => acc + (crypto.quantity * crypto.averagePrice), 0) // Calculate balance
        }));
        setPortfolios(portfoliosData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleAddClick = () => {
    setIsModalOpen(true);
    onSelectPortfolio(null); // Ensure no portfolio is selected when adding new
  };

  return (
    <div className="w-full xl:w-[50%] h-[54px] border rounded-full label-12 p-1 px-6 flex gap-4 overflow-x-scroll flex-shrink-0 ">
      {/* Overview Container */}
      <div className="w-auto">
        <p className="p-1">Overview Total</p>
        {/* Sum of all portfolios' balances */}
        <p className="px-1">${portfolios.reduce((acc, p) => acc + p.balance, 0).toFixed(2)}</p>
      </div>
      {/* Portfolio Container */}
      <div className="w-[350px] label-10">
        <h3 className="p-1 label-10">My Portfolios</h3>
        <div className="px-1 flex gap-3 w-full overflow-x-scroll">
          {portfolios.map(portfolio => (
            <div key={portfolio.id} className="flex items-center gap-2 cursor-pointer"
            onClick={() => onSelectPortfolio(portfolio)}>
              <img className="w-[20px] h-[20px] border rounded-full" />
              <div className='flex flex-col'>
                <span>{portfolio.name}</span>
                {/* Display the calculated balance */}
                <span>${portfolio.balance.toFixed(2)}</span>
              </div>
            </div>
          ))}
          <button onClick={handleAddClick} className="bg-blue-500 text-white px-4 py-1 rounded">Add Portfolio</button>
        </div>
      </div>

      {/* Other Content */}
      <div className="w-[150px] label-10">
        <h3 className="p-1">Community</h3>
        <div className="w-full flex px-1 gap-4">
          <p>Track Portfolios +</p>
          <p>Start Question Thread</p>
        </div>
      </div>
      {isModalOpen && <PortfolioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} db={db} user={user} />}
    </div>
  );
}

export default Docker;
