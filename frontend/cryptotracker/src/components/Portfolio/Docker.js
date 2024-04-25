import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import PortfolioModal from "./PortfolioModal";
import Avatar from 'react-avatar'; // Importing Avatar from react-avatar

function Docker({ onSelectPortfolio, theme }) {
  const [user] = useAuthState(getAuth());
  const [portfolios, setPortfolios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const portfoliosCollection = collection(
        db,
        "users",
        user.uid,
        "portfolios"
      );
      const unsubscribe = onSnapshot(portfoliosCollection, (querySnapshot) => {
        const portfoliosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          balance: doc
            .data()
            .cryptos.reduce(
              (acc, crypto) => acc + crypto.quantity * crypto.averagePrice,
              0
            ), // Calculate balance
        }));
        setPortfolios(portfoliosData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // const handleAddClick = () => {
  //   setIsModalOpen(true);
  //   onSelectPortfolio(null); // Ensure no portfolio is selected when adding new
  // };

  return (
    <div className="w-full h-auto xl:flex xl:justify-end">
      
      <div className="w-full xl:w-[95%] h-full pt-5 xl:pr-16 ml-2">
        {/* Header Container */}
        <div className="flex justify-between gap-4 items-center mb-4 ">
        <div className="w-[50%] flex flex-col gap-2 ">
        <h3 className="p-1 label-18 translate-y-[-10px]">My Portfolios</h3>
        {/* <button
            onClick={handleAddClick}
            className={`w-[130px] h-[40px] label-14 rounded-lg transition duration-300 ease-in-out shadow-lg shadow-primary-800 ${
              theme === "dark" ? "button-primary-medium-dark text-primary-50" : "button-primary-medium-light text-primary-50"
            }`} 
        >
            Add Portfolio
          </button> */}
        </div>
        <div>
        <p className="p-1 mr-3 label-18">Overview Total</p>
        <p className="px-1 title-semibold-20">
          {portfolios
            .reduce((acc, p) => acc + p.balance, 0)
            .toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
        </p>
        </div>
        </div>
        {/* Portfolios Container */}
        <div className="w-[100%] flex xl:flex  gap-3 overflow-x-scroll">
        {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className={`flex justify-center gap-3 flex-shrink-0 p-3  w-auto h-auto border rounded-xl shadow-lg shadow-black pl-2 cursor-pointer ${
                theme == "dark"
                  ? "border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b]"
                  : "bg-primary-50 shadow-primary-100 border-primary-200"
              }`}
              onClick={() => onSelectPortfolio(portfolio)}
            >
              <Avatar name={portfolio.name} size="40" round={true} />
              <div className="flex flex-col">
                <span className="label-semibold-14">{portfolio.name}</span>
                <span className="label-14">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(portfolio.balance)}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
      {/* <div className="w-full label-10">
        <div className="flex gap-3">
          <h3 className="p-1 label-18">My Portfolios</h3>
          <button
            onClick={handleAddClick}
            className="w-[130px] h-[40px] label-14 rounded-lg transition duration-300 ease-in-out button-primary-medium-dark shadow-lg shadow-primary-800">
            Add Portfolio
          </button>
        </div>
        <div className="flex justify-end gap-4 p-2 md:ml-4 md:p-4 md:px-5 w-full h-auto overflow-x-scroll border">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className={`flex justify-center gap-3 flex-shrink-0 p-3  w-[150px] h-auto border rounded-xl shadow-lg shadow-black pl-2  ${
                theme == "dark"
                  ? "border-primary-900 rounded-xl bg-gradient-to-r from-[#07172b]"
                  : "bg-primary-50 shadow-primary-100 border-primary-200"
              }`}
              onClick={() => onSelectPortfolio(portfolio)}
            >
              <Avatar name={portfolio.name} size="40" round={true} />
              <div className="flex flex-col">
                <span className="label-semibold-14">{portfolio.name}</span>
                <span className="label-14">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(portfolio.balance)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      {isModalOpen && (
        <PortfolioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          db={db}
          user={user}
        />
      )}
    </div>
  );
}

export default Docker;