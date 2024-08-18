import React from "react";
import { Link } from "react-router-dom";

function WatchListEmptyState({ theme }) {
  return (
    <div className="w-full h-[500px] flex justify-center items-center ">
        <div className="flex justify-center">
        <div className="flex flex-col gap-5 ">
        <h2 className="headline-semibold-48 ">Start your crypto watchlist</h2>
        <p className="w-auto md:w-[600px] text-center body-16">
          Add cryptocurrencies to keep an eye on market trends, follow your
          favorites, and get real-time updates. Begin building your watchlist
          now and stay ahead in the crypto market!
        </p>
        <Link to={'/'}>
        <div className="flex justify-center mt-5">
        <button
          
          className={`w-[130px] h-[40px] label-14 rounded-lg transition duration-300 ease-in-out shadow-lg shadow-information-800 ${
            theme === "dark"
              ? "bg-information-600 text-primary-50"
              : "button-primary-medium-light text-primary-50"
          }`}
        >
          Add Crypto
        </button>
        </div>
        </Link>
        </div>
        </div>

      
    </div>
  );
}

export default WatchListEmptyState;
