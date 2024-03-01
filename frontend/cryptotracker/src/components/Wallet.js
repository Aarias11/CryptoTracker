import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

// Import logos
import metamasklogo from '../assets/metamasklogo.png'; // Update with your actual path
import cbwallet from '../assets/cbwallet.png'; // Update with your actual path

function Wallet({ onClose }) {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');

  const initializeCoinbaseWallet = () => {
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: "My Awesome App",
      infuraId: "YOUR_INFURA_PROJECT_ID", // Replace with your Infura Project ID
    });

    const ethereum = coinbaseWallet.makeWeb3Provider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID", 1); // 1 is the network ID for Ethereum Mainnet
    return new Web3(ethereum);
  };

  async function connectWallet(provider) {
    switch (provider) {
      case 'metamask':
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            getEthBalance(accounts[0]);
          } catch (error) {
            console.error("Error connecting to MetaMask", error);
          }
        } else {
          alert('MetaMask is not installed. Please install it to use this feature.');
        }
        break;
      case 'coinbase':
        const web3 = initializeCoinbaseWallet();
        try {
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
          getEthBalance(accounts[0], web3);
        } catch (error) {
          console.error("Error connecting to Coinbase Wallet", error);
        }
        break;
      default:
        console.error('Unsupported wallet provider');
    }
  }

  async function getEthBalance(account, web3Instance = null) {
    const web3 = web3Instance || new Web3(window.ethereum);
    try {
      const balanceWei = await web3.eth.getBalance(account);
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      setBalance(balanceEth);
    } catch (error) {
      console.error("Error getting balance", error);
    }
  }

  useEffect(() => {
    // You might want to call connectWallet here or allow users to trigger it manually
  }, []);

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center`}>
      <div className="w-[500px] h-[500px] bg-white dark:bg-[#131313] p-10 rounded-2xl shadow-xl flex flex-col items-center justify-center">
        <div className="flex justify-between items-center w-full mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{account ? 'Wallet Details' : 'Connect Wallet'}</h2>
          <button onClick={onClose} className="text-3xl font-bold text-gray-800 dark:text-white">&times;</button>
        </div>
        {!account ? (
          <>
            <button
              onClick={() => connectWallet('metamask')}
              className="w-full mb-4 px-6 py-3 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              <img src={metamasklogo} alt="MetaMask" className="w-6 h-6 mr-2"/>
              Connect MetaMask
            </button>
            <button
              onClick={() => connectWallet('coinbase')}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <img src={cbwallet} alt="Coinbase" className="w-6 h-6 mr-2 rounded-full"/>
              Connect Coinbase Wallet (Coming Soon)
            </button>
          </>
        ) : (
          <>
            <p>Connected Account: {account}</p>
            <p>Balance: {balance} ETH</p>
            <button
              onClick={() => { /* Disconnect logic here */ }}
              className="mt-8 w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Disconnect Wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Wallet;
