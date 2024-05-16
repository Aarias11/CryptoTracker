import React, { useState, useEffect, useContext } from "react";
import { MdOutlineStar } from "react-icons/md";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";
import ThemeContext from "../components/ThemeContext/ThemeContext"; // Import ThemeContext
import WatchListEmptyState from "../components/WatchListEmptyState/WatchListEmptyState";

const Watchlist = () => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const auth = getAuth();
  const { theme } = useContext(ThemeContext); // Use ThemeContext

  // Fetching Favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(collection(db, "users", user.uid, "favorites"));
      const fetchedFavorites = [];
      querySnapshot.forEach((doc) => {
        fetchedFavorites.push({ id: doc.id, ...doc.data() });
      });
      setFavorites(fetchedFavorites);
      setFilteredFavorites(fetchedFavorites);
    };

    fetchFavorites();
  }, []);

  // Fetching Filtered Search Favorites
  useEffect(() => {
    const filtered = favorites.filter(crypto => crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredFavorites(filtered);
  }, [searchTerm, favorites]);

  const toggleFavorite = async (cryptoId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "favorites", cryptoId));
      setFavorites(favorites.filter((favorite) => favorite.id !== cryptoId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  // Conditional styles based on theme
  const tableTheme = theme === "dark" ? "" : "";
  const headerBgTheme = theme === "dark" ? "" : "";
  const bodyBgTheme = theme === "dark" ? "" : "";


  return (
    <div className={`w-full h-screen mx-auto overflow-x-auto  ${bodyBgTheme}`}>
      <h2 className="headline-semibold-28 ml-6 p-6">YOUR WATCHLIST</h2>
      
      <div>
        {filteredFavorites.length > 0 ? (
          <div className="px-6 ml-6 ">
        <input
          type="text"
          placeholder="Search Your Favorites"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`search-input w-[300px] h-full border border-primary-200 rounded-xl translate-y-[60px] font-semibold text-sm p-3 relative px-[40px] ${
            theme === "dark"
              ? "bg-[#031021] text-primary-200"
              : ""
          }`}
        />
        <div
        className={`w-full h-full flex flex-col justify-center overflow-x-scroll lg:p-[50px] mt-10  ${
          theme === "dark" ? " " : ""
        }`}
      >
      <table className={`min-w-full divide-y divide-zinc-700 `}>
        <thead className={`${headerBgTheme}`}>
          {/* TABLE BODY */}
          {/* ----------------------- */}
          <tr>
            {/* RANK */}
            <th className={`w-[100px] h-[80px] px-5 py-3 text-left label-semibold-12 uppercase tracking-wider sticky left-0 items-center flex gap-2 ${theme === "dark" ? " bg-[#07172b]" : " bg-zinc-300"}`}>
              # Rank
            </th>
            {/* NAME */}
            <th className={`px-14  py-3   text-left text-xs font-semibold  uppercase tracking-wider bodyBgTheme sticky left-0  ${theme === "dark" ? " bg-[#07172b]" : " bg-zinc-300"}`}>
              Name
            </th>
            {/* Price */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Price
            </th>
            {/* Low 24H */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Low 24H
            </th>
            {/* High 24H */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              High 24H
            </th>
            {/* 24H % */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              24H %
            </th>
            {/* Market Cap */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Market Cap
            </th>
            {/* Volume */}
            {/* <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Volume
            </th> */}
            {/* Circulating Supp */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Circulating Supply
            </th>
            {/* 7 Day */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              7 Day
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-zinc-600 bodyBgTheme`}>
          {filteredFavorites.map((crypto) => (
            <tr key={crypto.id}>
              {/* Favorite Star and Crypto Rank */}
              <td class={`w-[100px] h-[80px] px-5 py-3 text-left label-semibold-12 uppercase tracking-wider sticky left-0 items-center flex gap-2  ${theme === "dark" ? " bg-[#07172b]" : " "}`}>
                <button onClick={() => toggleFavorite(crypto.id)}>
                  <MdOutlineStar
                    className="cursor-pointer text-yellow-500"
                    size={20}
                  />
                </button>{" "}
                {crypto.rank}
              </td>
              {/* Crypto Image, Name, & Symbol */}
              <td class={`px-14 py-3   text-left text-xs font-semibold  uppercase tracking-wider bodyBgTheme sticky left-0  ${theme === "dark" ? " bg-[#07172b]" : " "}`}>
                <Link to={`/cryptopage/${crypto.symbol}`}>
                  <div className="flex items-center gap-3">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={crypto.image || "path/to/fallback/image.png"}
                      alt=""
                    />
                    {crypto.name}{" "}
                    <span className="font-light">
                      ({crypto.symbol.toUpperCase()})
                    </span>
                  </div>
                </Link>
              </td>
              {/* Crypto Price */}
              <td class="px-5 py-3  bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                ${crypto.price}
              </td>
              {/* Crypto Low24h */}
              <td class="px-5 py-3  bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                ${crypto.low24h}
              </td>
              {/* Crypto High24h */}
              <td class="px-5 py-3  bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                ${crypto.high24h}
              </td>
              {/* Crypto Change24h */}
              <td class="px-5 py-3  bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                <span
                  className={
                    crypto.change24h > 0
                      ? "text-green-500"
                      : crypto.change24h < 0
                      ? "text-red-500"
                      : "text-black"
                  }
                >
                  {Number(crypto.change24h).toFixed(2)}%
                </span>
              </td>
              {/* Crypto Market Cap */}
              <td class="px-5 py-3 bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                ${Number(crypto.marketCap).toLocaleString()}
              </td>
              {/* Crypto Volume */}
              {/* <td class="px-5 py-3 bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                ${Number(crypto.volume).toLocaleString()}
              </td> */}
              {/* Crypto Circulating Supply */}
              <td class="px-5 py-3 bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider pt-7 ">
                <div className=" items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full border"
                      style={{
                        width: `${
                          (crypto.supply / crypto.totalSupply) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold w-full">
                    {Number(crypto.supply).toLocaleString()}
                  </span>
                </div>
              </td>
              {/* Implement visualization for weekly data */}
              {/* 7 Day Week */}
              <td class="px-5 py-3 bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                <Sparklines data={crypto.weekly} svgWidth={200} svgHeight={50}>
                  <SparklinesLine color="" />
                </Sparklines>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      </div>
      </div>
        ) : (
          <WatchListEmptyState theme={theme} />
        )}
      
      

      
      </div>
    </div>
  );
};

export default Watchlist;
