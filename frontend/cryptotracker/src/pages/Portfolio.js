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
import PortfolioEmptyState from "../components/Portfolio/PortfolioEmptyState";
import LoadingComponent from "../components/LoadingComponent";

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
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewPortfolioModalOpen, setIsNewPortfolioModalOpen] = useState(false);
  const [portfolios, setPortfolios] = useState([]); // State to store the list of portfolios
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
        const q = query(collection(db, "users", user.uid, "portfolios"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let fetchedPortfolios = [];
            snapshot.forEach((doc) => {
                fetchedPortfolios.push({ id: doc.id, ...doc.data() });
            });
            setPortfolios(fetchedPortfolios);
      setLoading(false);

            // console.log("Updated portfolios", fetchedPortfolios);
        });
        return () => unsubscribe();
    }
}, [user]);


  const handlePortfolioSelect = (portfolio) => {
    // console.log("Portfolio selected:", portfolio);
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

  const handleAddClick = () => {
    setIsNewPortfolioModalOpen(true); // This should control the NewPortfolioModal
  };

  const handleDeletePortfolio = async () => {
    if (selectedPortfolio) {
      try {
        await deleteDoc(
          doc(db, "users", user.uid, "portfolios", selectedPortfolio.id)
        );
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


  if (loading) {
    return <LoadingComponent theme={theme} />;
  }

  return (
    <div className={`w-full h-auto  px-4 md:px-8 lg:px-14  pt-10 ${
      theme === "dark"
        ? "bg-gradient-to-r from-[#07172b]  to-[#031021] "
        : "bg-gradient-to-r from-[#F5F9FE]  to-primary-100"
    }` }  >
      <h1 className="headline-semibold-28  ">Portfolio</h1>
      <div >
        {portfolios.length > 0 ? (
          <>
            <div className="w-full h-auto flex flex-col-reverse gap-4">
              {/* Section for buttons and viewing text */}
              <div className="flex flex-col xl:ml-16 pl-1 pt-2">
                {/* Button Container always visible */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddClick}
                    className={`w-[130px] h-[40px] label-14 rounded-lg transition duration-300 ease-in-out shadow-md shadow-primary-800 ${
                      theme === "dark"
                        ? "button-primary-medium-dark text-primary-50"
                        : "button-primary-medium-light text-primary-50"
                    }`}
                  >
                    Add Portfolio
                  </button>

                  {/* Conditionally render the Delete Portfolio button */}
                  {selectedPortfolio && (
                    <button
                      onClick={handleDeletePortfolio}
                      className={`w-[150px] h-[40px] label-14 rounded-lg transition duration-300 ease-in-out ${
                        theme === "dark"
                          ? "text-primary-50"
                          : "button-primary-medium-light text-primary-50"
                      }`}
                    >
                      Delete Portfolio
                    </button>
                  )}
                </div>

                {/* Portfolio Viewing Details, conditionally displayed */}
                {selectedPortfolio && (
                  <div className="pt-4 pb-4 flex gap-2 items-center">
                    <p className="title-20">Viewing</p>
                    <p className="title-semibold-20">
                      {selectedPortfolio.name}
                    </p>
                  </div>
                )}
              </div>

              <Docker onSelectPortfolio={handlePortfolioSelect} theme={theme} />

              {isModalOpen && (
                <AddCryptoModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  portfolioId={
                    selectedPortfolio ? selectedPortfolio.id : undefined
                  }
                />
              )}
            </div>

            {/* CHARTS */}
            <div className="w-full h-auto xl:grid xl:grid-cols-2 xl:place-items-center pt-4">
              {/* Pie Chart Card */}
              <div
                className={`card w-full xl:w-[564px] h-[250px] p-4 shadow-lg border rounded-lg mb-6 ${
                  theme === "dark"
                    ? "border-primary-900  bg-[#07172b]"
                    : "bg-primary-50 shadow-primary-100 border-primary-200"
                }`}
              >
                <h2 className="text-lg font-semibold mb-4">
                  Asset Distribution
                </h2>
                <div className="chart-container">
                  <Pie
                    data={pieChartData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
              {/* Line Chart Card */}
              <div
                className={`card w-full xl:w-[564px] h-[250px] p-4 shadow-lg border rounded-lg mb-6 ${
                  theme === "dark"
                    ? "border-primary-900  bg-[#07172b]"
                    : "bg-primary-50 shadow-primary-100 border-primary-200"
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
            <div className="xl:px-14  pt-2">
              <button
                onClick={handleOpenModal}
                className={`w-[130px] h-[40px] label-14 rounded-lg transition duration-300 ease-in-out shadow-lg shadow-information-800 ${
                  theme === "dark"
                    ? "bg-information-600 text-primary-50"
                    : "button-primary-medium-light text-primary-50"
                }`}
              >
                Add Crypto
              </button>
            </div>
            {/* Table */}
            <div
              className={`w-full h-full flex flex-col justify-center overflow-x-scroll pt-8 xl:p-[50px] ${
                theme === "dark" ? "" : ""
              }`}
            >
              <table className="min-w-full ">
                <thead>
                  <tr>
                    <th
                      className={`w-[150px] h-[80px] px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider sticky left-0 ${
                        theme === "dark" ? " bg-[#07172b]" : " bg-primary-50"
                      }`}
                    >
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
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {cryptoData.map((crypto) => (
                    <tr key={crypto.cryptoId}>
                      <td
                        className={`w-[150px] h-[80px] px-5 py-3 text-left label-semibold-12 uppercase tracking-wider sticky left-0 items-center flex gap-2  ${
                          theme === "dark" ? " bg-[#07172b]" : " bg-primary-50"
                        }`}
                      >
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
                        <button
                          onClick={() => handleDeleteCrypto(crypto.cryptoId)}
                        >
                          <IconX size={15} className="text-neutral-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isNewPortfolioModalOpen && (
              <PortfolioModal
                isOpen={isNewPortfolioModalOpen}
                onClose={() => setIsNewPortfolioModalOpen(false)}
                db={db}
                user={user}
              />
            )}
          </>
        ) : (
          <PortfolioEmptyState theme={theme} setIsNewPortfolioModalOpen={setIsNewPortfolioModalOpen} />
        )}
         {isNewPortfolioModalOpen && (
          <PortfolioModal
            isOpen={isNewPortfolioModalOpen}
            onClose={() => setIsNewPortfolioModalOpen(false)}
            db={db}
            user={user}
          />
        )}
      </div>
    </div>
  );
};

export default Portfolio;
