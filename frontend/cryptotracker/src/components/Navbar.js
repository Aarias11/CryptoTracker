import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ledgerlook from "../assets/ledgerlook.png";
import { GoStarFill } from "react-icons/go";
import { GiPieChart } from "react-icons/gi";
import { RxMagnifyingGlass } from "react-icons/rx";
import { IoTrendingUpSharp, IoTrendingDownSharp } from "react-icons/io5";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import { VscClose } from "react-icons/vsc";
import ThemeContext from "../components/ThemeContext";
import TrendingCoins from "../TrendingCoins.json";
import CryptoMarketCoins from "../CryptoMarketCoins.json";
import CryptoExchanges from "../CryptoExchanges.json";
import Wallet from "../components/Wallet";
import { IconArrowLeft, IconAB2 } from '@tabler/icons-react';
import Auth from "./Auth";

function Navbar() {
  const [crypto, setCrypto] = useState(TrendingCoins);
  const [coins, setCoins] = useState(CryptoMarketCoins);
  const [exchanges, setExchanges] = useState(CryptoExchanges);
  const { theme, toggleTheme } = useContext(ThemeContext); // Using ThemeContext
  const [searchExpanded, setSearchExpanded] = useState(false); // State to manage the search component's visibility
  const searchComponentRef = useRef(null);
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [combinedResults, setCombinedResults] = useState([]);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const toggleWalletModal = () => setIsWalletModalOpen(!isWalletModalOpen);

  // Close the search component when clicking on the close icon
  const handleClose = () => {
    setSearchExpanded(false);
  };

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchComponentRef]);

  // Fetch search results and combine with local market data
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${searchQuery}`
        );
        const data = await response.json();
        const searchResultsWithMarketData = data.coins.map((coin) => {
          const marketData = CryptoMarketCoins.find(
            (marketCoin) => marketCoin.id === coin.id
          );
          return {
            ...coin,
            current_price: marketData?.current_price,
            price_change_percentage_24h:
              marketData?.price_change_percentage_24h,
          };
        });
        setSearchResults(searchResultsWithMarketData);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div
      className={`h-[70px] flex items-center  justify-between border-b border-zinc-800 text-sm px-4 md:px-[32px] lg:px-[55px] ${
        theme === "dark" ? "  " : ""
      }`}
    >
      <div className=" flex items-center gap-10 justify-around">
      <Link to='/'>
      <svg width="150" height="80" viewBox="0 0 1560 288" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M261.214 241.703C279.396 231.025 294.112 215.163 303.712 196.14C307.439 188.756 303.362 180.123 295.638 177.205C287.667 174.193 278.898 178.449 274.607 185.827C267.741 197.634 258.028 207.497 246.319 214.374C242.554 216.585 238.64 218.454 234.62 219.972V217.912C234.62 209.466 227.792 202.619 219.369 202.619C210.945 202.619 204.117 209.466 204.117 217.912V224.74C200.461 224.55 196.804 224.091 193.174 223.358C192.285 223.179 191.399 222.983 190.518 222.772C181.391 233.589 175.616 238.817 164.387 246.69C171.716 250.049 179.431 252.573 187.403 254.181C192.946 255.3 198.534 255.959 204.117 256.169V272.708C204.117 281.154 210.945 288 219.369 288C227.792 288 234.62 281.154 234.62 272.708V252.788C243.853 250.353 252.801 246.644 261.214 241.703Z" fill="white"/>
<path d="M194.85 32.7941C169.319 36.0482 145.744 48.6519 128.366 68.3381C113.502 85.176 104.006 106.25 101.008 128.693H79.3202C70.8969 128.693 64.0685 135.54 64.0685 143.985C64.0685 152.431 70.8969 159.277 79.3202 159.277H100.977C103.435 177.955 110.404 195.779 121.339 211.037C132.63 206.716 138.309 203.104 147.267 194.526L147.142 194.363C135.613 179.317 129.634 160.495 130.28 141.282C130.926 122.069 138.156 103.725 150.668 89.5514C163.18 75.3773 180.154 66.3027 198.537 63.9597C200.396 63.7228 202.257 63.5562 204.117 63.4593V70.0885C204.117 78.5341 210.945 85.3805 219.369 85.3805C227.792 85.3805 234.62 78.5341 234.62 70.0885V68.2274C240.328 70.3838 245.812 73.2414 250.948 76.7703C262.196 84.4986 271.241 95.0766 277.298 107.394C281.049 115.023 289.46 119.858 297.593 117.437C305.517 115.079 310.192 106.736 306.971 99.103C298.672 79.4369 285.06 62.5524 267.644 50.5865C257.454 43.5859 246.281 38.4871 234.62 35.4118V15.292C234.62 6.84648 227.792 0 219.369 0C210.945 0 204.117 6.84648 204.117 15.292V32.0311C201.03 32.1469 197.938 32.4006 194.85 32.7941Z" fill="white"/>
<path d="M46.7859 241.703C28.6043 231.025 13.888 215.163 4.2876 196.14C0.560835 188.756 4.63778 180.123 12.3617 177.205C20.3331 174.193 29.1016 178.449 33.3925 185.827C40.2589 197.634 49.972 207.497 61.6813 214.374C64.9941 216.32 68.4221 218 71.9357 219.41V217.912C71.9357 209.466 78.7641 202.619 87.1874 202.619C95.6107 202.619 102.439 209.466 102.439 217.912V224.802C106.576 224.666 110.718 224.187 114.826 223.358C115.72 223.178 116.61 222.981 117.495 222.769C134.601 218.667 149.896 208.668 160.858 194.363C172.387 179.317 178.366 160.495 177.72 141.282C177.135 123.885 171.152 107.201 160.737 93.6797C169.397 85.2371 174.982 81.634 186.685 77.1972C197.536 92.3482 204.528 110.105 207.008 128.808H228.676C237.099 128.808 243.928 135.654 243.928 144.1C243.928 152.545 237.099 159.392 228.676 159.392H207.008C204.379 179.213 196.67 198.069 184.531 213.91C173.57 228.213 159.49 239.417 143.599 246.696C136.274 250.052 128.564 252.574 120.597 254.181C114.576 255.396 108.502 256.07 102.439 256.213V272.708C102.439 281.154 95.6107 288 87.1874 288C78.7641 288 71.9357 281.154 71.9357 272.708V252.396C63.2141 249.962 54.7599 246.386 46.7859 241.703Z" fill="white"/>
<path d="M1.02884 99.103C9.32799 79.4369 22.9404 62.5524 40.3565 50.5865C50.1245 43.8753 60.797 38.912 71.9357 35.8036V15.292C71.9357 6.84648 78.7641 0 87.1874 0C95.6107 0 102.439 6.84648 102.439 15.292V31.987C106.006 32.0712 109.581 32.3393 113.15 32.7941C123.746 34.1447 134.006 37.106 143.626 41.5158C132.221 49.6447 126.557 54.8984 117.524 65.4374C114.875 64.8009 112.184 64.3066 109.463 63.9597C107.123 63.6614 104.779 63.4748 102.439 63.398V70.0885C102.439 78.5341 95.6107 85.3805 87.1874 85.3805C78.7641 85.3805 71.9357 78.5341 71.9357 70.0885V68.7897C66.7463 70.8721 61.7537 73.54 57.0521 76.7703C45.8037 84.4986 36.759 95.0766 30.7025 107.394C26.9511 115.023 18.5401 119.858 10.4074 117.437C2.48342 115.079 -2.19212 106.736 1.02884 99.103Z" fill="white"/>
<path d="M1531.03 64.2573H1560V229.169H1531.03V210.059C1521.54 223.743 1506.58 232 1488.54 232C1456.01 232 1432.03 205.576 1432.03 168.064C1432.03 130.788 1456.01 104.365 1488.54 104.365C1506.58 104.365 1521.54 112.622 1531.03 126.306V64.2573ZM1496.37 207.464C1516.55 207.464 1531.03 190.949 1531.03 168.064C1531.03 145.18 1516.55 128.901 1496.37 128.901C1475.48 128.901 1460.76 145.18 1460.76 168.064C1460.76 190.949 1475.48 207.464 1496.37 207.464Z" fill="white"/>
<path d="M1284.67 229.169L1243.12 107.196H1272.09L1297.73 190.477L1325.03 107.196H1349.25L1376.55 190.477L1402.19 107.196H1431.16L1389.61 229.169H1363.26L1337.14 145.651L1311.02 229.169H1284.67Z" fill="white"/>
<path d="M1177.35 232C1141.02 232 1111.34 203.217 1111.34 168.064C1111.34 132.912 1141.02 104.365 1177.35 104.365C1213.44 104.365 1242.88 132.912 1242.88 168.064C1242.88 203.217 1213.44 232 1177.35 232ZM1177.35 207.464C1197.77 207.464 1214.39 189.769 1214.39 168.064C1214.39 146.359 1197.77 128.901 1177.35 128.901C1156.69 128.901 1139.84 146.359 1139.84 168.064C1139.84 189.769 1156.69 207.464 1177.35 207.464Z" fill="white"/>
<path d="M1065.69 130.316C1073.53 114.509 1089.67 104.365 1109.62 104.365V128.901C1083.26 128.901 1065.69 144.472 1065.69 167.592V229.169H1036.73V107.196H1065.69V130.316Z" fill="white"/>
<path d="M958.31 232C912.012 232 872.6 193.544 872.6 148.011C872.6 102.477 912.012 64.2573 958.31 64.2573C982.289 64.2573 1004.37 74.4021 1020.04 90.445L998.909 110.027C988.7 98.4665 973.98 91.1528 958.31 91.1528C928.157 91.1528 902.753 117.105 902.753 148.011C902.753 179.153 928.157 205.105 958.31 205.105C974.217 205.105 988.7 197.791 998.909 186.231L1020.04 205.576C1004.37 221.855 982.289 232 958.31 232Z" fill="white"/>
<path d="M810.372 104.365C837.438 104.365 856.194 123.71 856.194 151.55V229.169H827.941V157.212C827.941 140.461 817.257 128.901 802.062 128.901C785.443 128.901 772.384 140.461 772.384 155.324V229.169H743.419V107.196H772.384V123.239C779.744 111.914 793.99 104.365 810.372 104.365Z" fill="white"/>
<path d="M706.772 88.7936C697.513 88.7936 690.153 81.008 690.153 72.2788C690.153 63.5496 697.513 56 706.772 56C715.794 56 722.917 63.5496 722.917 72.2788C722.917 81.008 715.794 88.7936 706.772 88.7936ZM692.29 229.169V107.196H721.255V229.169H692.29Z" fill="white"/>
<path d="M611.245 232C574.92 232 545.242 203.217 545.242 168.064C545.242 132.912 574.92 104.365 611.245 104.365C647.333 104.365 676.774 132.912 676.774 168.064C676.774 203.217 647.333 232 611.245 232ZM611.245 207.464C631.664 207.464 648.283 189.769 648.283 168.064C648.283 146.359 631.664 128.901 611.245 128.901C590.59 128.901 573.733 146.359 573.733 168.064C573.733 189.769 590.59 207.464 611.245 207.464Z" fill="white"/>
<path d="M473.709 232C427.412 232 388 193.544 388 148.011C388 102.477 427.412 64.2573 473.709 64.2573C497.689 64.2573 519.769 74.4021 535.439 90.445L514.308 110.027C504.099 98.4665 489.379 91.1528 473.709 91.1528C443.557 91.1528 418.153 117.105 418.153 148.011C418.153 179.153 443.557 205.105 473.709 205.105C489.617 205.105 504.099 197.791 514.308 186.231L535.439 205.576C519.769 221.855 497.689 232 473.709 232Z" fill="white"/>
</svg>
</Link>
      <ul
        className={`hidden lg:flex sm:gap-4 h-auto md:w-auto md:gap-8 font-semibold  label-14 ${
          theme === "dark" ? " " : " "
        }`}
      >
        <li className="text-xs md:text-sm">
          <Link to="/">Cryptocurrencies </Link>
        </li>
        <li className="text-xs md:text-sm">
          <Link to="/exchanges">Exchanges</Link>
        </li>
        <li className="text-xs md:text-sm">
          <Link to="/heatmap">HeatMap</Link>
        </li>
        <li className="text-xs md:text-sm">
          <Link to="/community">Community</Link>
        </li>
        <li className="text-xs md:text-sm cursor-pointer" onClick={toggleWalletModal}>Wallet</li>

      </ul>
</div>
      {isWalletModalOpen && <Wallet onClose={() => setIsWalletModalOpen(false)} />}

      

      <Auth />
    </div>
  );
}

export default Navbar;
