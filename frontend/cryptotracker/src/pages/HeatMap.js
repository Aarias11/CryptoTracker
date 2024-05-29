import React, { useState, useEffect } from 'react';
import TradingViewWidget from '../components/TradingView/TradingViewWidget';
import LoadingComponent from "../components/LoadingComponent";

function HeatMap({ theme }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      // Replace this with your actual data loading logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a 1-second load time
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingComponent theme={theme} />;
  }

  return (
    <div className="w-full h-screen px-7">
        {/* <h2 className='text-4xl font-bold flex justify-center p-2 pt-10 pb-10'>HEATMAP</h2> */}
        <TradingViewWidget />
    </div>
  );
}

export default HeatMap;
