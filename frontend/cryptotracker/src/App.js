import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer'; // Import Buffer from the buffer package
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';
import Header from './components/Header';
import HeatMap from './pages/HeatMap';
import WatchList from './pages/WatchList';
import Portfolio from './pages/Portfolio';
import CryptoPage from './pages/CryptoPage';
import Exchanges from './pages/Exchanges';
import TradingViewTicker from './components/TradingViewTicker';
import { useTheme } from './components/ThemeContext';
import Footer from './components/Footer';
import CommunityPage from './pages/CommunityPage';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CommunityProfile from './pages/CommunityProfile';
import Account from './pages/Account';
import useScrollToTop from './components/useScrollToTop';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Web3 from 'web3';
import CommunityUserProfile from './pages/CommunityUserProfile';
import '@typehaus/metropolis';

window.Buffer = Buffer; // Assign Buffer to window to make it globally available


// Coinbase Wallet SDK initialization
const APP_NAME = 'My Awesome App';
const APP_LOGO_URL = 'https://example.com/logo.png';
const APP_SUPPORTED_CHAIN_IDS = [1, 137];

const coinbaseWallet = new CoinbaseWalletSDK({
  appName: APP_NAME,
  appLogoUrl: APP_LOGO_URL,
  supportedChainIds: APP_SUPPORTED_CHAIN_IDS,
});

const ethereum = coinbaseWallet.makeWeb3Provider();
export const web3 = new Web3(ethereum);

function App() {
  const [user, setUser] = useState(null);
  const { theme } = useTheme();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, [auth]);

  // Function to disconnect from Coinbase Wallet
  const disconnectCoinbaseWallet = () => {
    coinbaseWallet.disconnect();
    console.log('Disconnected from Coinbase Wallet');
    // Perform any additional cleanup or state updates as needed
  };

  return (
    <div className={`App ${
      theme === "dark" ? "bg-[#031021] text-primary-50" : "bg-[#F5F9FE] text-primary-800"
    }`}>
      <Header setUser={setUser} user={user} />
      <Navbar setUser={setUser} user={user} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/heatmap' element={<HeatMap />} />
        <Route path='/watchlist' element={<WatchList />} />
        <Route path='/portfolio' element={<Portfolio />} />
        <Route path='/cryptopage/:symbol' element={<CryptoPage user={user} />} />
        <Route path='/exchanges' element={<Exchanges />} />
        <Route path='/community' element={<CommunityPage user={user} />} />
        <Route path='/community/profile/:displayname' element={<CommunityProfile user={user} />} />
        <Route path='/account' element={<Account user={user} />} />
        <Route path="/community/userprofile/:id" element={<CommunityUserProfile />} />

      </Routes>
    </div>
  );
}

export default App;
