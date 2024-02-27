import React, { useState, useEffect, useContext } from "react";
import { MdOutlineStar } from "react-icons/md";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";
import ThemeContext from "../components/ThemeContext"; // Import ThemeContext

const Watchlist = () => {
  const [favorites, setFavorites] = useState([]);
  const auth = getAuth();
  const { theme } = useContext(ThemeContext); // Use ThemeContext

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(
        collection(db, "users", user.uid, "favorites")
      );
      const fetchedFavorites = [];
      querySnapshot.forEach((doc) => {
        fetchedFavorites.push({ id: doc.id, ...doc.data() });
      });
      setFavorites(fetchedFavorites);
    };

    fetchFavorites();
  }, []);

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
  const tableTheme = theme === "dark" ? "divide-gray-700 bg-gray-800 text-white" : "divide-gray-200 bg-white text-gray-900";
  const headerBgTheme = theme === "dark" ? "bg-gray-700 text-zinc-200" : "bg-gray-100 text-gray-600";
  const bodyBgTheme = theme === "dark" ? "bg-gray-800 text-zinc-200" : "bg-white";


  return (
    <div className={`w-full h-screen mx-auto overflow-x-auto ${bodyBgTheme}`}>
      <h2 className="text-4xl font-semibold p-6">YOUR WATCHLIST</h2>
      <table className={`min-w-full divide-y divide-zinc-700 ${tableTheme}`}>
        <thead className={`${headerBgTheme}`}>
          <tr>
            {/* RANK */}
            <th class="px-3 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              # Rank
            </th>
            {/* NAME */}
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
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
            <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
              Volume
            </th>
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
          {favorites.map((crypto) => (
            <tr key={crypto.id}>
              {/* Favorite Star and Crypto Rank */}
              <td class="px-5 py-3 h-[85px]  text-xs font-semibold items-center flex gap-4 tracking-wider sticky left-0  z-50 bodyBgTheme">
                <button onClick={() => toggleFavorite(crypto.id)}>
                  <MdOutlineStar
                    className="cursor-pointer text-yellow-500"
                    size={20}
                  />
                </button>{" "}
                {crypto.rank}
              </td>
              {/* Crypto Image, Name, & Symbol */}
              <td class="px-5 py-3   text-left text-xs font-semibold  uppercase tracking-wider bodyBgTheme">
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
              <td class="px-5 py-3 bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                ${Number(crypto.volume).toLocaleString()}
              </td>
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
  );
};

export default Watchlist;
