import React, { useEffect, useRef, useContext } from 'react';
import ThemeContext from "../components/ThemeContext";

const TradingViewMarketWidget = () => {
  const widgetRef = useRef(null); // Using useRef to reference the widget container
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // Ensure the widget container is empty before appending a new script
    if (widgetRef.current) {
      widgetRef.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      "feedMode": "market",
      "market": "crypto",
      "isTransparent": theme === "dark" ? true : false,
      "displayMode": "compact",
      "width": "100%",
      "height": "550",
      "colorTheme": theme === "dark" ? "dark" : "light",
      "locale": "en"
    });

    widgetRef.current.appendChild(script);

    // Cleanup function to remove the script when the component unmounts or the theme changes
    return () => {
      if (widgetRef.current) {
        widgetRef.current.innerHTML = '';
      }
    };
  }, [theme]); // Include theme in the dependency array to re-initialize the widget on theme change

  return (
    <div ref={widgetRef} className={`tradingview-widget-container ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
      {/* The widget will be injected here by the TradingView script */}
    </div>
  );
};

export default TradingViewMarketWidget;
