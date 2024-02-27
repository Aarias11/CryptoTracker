import React, { useEffect, useRef, useContext, memo } from 'react';
import ThemeContext from "../components/ThemeContext";

function TradingViewWidget() {
  const container = useRef();
  const { theme } = useContext(ThemeContext); // Using ThemeContext to access the current theme

  useEffect(() => {
    // Make sure the container div exists before attempting to use it
    if (!container.current) return;

    // Clean up any existing content to avoid duplication or errors
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      "dataSource": "Crypto",
      "blockSize": "market_cap_calc",
      "blockColor": "change",
      "locale": "en",
      "symbolUrl": "",
      "colorTheme": theme === "dark" ? "dark" : "light",
      "hasTopBar": true,
      "isDataSetEnabled": true,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "width": "100%",
      "height": "100%"
    });
    container.current.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [theme]); // React to changes in theme

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
    </div>
  );
}

export default memo(TradingViewWidget);
