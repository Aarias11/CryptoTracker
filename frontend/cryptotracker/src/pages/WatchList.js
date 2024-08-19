import React, { useState, useEffect, useContext } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import ThemeContext from "../components/ThemeContext/ThemeContext";
import WatchListEmptyState from "../components/WatchListEmptyState/WatchListEmptyState";
import LoadingComponent from "../components/LoadingComponent";
import WatchlistTable from "../components/WatchlistTable/WatchlistTable"; 
import { RxMagnifyingGlass } from "react-icons/rx";

const Watchlist = () => {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const auth = getAuth();
  const { theme } = useContext(ThemeContext);

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
      setLoading(false); // Set loading to false once the data is fetched
    };

    fetchFavorites();
  }, [auth]);

  // Filtering Favorites based on Search Term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFavorites(favorites);
    } else {
      const filtered = favorites.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFavorites(filtered);
    }
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

  if (loading) {
    return <LoadingComponent theme={theme} />;
  }

  return (
    <div className={`w-full h-screen mx-auto overflow-x-auto`}>
      <h2 className="headline-semibold-28 ml-6 p-6 mt-4">Your Watchlist</h2>
      
      <div className="px-14 relative">
        <div className="relative w-[300px]">
          <input
            type="text"
            placeholder="Search Your Favorites"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`search-input w-[300px] h-full border border-primary-200 rounded-xl font-semibold focus:outline-none text-sm p-3 relative px-[40px] ${
              theme === "dark" ? "bg-[#031021] text-primary-200" : ""
            }`}
          />
          <div className="absolute inset-y-0 left-3 flex items-center">
            <RxMagnifyingGlass size={20} />
          </div>
        </div>

        {favorites.length === 0 ? (
          <WatchListEmptyState theme={theme} />
        ) : filteredFavorites.length === 0 && searchTerm.trim() !== "" ? (
          <div className="w-full h-[500px] flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold">Crypto not found in favorites</h2>
            <p>No results found for "{searchTerm}" in your favorites.</p>
          </div>
        ) : (
          <WatchlistTable
            filteredFavorites={filteredFavorites}
            toggleFavorite={toggleFavorite}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
};

export default Watchlist;
