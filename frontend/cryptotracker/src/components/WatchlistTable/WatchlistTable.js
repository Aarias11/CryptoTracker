import React from "react";
import { MdOutlineStar } from "react-icons/md";
import { Link } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";

const WatchlistTable = ({ filteredFavorites, toggleFavorite, theme }) => {
  const headerBgTheme = theme === "dark" ? "bg-[#07172b]" : "bg-zinc-300";
  const bodyBgTheme = theme === "dark" ? "bg-[#07172b]" : "";

  return (
    <div className={`w-full h-full overflow-x-scroll mt-24 ${theme === "dark" ? "" : ""}`}>
      <table className={`divide-y divide-zinc-700`}>
        <thead className={headerBgTheme}>
          <tr>
            <th className={`w-[100px] h-[80px] px-5 py-3 text-left label-semibold-12 uppercase tracking-wider sticky left-0 items-center flex gap-2 ${headerBgTheme}`}>
              # Rank
            </th>
            <th className={`px-14 py-3 text-left text-xs font-semibold uppercase tracking-wider sticky left-0 ${headerBgTheme}`}>
              Name
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
              Price
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
              Low 24H
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
              High 24H
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
              24H %
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
              Market Cap
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
              Circulating Supply
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
              7 Day
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-zinc-600 ${bodyBgTheme}`}>
          {filteredFavorites.map((crypto) => (
            <tr key={crypto.id}>
              <td className={`w-[100px] h-[80px] px-5 py-3 text-left label-semibold-12 uppercase tracking-wider sticky left-0 items-center flex gap-2 ${bodyBgTheme}`}>
                <button onClick={() => toggleFavorite(crypto.id)}>
                  <MdOutlineStar
                    className="cursor-pointer text-yellow-500"
                    size={20}
                  />
                </button>{" "}
                {crypto.rank}
              </td>
              <td className={`px-14 py-3 text-left text-xs font-semibold uppercase tracking-wider sticky left-0 ${bodyBgTheme}`}>
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
              <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                ${crypto.price}
              </td>
              <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                ${crypto.low24h}
              </td>
              <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                ${crypto.high24h}
              </td>
              <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
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
              <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                ${Number(crypto.marketCap).toLocaleString()}
              </td>
              <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                <div className="items-center space-x-2">
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
              <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
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

export default WatchlistTable;
