import React, { useState, useMemo, useContext } from "react";
import CryptoExchanges from "../API/CryptoExchanges.json";
import Carousel from "../components/Carousel/Carousel";
import Modal from "../components/ExchangeModal/Modal";
import ThemeContext from "../components/ThemeContext/ThemeContext";

function ExchangesPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("trust_score_rank");
  const [sortOrder, setSortOrder] = useState("asc");
  const { theme } = useContext(ThemeContext); // useContext call corrected for use inside the component

  const openModal = (exchange) => {
    setSelectedExchange(exchange);
    setShowDetails(true);
  };

  const topExchanges = useMemo(
    () => CryptoExchanges.filter((exchange) => exchange.trust_score_rank <= 5),
    []
  );

  const sortedAndFilteredExchanges = useMemo(() => {
    return CryptoExchanges.filter((exchange) =>
      exchange.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
      if (sortKey && sortOrder === "asc") {
        return a[sortKey] > b[sortKey] ? 1 : -1;
      } else if (sortKey) {
        return a[sortKey] < b[sortKey] ? 1 : -1;
      }
      return 0;
    });
  }, [searchTerm, sortKey, sortOrder]);

  const handleSort = (key) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  return (
    <div className={`w-full min-h-screen p-8 ${theme === "dark" ? "" : ""}`}>
      <div className="w-full container mx-auto">
        <h1 className="headline-semibold-28 mb-6">Cryptocurrency Exchanges</h1>
        <p className="text-md mb-10">
          Cryptocurrency exchanges are pivotal platforms where traders and
          investors can buy, sell, or exchange cryptocurrencies. These platforms
          vary greatly in terms of features, security, and ease of use, directly
          impacting the trading experience and outcomes.
        </p>
        <Carousel theme={theme} topExchanges={topExchanges} openModal={openModal} />

        <div
          className={`w-full h-full flex flex-col justify-center overflow-x-scroll lg:p-[50px] ${
            theme === "dark" ? " " : " "
          }`}
        >
          <table className={`min-w-full divide-y divide-zinc-700 `}>
            <thead>
              <tr>
                <th
                  className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider sticky left-0 z-40 ${
                    theme === "dark" ? " bg-[#07172b]" : " bg-zinc-300"
                  }`}
                  onClick={() => handleSort("trust_score_rank")}
                >
                  Rank
                </th>
                <th
                  className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider sticky left-[75px] md:left-[93px] z-40  ${
                    theme === "dark" ? " bg-[#07172b]" : " bg-zinc-300"
                  }`}
                >
                  Image
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider"
                  onClick={() => handleSort("name")}
                >
                  Name
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider"
                  onClick={() => handleSort("trade_volume_24h_btc")}
                >
                  BTC Trade Volume
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-200 headerBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                  Incentives
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {sortedAndFilteredExchanges.map((exchange) => (
                <tr
                  key={exchange.id}
                  onClick={() => openModal(exchange)}
                  className="border-b dark:border-gray-700 cursor-pointer"
                >
                  <td
                    class={`px-5 py-3 h-[85px]  text-xs font-semibold items-center flex gap-4 tracking-wider sticky left-0  ${
                      theme === "dark" ? " bg-[#07172b]" : " "
                    }`}
                  >
                    {exchange.trust_score_rank}
                  </td>
                  <td
                    class={`px-5 py-3   text-left text-xs font-semibold  uppercase tracking-wider bodyBgTheme sticky left-[75px] md:left-[93px]  ${
                      theme === "dark" ? " bg-[#07172b]" : " "
                    }`}
                  >
                    <img
                      src={exchange.image}
                      alt={exchange.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </td>
                  <td class="px-5 py-3  bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                    {exchange.name}
                  </td>
                  <td class="px-5 py-3  bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                    {exchange.trade_volume_24h_btc.toLocaleString()} BTC
                  </td>
                  <td class="px-5 py-3  bodyBgTheme text-left text-xs font-semibold  uppercase tracking-wider">
                    {exchange.has_trading_incentive ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
              {sortedAndFilteredExchanges.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No exchanges found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showDetails && (
          <Modal
            exchange={selectedExchange}
            onClose={() => setShowDetails(false)}
          />
        )}
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Refresh Data
        </button>
      </div>
    </div>
  );
}

export default ExchangesPage;
