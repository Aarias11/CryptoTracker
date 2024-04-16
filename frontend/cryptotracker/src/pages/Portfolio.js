import React, { useContext, useState, useEffect } from "react";
import ThemeContext from "../components/ThemeContext/ThemeContext";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { deleteDoc } from "firebase/firestore"; 
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
import {
  collection,
  query,
  where,
  onSnapshot,
  arrayRemove,
  doc,
  updateDoc,
} from "firebase/firestore";
import Docker from "../components/Portfolio/Docker";
import PortfolioModal from "../components/Portfolio/PortfolioModal";
import AddCryptoModal from "../components/Portfolio/AddCryptoModal";
import CryptoMarketCoins from "../API/CryptoMarketCoins.json";
import { IconX } from "@tabler/icons-react";


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
            console.log(portfolio.cryptos);
          }
        }
      });
      return () => unsubscribe();
    }
  }, [user, selectedPortfolio]);

  const handlePortfolioSelect = (portfolio) => {
    console.log("Portfolio selected:", portfolio);
    setSelectedPortfolio(portfolio);
    if (portfolio) {
      setCryptoData(portfolio.cryptos || []);
    } else {
      setCryptoData([]);
    }
  };
  

  const handleDeleteCrypto = async (cryptoId) => {
    const portfolioRef = doc(
      db,
      "users",
      user.uid,
      "portfolios",
      selectedPortfolio.id
    );
    const cryptoToRemove = cryptoData.find(
      (crypto) => crypto.cryptoId === cryptoId
    );

    try {
      await updateDoc(portfolioRef, {
        cryptos: arrayRemove(cryptoToRemove),
      });
      console.log("Crypto deleted successfully!");
    } catch (error) {
      console.error("Error removing crypto:", error);
    }
  };

  const getCurrentPrice = (cryptoId) => {
    const coin = CryptoMarketCoins.find((coin) => coin.id === cryptoId);
    return coin ? coin.current_price : "N/A";
  };

  const getCryptoImage = (cryptoId) => {
    const coin = CryptoMarketCoins.find((coin) => coin.id === cryptoId);
    return coin ? coin.image : "path/to/default/image.png";
  };

  const calculateProfitLoss = (crypto) => {
    const marketCoin = CryptoMarketCoins.find(
      (coin) => coin.id === crypto.cryptoId
    );
    if (marketCoin) {
      return (marketCoin.current_price - crypto.averagePrice) * crypto.quantity;
    }
    return 0;
  };

  const handleOpenModal = () => {
    if (selectedPortfolio) {
      setIsModalOpen(true);
    } else {
      console.error("No portfolio selected!");
      // Optionally, alert the user or handle this case visually in your UI
    }
  };
  



  const handleDeletePortfolio = async () => {
    if (selectedPortfolio) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "portfolios", selectedPortfolio.id));
        console.log("Portfolio deleted successfully!");
        setSelectedPortfolio(null);
        setCryptoData([]);
      } catch (error) {
        console.error("Error deleting portfolio:", error);
      }
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
      <div className="w-full flex flex-wrap  justify-between items-center">
        <h1 className="headline-28  pt-2">Portfolio</h1>
        <Docker onSelectPortfolio={handlePortfolioSelect} />
      </div>
      {isModalOpen && (
        <AddCryptoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        portfolioId={selectedPortfolio ? selectedPortfolio.id : undefined}
      />
      
      
      )}

{selectedPortfolio && (
          <>
            <div className="text-lg font-bold my-4">
              Viewing Portfolio: {selectedPortfolio.name}
            </div>
            <button onClick={handleDeletePortfolio} className="w-[130px] h-[40px] label-14 rounded-lg transition duration-300 ease-in-out button-primary-medium-dark shadow-xl shadow-primary-800">
              Delete Portfolio
            </button>
          </>
        )}

      {/* CHARTS */}
      <div className="w-full h-auto xl:h-auto flex flex-col xl:grid xl:grid-cols-2  pt-6">
        {/* Pie Chart Card */}
        <div
          className={`card w-full xl:w-[600px] h-[250px] p-4 shadow-lg rounded-lg w-50 ${
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
        {/* <div
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
        </div> */}

        {/* Pie Chart Card */}
        {/* <div
          className={`card w-full xl:w-[600px] h-[250px] p-4 shadow-lg rounded-lg mb-6 w-50 ${
            theme === "dark" ? " " : " "
          } `}
        >
          <h2 className="text-lg font-semibold mb-4">Asset Distribution</h2>
          <div className="chart-container">
            <Bar data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div> */}
      </div>

      {/* Table */}
      <button
          onClick={handleOpenModal}
          className="w-[130px] h-[40px] label-14 rounded-lg transition duration-300 ease-in-out button-primary-medium-dark shadow-xl shadow-primary-800"
        >
          Add Crypto
        </button>
      <div
        className={`w-full h-full flex flex-col justify-center overflow-x-scroll lg:p-[50px] ${
          theme === "dark" ? "" : ""
        }`}
      >
        <table className="min-w-full ">
          <thead>
            <tr>
              <th className={`w-[150px] px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider ${
                  theme === "dark" ? " bg-[#07172b]" : " bg-primary-50"
                }`}>
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                Holdings
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                Avg Buy Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                Profit/Loss
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                
              </th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((crypto) => (
              <tr key={crypto.cryptoId}>
                <td className={`w-[150px] p-5 md:p-3 text-left text-xs font-semibold uppercase tracking-wider flex gap-2 items-center ${
                  theme === "dark" ? " bg-[#07172b]" : " bg-primary-50"
                }`}>
                  <img
                    src={getCryptoImage(crypto.cryptoId)}
                    alt={crypto.name}
                    className="w-6 h-6 rounded-full"
                  />
                  {crypto.name}
                </td>
                <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  ${getCurrentPrice(crypto.cryptoId)}
                </td>
                <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  {crypto.quantity}
                </td>
                <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  ${crypto.averagePrice.toFixed(2)}
                </td>
                <td className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  <span
                    style={{
                      color:
                        calculateProfitLoss(crypto) > 0
                          ? "green"
                          : calculateProfitLoss(crypto) < 0
                          ? "red"
                          : "inherit",
                    }}
                  >
                    ${calculateProfitLoss(crypto).toFixed(2)}
                  </span>
                </td>

                <td className="px-5 py-3 text-left  tracking-wider">
                  <button onClick={() => handleDeleteCrypto(crypto.cryptoId)}>
                    <IconX size={15} className="text-neutral-400" />
                  </button>
                  
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
