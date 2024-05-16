import React from "react";

function PortfolioEmptyState({ theme, setIsNewPortfolioModalOpen }) {
  const handleAddClick = () => {
    setIsNewPortfolioModalOpen(true);
  };

  return (
    <div className="w-full h-[300px]">
      <div className="flex justify-center">
        <div className="flex flex-col gap-5 mt-6">
          <h2 className="headline-semibold-48 ">
            Build and track your crypto portfolio
          </h2>
          <p className="w-auto md:w-[800px] text-center body-16">
            Welcome! Add your first portfolio to access market insights, track
            your assets, and connect with our supportive crypto community.
          </p>

          <div className="flex justify-center mt-5">
            <button
              className={`w-[130px] h-[40px] label-14 rounded-lg transition duration-300 ease-in-out shadow-lg shadow-information-800 ${
                theme === "dark"
                  ? "bg-information-600 text-primary-50"
                  : "button-primary-medium-light text-primary-50"
              }`}
              onClick={handleAddClick}
            >
              Add Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioEmptyState;
