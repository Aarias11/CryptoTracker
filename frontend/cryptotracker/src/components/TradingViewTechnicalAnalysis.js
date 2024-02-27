import React, { useEffect, useRef, useContext } from 'react';
import { useParams } from "react-router-dom";
import ThemeContext from './ThemeContext'; // Adjust this import according to your file structure

const TradingViewTechnicalAnalysis = () => {
  const widgetRef = useRef(null);
  const { symbol } = useParams();
  const { theme } = useContext(ThemeContext); // Assuming your ThemeContext provides 'light' or 'dark'

  useEffect(() => {
    // Clear the container to prevent duplicates
    widgetRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      "interval": "1m",
      "width": "100%",
      "isTransparent": theme === "dark" ? true : false,
      "height": "100%",
      "symbol": `BYBIT:${symbol}USDT`, // Adjust the symbol as needed
      "showIntervalTabs": true,
      "displayMode": "regular",
      "locale": "en",
      "colorTheme": theme // Dynamically set the color theme based on the context
    });

    widgetRef.current.appendChild(script);

    // No need for a cleanup function that removes the script, as resetting innerHTML handles it
  }, [symbol, theme]); // Re-render when symbol or theme changes

  return (
    <div className="tradingview-widget-container" ref={widgetRef}></div>
  );
};

export default TradingViewTechnicalAnalysis;
