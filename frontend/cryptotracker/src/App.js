import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom'
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
import { useTheme } from '../src/components/ThemeContext'
import Footer from './components/Footer';
import CommunityPage from './pages/CommunityPage';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CommunityProfile from './pages/CommunityProfile';
import Account from './pages/Account';

function App() {
  const [user, setUser] = useState(null);
  const { theme } = useTheme();
  const auth = getAuth();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => unsubscribe(); // Clean up subscription
  }, []);





  return (
    <div className={`App ${
      theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
    }`} >
      <Header setUser={setUser} user={user} />
     <TradingViewTicker key={theme} />
      <Navbar />
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
        <Route path='/community/profile/:id' element={<CommunityProfile user={user} />} />
        <Route path='/account' element={<Account user={user} />} />


      </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
