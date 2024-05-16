import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import metamasklogo from '../../assets/metamasklogo.png';
import cbwallet from '../../assets/cbwallet.png';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import ThemeContext from "../ThemeContext/ThemeContext";
import axios from 'axios';

// Define your app's name and logo URL
const appName = "Your DApp Name";
const appLogoUrl = "https://path.to/your/logo.png";

function Wallet({ onClose }) {
  const [account, setAccount] = useState('');
  const [ethBalance, setEthBalance] = useState('');
  const [tokenBalances, setTokenBalances] = useState([]);
  const [activity, setActivity] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const { theme } = useContext(ThemeContext); // Using ThemeContext



  // Initialize Coinbase Wallet SDK
  const coinbaseWallet = new CoinbaseWalletSDK({ appName, appLogoUrl });
  const ethereum = coinbaseWallet.makeWeb3Provider();
  const web3 = new Web3(ethereum);

  // Define token contracts you want to display
  const tokens = [
    { symbol: 'ETH', address: 'ETH' }, // Special case for ETH
    { symbol: 'MATIC', address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0' }, // Polygon contract address
    { symbol: 'GALA', address: '0x15D4c048F83BD7e37d49eA4C83a07267Ec4203Da' }, // Gala contract address
    // Add more tokens here
  ];

  const getTokenBalance = async (tokenAddress, account) => {
    try {
      const response = await axios.get(`https://api.infura.io/v1/jsonrpc/mainnet/getTokenBalance/${tokenAddress}?address=${account}`);
      return response.data.balance;
    } catch (error) {
      console.error("Error getting token balance:", error);
      return 0; // Return 0 balance in case of error
    }
  };

  useEffect(() => {
    if (account) {
      fetchBalances();
      fetchActivity();
      fetchTransactions();
    }
  }, [account]);

  const fetchBalances = async () => {
    // Fetch ETH balance
    const ethBalanceWei = await web3.eth.getBalance(account);
    const ethBalance = web3.utils.fromWei(ethBalanceWei, 'ether');
    setEthBalance(ethBalance);

    // Fetch token balances
    const updatedTokenBalances = await Promise.all(tokens.map(async (token) => {
      if (token.address === 'ETH') {
        return { ...token, balance: ethBalance };
      } else {
        const tokenContract = new web3.eth.Contract([
          // ERC-20 Token Standard ABI for balanceOf method
          {
            constant: true,
            inputs: [{ name: "_owner", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "balance", type: "uint256" }],
            type: "function",
          },
        ], token.address);
        const balance = await tokenContract.methods.balanceOf(account).call();
        const formattedBalance = web3.utils.fromWei(balance, 'ether');
        return { ...token, balance: formattedBalance };
      }
    }));
    setTokenBalances(updatedTokenBalances);
  };

  const fetchActivity = async () => {
    // Fetch activity data
    // Replace this with your logic to fetch activity
    const activityData = [];
    setActivity(activityData);
  };

  const fetchTransactions = async () => {
    // Fetch transaction data
    // Replace this with your logic to fetch transactions
    const transactionData = [];
    setTransactions(transactionData);
  };

  const getEthBalance = async (account) => {
    try {
      const balanceWei = await web3.eth.getBalance(account);
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      setEthBalance(balanceEth);
    } catch (error) {
      console.error("Error getting ETH balance:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed.');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts.length) throw new Error('No accounts found.');
      setAccount(accounts[0]);
      await getEthBalance(accounts[0]);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error.message || error);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setEthBalance('');
    setTokenBalances([]);
    setActivity([]);
    setTransactions([]);
    // Use disconnect method if using Coinbase Wallet
    coinbaseWallet.disconnect();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
      <div className={`w-[450px] h-auto  rounded-2xl shadow-md flex flex-col justify-between overflow-hidden border ${
                        theme === "dark"
                          ? "border-primary-900 rounded-xl bg-[#07172b]"
                          : "bg-primary-200 shadow-primary-100 border-primary-400"
                      }`} >
        <div className="p-6">
          <div className="text-right items-center mb-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {!account ? (
            <div className="h-[300px] flex flex-col items-center ">
              <h2 className="text-xl font-bold  pb-5 ">{account ? 'Wallet Details' : 'Connect Wallet'}</h2>
              <button onClick={() => connectWallet('MetaMask')} className="w-[300px] flex items-center justify-center  mb-4 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300">
                <img className="w-6 h-6 mr-2" src={metamasklogo} alt="MetaMask" />
                Connect with MetaMask
              </button>
              <button onClick={() => connectWallet('Coinbase Wallet')} className="w-[300px] flex items-center justify-center mb-4 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300">
                <img className="w-6 h-6 mr-2 rounded-full" src={cbwallet} alt="Coinbase Wallet" />
                Connect with Coinbase Wallet
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-2">Connected Account:</p>
              <p className="mb-4 text-base font-semibold">{account}</p>
              <p className="mb-2">ETH Balance:</p>
              <p className="mb-4 text-lg font-semibold">{ethBalance} ETH</p>
              <p className="mb-2">Token Balances:</p>
              {tokenBalances.map((token) => (
                <p key={token.symbol} className="text-lg font-semibold">{token.symbol}: {token.balance}</p>
              ))}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 pb-4 dark:text-white">Activity</h2>
          <ul>
            {activity.map((activityItem, index) => (
              <li key={index}>{activityItem}</li>
            ))}
          </ul>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 pb-4 dark:text-white">Suggested Transactions to Approve</h2>
          <ul>
            {transactions.map((transaction, index) => (
              <li key={index}>{transaction}</li>
            ))}
          </ul>
        </div>
            </div>
          )}
        </div>
        {account && (
          <button onClick={disconnectWallet} className="bg-red-500 text-white py-3 rounded-b-2xl hover:bg-red-600 transition duration-300">
            Disconnect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default Wallet;
