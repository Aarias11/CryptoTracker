import React, { useState, useMemo, useContext } from "react";
import CryptoExchanges from "../API/CryptoExchanges.json";
import Carousel from "../components/Carousel/Carousel";
import Modal from "../components/ExchangeModal/Modal";
import ThemeContext from "../components/ThemeContext/ThemeContext";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

function ExchangesPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("trust_score_rank");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const { theme } = useContext(ThemeContext); // useContext call corrected for use inside the component

  // Open Modal
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


// Handle Sorted Exchanges
  const handleSort = (key) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  // Calculate the Total Number of Pages based on sorted and filtered exchanges
  const totalPages = useMemo(
    () => Math.ceil(sortedAndFilteredExchanges.length / itemsPerPage),
    [sortedAndFilteredExchanges.length, itemsPerPage]
  );

  // Calculate the Current Items to Display on the Page
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedAndFilteredExchanges.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage, sortedAndFilteredExchanges]);

  // Handler functions for pagination controls
  // Handle Previous Page
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
// Handle Next pAge
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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
        <Carousel
          theme={theme}
          topExchanges={topExchanges}
          openModal={openModal}
        />

        <div
          className={`w-full h-full flex flex-col justify-center overflow-x-scroll lg:p-[50px] pt-5 ${
            theme === "dark" ? " " : " "
          }`}
        >
          <table className={`min-w-full divide-y divide-zinc-700 `}>
            <thead>
              <tr>
                <th
                  className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider sticky left-0 z-40 ${
                    theme === "dark" ? " bg-[#07172b]" : " bg-primary-50"
                  }`}
                  onClick={() => handleSort("trust_score_rank")}
                >
                  Rank
                </th>
                <th
                  className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider sticky left-[75px] md:left-[93px] z-40  ${
                    theme === "dark" ? " bg-[#07172b]" : " bg-primary-50"
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
              {currentItems.map((exchange) => (
                <tr
                  key={exchange.id}
                  onClick={() => openModal(exchange)}
                  className="border-b dark:border-gray-700 cursor-pointer"
                >
                  <td
                    class={`px-5 py-3 h-[85px]  text-xs font-semibold items-center flex gap-4 tracking-wider sticky left-0  ${
                      theme === "dark" ? " bg-[#07172b]" : " bg-primary-50"
                    }`}
                  >
                    {exchange.trust_score_rank}
                  </td>
                  <td
                    class={`px-5 py-3   text-left text-xs font-semibold  uppercase tracking-wider bodyBgTheme sticky left-[75px] md:left-[93px] ${
                      theme === "dark" ? " bg-[#07172b]" : " bg-primary-50"
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
            theme={theme}
            exchange={selectedExchange}
            onClose={() => setShowDetails(false)}
          />
        )}
        {/* Pagination */}
        <div className="w-full h-auto md:flex md:justify-end md:items-center p-5 border-t border-zinc-700 ">
          <div className="w-full md:w-[50%] flex justify-between items-center ">
            <div>
              <span className="label-14">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <div className="flex">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className=" label-14 px-4 py-2 mx-1 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center"
              >
                <IconArrowLeft />
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className=" label-14 px-4 py-2 mx-1 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center"
              >
                Next
                <IconArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExchangesPage;


