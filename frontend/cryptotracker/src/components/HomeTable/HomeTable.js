import React from 'react';
import { MdOutlineStarBorder, MdOutlineStar } from 'react-icons/md';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { Link } from "react-router-dom";

const HomeTable = ({
  currentItems,
  toggleFavorite,
  favorites,
  theme,
}) => {
  const tableTheme = theme === 'dark' ? 'label-12' : 'label-12';
  const headerBgTheme = theme === 'dark' ? 'label-12' : 'label-12';
  const bodyBgTheme = theme === 'dark' ? 'label-12' : 'label-12';

  return (
    <table className={`min-w-full divide-y px-[65px] p-4 ${tableTheme}`}>
      {/* TABLE HEAD */}
      <thead className={`${headerBgTheme}`}>
        <tr>
          {/* RANK */}
          <th
            className={`w-[100px] h-[80px] px-5 py-3 text-left label-semibold-12 uppercase tracking-wider sticky left-0 items-center flex gap-2 ${
              theme === "dark" ? "bg-[#07172b]" : "bg-primary-50"
            }`}
          >
            # Rank
          </th>
          {/* NAME */}
          <th
            className={`px-14 py-3 text-left text-xs font-semibold uppercase tracking-wider sticky left-0 z-40 ${
              theme === "dark" ? "bg-[#07172b]" : "bg-primary-50"
            }`}
          >
            Name
          </th>

          {/* Price */}
          <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${headerBgTheme}`}>
            Price
          </th>
          {/* Low 24H */}
          <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${headerBgTheme}`}>
            Low 24H
          </th>
          {/* High 24H */}
          <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${headerBgTheme}`}>
            High 24H
          </th>
          {/* 24H % */}
          <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${headerBgTheme}`}>
            24H %
          </th>
          {/* Market Cap */}
          <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${headerBgTheme}`}>
            Market Cap
          </th>
          {/* Volume */}
          {/* <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${headerBgTheme}`}>
            Volume
          </th> */}
          {/* Circulating Supp */}
          <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${headerBgTheme}`}>
            Circulating Supply
          </th>
          {/* 7 Day */}
          <th className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${headerBgTheme}`}>
            7 Day
          </th>
        </tr>
      </thead>
      {/* TABLE BODY */}
      <tbody className={`divide-y divide-zinc-600 ${bodyBgTheme}`}>
        {currentItems.map((crypto, index) => (
          <tr key={crypto.id}>
            {/* RANK */}
            <td
              className={`w-[100px] h-[80px] px-5 py-3 text-left label-semibold-12 uppercase tracking-wider sticky left-0 items-center flex gap-2 ${
                theme === "dark" ? "bg-[#07172b]" : "bg-primary-50"
              }`}
            >
              <button>
                {favorites[crypto.id] ? (
                  <MdOutlineStar
                    className="cursor-pointer text-yellow-400 transition-colors duration-150"
                    size={20}
                    onClick={() => toggleFavorite(crypto)}
                  />
                ) : (
                  <MdOutlineStarBorder
                    className="cursor-pointer text-zinc-600-400 transition-colors duration-150"
                    size={20}
                    onClick={() => toggleFavorite(crypto)}
                  />
                )}
              </button>
              <span className="text-xl">{crypto.market_cap_rank}</span>
            </td>
            {/* IMAGE, NAME, SYMBOL */}
            <td
              className={`px-14 py-3 text-left text-xs font-semibold uppercase tracking-wider ${bodyBgTheme} sticky left-0 ${
                theme === "dark" ? "bg-[#07172b]" : "bg-primary-50"
              }`}
            >
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
            {/* CURRENT PRICE */}
            <td
              className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${bodyBgTheme}`}
            >
              $
              {Number(crypto.current_price) >= 1
                ? Number(crypto.current_price)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : Number(crypto.current_price).toFixed(4)}
            </td>

            {/* LOW 24H */}
            <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider bodyBgTheme">
              ${Number(crypto.low_24h).toLocaleString()}
            </td>
            {/* HIGH 24H */}
            <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider bodyBgTheme">
              ${Number(crypto.high_24h).toLocaleString()}
            </td>
            {/* 24H % */}
            <td
              className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ${bodyBgTheme}`}
            >
              <span
                className={
                  crypto.price_change_percentage_24h > 0
                    ? "text-green-500 flex items-center"
                    : crypto.price_change_percentage_24h < 0
                    ? "text-red-500 flex items-center"
                    : "text-black flex items-center"
                }
              >
                {crypto.price_change_percentage_24h > 0 ? (
                  <FaCaretUp className="mr-1" />
                ) : crypto.price_change_percentage_24h < 0 ? (
                  <FaCaretDown className="mr-1" />
                ) : null}
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </span>
            </td>
            {/* MARKET CAP */}
            <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider bodyBgTheme">
              ${crypto.market_cap.toLocaleString()}
            </td>
            {/* VOLUME */}
            {/* <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider bodyBgTheme">
              {crypto.total_volume.toLocaleString()}
            </td> */}
            {/* CIRCULATING SUPPLY */}
            <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider pt-7 bodyBgTheme">
              <div className="items-center space-x-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 p-1 h-2 rounded-full"
                    style={{
                      width: `${
                        (crypto.circulating_supply / crypto.total_supply) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs font-semibold w-full">
                  {Number(crypto.circulating_supply).toLocaleString()}
                </span>
              </div>
            </td>

            {/* 7 DAY MINI CHART */}
            <td className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <Sparklines
                data={crypto.sparkline_in_7d.price}
                svgWidth={160}
                svgHeight={50}
              >
                <SparklinesLine color="teal" />
              </Sparklines>
            </td>
          </tr>
        ))}
        {/* <!-- Add more rows as needed --> */}
      </tbody>
    </table>
  );
};

export default HomeTable;
