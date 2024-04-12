import React, { useContext, useState, useEffect } from "react";
import ThemeContext from "../components/ThemeContext/ThemeContext";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  BarElement,
  Tooltip,
} from "chart.js";
import { collection, query, where, onSnapshot, arrayRemove, doc, updateDoc } from "firebase/firestore";
import Docker from "../components/Portfolio/Docker";
import PortfolioModal from "../components/Portfolio/PortfolioModal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Tooltip,
  BarElement
);

const Portfolio = () => {
  const { theme } = useContext(ThemeContext);
  const auth = getAuth();
  const user = auth.currentUser;
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "users", user.uid, "portfolios"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let portfolios = [];
        snapshot.forEach((doc) => {
          portfolios.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        if (selectedPortfolio) {
          const portfolio = portfolios.find(
            (p) => p.id === selectedPortfolio.id
          );
          if (portfolio) {
            setCryptoData(portfolio.cryptos || []);
            console.log(portfolio.cryptos)
          }
        }
      });
      return () => unsubscribe();
    }
  }, [user, selectedPortfolio]);

  const handlePortfolioSelect = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setIsModalOpen(true);
    if (portfolio) {
      setCryptoData(portfolio.cryptos || []);
    } else {
      setCryptoData([]);
    }
  };



  const handleDeleteCrypto = async (cryptoId) => {
    const portfolioRef = doc(db, "users", user.uid, "portfolios", selectedPortfolio.id);
    const cryptoToRemove = cryptoData.find(crypto => crypto.cryptoId === cryptoId);
  
    try {
      await updateDoc(portfolioRef, {
        cryptos: arrayRemove(cryptoToRemove)
      });
      console.log("Crypto deleted successfully!");
    } catch (error) {
      console.error("Error removing crypto:", error);
    }
  };

  // Prepare data for charts
  const pieChartData = {
    labels: cryptoData.map((data) => data.name),
    datasets: [
      {
        label: "Asset Distribution",
        data: cryptoData.map((data) => data.quantity * data.averagePrice),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Portfolio Value",
        data: [12000, 19000, 3000, 5000, 2000, 3000], // Example data, integrate real data calculation
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };


  // Conditional styles based on theme
  const tableTheme = theme === "dark" ? "" : "";
  const headerBgTheme = theme === "dark" ? "" : "";
  const bodyBgTheme = theme === "dark" ? "" : "";

  return (
    <div className="w-full screen dashboard-page px-14 pt-5">
      <div className="w-full flex  justify-between">
        <h1 className="headline-28 mb-4 pt-2">Portfolio</h1>
        <Docker onSelectPortfolio={handlePortfolioSelect} />
        {isModalOpen && (
          <PortfolioModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            portfolio={selectedPortfolio}
          />
        )}
      </div>

      {/* CHARTS */}
      <div className="w-full h-auto xl:h-[500px] flex flex-col xl:grid xl:grid-cols-2 pb-4">
        {/* Pie Chart Card */}
        <div
          className={`card w-full xl:w-[600px] h-[250px] p-4 shadow-lg rounded-lg mb-6 w-50 ${
            theme === "dark" ? " " : " "
          } `}
        >
          <h2 className="text-lg font-semibold mb-4">Asset Distribution</h2>
          <div className="chart-container">
            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        {/* Line Chart Card */}
        <div
          className={`card w-full xl:w-[600px] h-[250px] p-4 shadow-lg rounded-lg mb-6 ${
            theme === "dark" ? " " : " "
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">
            Portfolio Value Over Time
          </h2>
          <div className="chart-container">
            <Line
              data={pieChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* ----------------------
      
      {/* Line Chart Card */}
        <div
          className={`card w-full xl:w-[600px] h-[250px] p-4 shadow-lg rounded-lg mb-6 ${
            theme === "dark" ? " " : " "
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">
            Portfolio Value Over Time
          </h2>
          <div className="chart-container">
            <Line
              data={pieChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Pie Chart Card */}
        <div
          className={`card w-full xl:w-[600px] h-[250px] p-4 shadow-lg rounded-lg mb-6 w-50 ${
            theme === "dark" ? " " : " "
          } `}
        >
          <h2 className="text-lg font-semibold mb-4">Asset Distribution</h2>
          <div className="chart-container">
            <Bar data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Table */}

      <div
  className={`w-full h-full flex flex-col justify-center overflow-x-scroll lg:p-[50px] ${
    theme === "dark" ? " " : ""
  }`}
>
  <table className={`min-w-full divide-y divide-zinc-700 `}>
    <thead className={`${headerBgTheme}`}>
      <tr>
        {/* NAME */}
        <th
          className={`px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider ${
            theme === "dark" ? " bg-[#07172b]" : " bg-zinc-300"
          }`}
        >
          Name
        </th>
        {/* Holdings (Assuming you want to show Holdings here, change the header to reflect this) */}
        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
          Holdings
        </th>
        {/* Avg Buy In Price */}
        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
          Ave Buy Price
        </th>
        {/* Profit/Loss */}
        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
          Profit/Loss
        </th>
        {/* Actions */}
        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className={`divide-y divide-zinc-600 bodyBgTheme`}>
  {cryptoData.map((crypto) => (
    <tr key={crypto.cryptoId}>
      <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
        {crypto.name}
      </td>
      <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
        {crypto.quantity}
      </td>
      <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
        ${crypto.averagePrice.toFixed(2)}
      </td>
      <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
        ${crypto.profitLoss}
      </td>
      <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
        <button onClick={() => handleDeleteCrypto(crypto.cryptoId)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>

  </table>
</div>

    </div>
  );
};

export default Portfolio;
