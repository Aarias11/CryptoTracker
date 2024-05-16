import React from "react";

const CryptoWallet = () => {
  return (
    <div className="w-full h-auto md:h-[300px]">
      <h2 className="headline-semibold-24 mt-20">Crypto Wallet</h2>
      <div className="w-full h-full flex justify-center">
        <div className="w-[70%] mt-5">
        <h3 className="headline-semibold-36">Connect your crypto wallet</h3>
      <p className="mt-4 w-auto lg:w-[570px] ">It looks like you don't have a wallet connect yet. Add an external crypto wallet to your account to easily manage your assets, track investments, and streamline transactions. Connect your wallet now to enjoy a seamless crypto experience!</p>
      {/* Add your crypto wallet management form here */}
      <div className="w-[70%] flex justify-center">
      <button className="w-[130px] h-[40px] bg-information-700 label-14 rounded-lg transition duration-300 ease-in-out shadow-lg shadow-information-800 mt-5">Connect Wallet</button>
      </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoWallet;
