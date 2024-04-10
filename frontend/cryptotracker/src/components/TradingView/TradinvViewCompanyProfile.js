import React, { useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import ThemeContext from "../ThemeContext"; // Adjust the import path as needed

const TradingViewCompanyProfile = () => {
  const { symbol } = useParams();
  const { theme } = useContext(ThemeContext);
  const widgetRef = useRef(null);
  
  useEffect(() => {
    // Unique identifier for the widget config to avoid conflicts
    const widgetId = `tradingview_${symbol}`;

    // Append widget configuration to window object
    window[widgetId] = {
      "width": "100%",
      "height": "100%",
      "isTransparent": true,
      colorTheme: theme === "dark" ? "dark" : "light",
      "symbol": `BYBIT:${symbol}USDT`, // Ensure this symbol format is supported
      "locale": "en"
    };

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js';
    script.async = true;
    script.type = 'text/javascript';
    // Important: Do not set innerHTML for script. Configuration is done via window object.
    // Set a data attribute on the script tag to link it to the config object in window
    script.setAttribute('data-config', JSON.stringify(window[widgetId]));

    widgetRef.current.innerHTML = ''; // Clear any existing content
    widgetRef.current.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      if (widgetRef.current) {
        widgetRef.current.removeChild(script);
      }
      // Also, clean up the window object
      delete window[widgetId];
    };
  }, [symbol, theme]); // Rerun the effect if symbol or theme changes

  return (
    <div className="tradingview-widget-container">
      <div ref={widgetRef} className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default TradingViewCompanyProfile;
