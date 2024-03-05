import React, { useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import ThemeContext from "../components/ThemeContext";

const TradingViewNews = () => {
  const { symbol } = useParams();
  const widgetRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // Function to load or reload the widget
    const loadWidget = () => {
      if (!widgetRef.current) return;

      // Clean up the previous widget by removing its script and inner content
      widgetRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
      script.async = true;
      script.type = "text/javascript";
      script.innerHTML = JSON.stringify({
        "feedMode": "market",
        "market": "crypto",
        "isTransparent": theme === "dark" ? true : false,
        "displayMode": "compact",
        "width": "100%",
        "height": "100%",
        "colorTheme": theme === "dark" ? "dark" : "light",
        "locale": "en"
      });

      widgetRef.current.appendChild(script);
    };

    loadWidget();

    // Cleanup function to remove the widget script when the component unmounts or theme changes
    return () => {
      if (widgetRef.current) {
        widgetRef.current.innerHTML = "";
      }
    };
  }, [symbol, theme]); // Dependency array includes theme to reload widget on theme change

  return (
    <div ref={widgetRef} className={`tradingview-widget-container ${theme === "dark" ? "bg-[#1d1e22]" : "bg-[#FAFAFA]"}`}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default TradingViewNews;
