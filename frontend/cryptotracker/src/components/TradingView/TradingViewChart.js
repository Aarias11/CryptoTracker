import React, { useEffect, useRef, useContext } from 'react';
import { useParams } from "react-router-dom";
import ThemeContext from "../ThemeContext/ThemeContext";

const TradingViewChart = () => {
  const { symbol } = useParams();
  const containerRef = useRef(null);
  const { theme } = useContext(ThemeContext); // useContext call corrected for use inside the component

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear the container to prevent duplicates
    containerRef.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": `BYBIT:${symbol}USDT`,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": theme === "dark" ? "dark" : "light", // Correctly setting the theme here
      "backgroundColor": theme === "dark" ? "#031021" : "#F5F9FE",
      "style": "1",
      "locale": "en",
      "hide_side_toolbar": false,
      "toolbar_bg": theme === "dark" ? "#031021" : "#F5F9FE", // Ensure toolbar background matches theme
      "enable_publishing": false,
      "allow_symbol_change": true,
      "container_id": "tradingview_3e3a5"
    });

    containerRef.current.appendChild(script);

    // No need for an explicit cleanup to remove the script, as clearing innerHTML handles it
  }, [symbol, theme]); // React to changes in symbol and theme

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: "100%", width: "100%" }}>
      <div className="blue-text">Track all markets on TradingView</div> {/* Adjusted to show some default content */}
    </div>
  );
};

export default TradingViewChart;
