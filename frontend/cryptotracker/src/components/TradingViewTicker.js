// TradingViewTickerTape.js
import React, { useEffect, useRef, useContext } from "react";
import ThemeContext from "./ThemeContext"; // Adjust the import path as needed

const TradingViewTicker = () => {
  const { theme } = useContext(ThemeContext);
  const widgetRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
        { proName: "FOREXCOM:NSXUSD", title: "US 100 Cash CFD" },
        { proName: "FX_IDC:EURUSD", title: "EUR to USD" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        { proName: "BINANCE:BNBUSDT", title: "Binance Coin" },
        { proName: "KRAKEN:XMRUSD", title: "Monero" },
        { proName: "COINBASE:ADAUSD", title: "Cardano" },
        { proName: "KRAKEN:XRPUSD", title: "XRP" },
        { proName: "BINANCE:SOLUSD", title: "Solana" },
        { proName: "BINANCE:DOTUSD", title: "Polkadot" },
        { proName: "BINANCE:DOGEUSD", title: "Dogecoin" },
        { proName: "BINANCE:AVAXUSD", title: "Avalanche" },
        { proName: "COINBASE:SHIBUSD", title: "Shiba Inu" },
        { proName: "KRAKEN:MATICUSD", title: "Polygon" },
        { proName: "BINANCE:LTCUSD", title: "Litecoin" },
        { proName: "BINANCE:LINKUSDT", title: "Bitcoin Cash" },
        { proName: "BINANCE:ALGOUSD", title: "Algorand" },
        { proName: "BINANCE:XLMUSD", title: "Stellar" },
        { proName: "BINANCE:VETUSD", title: "VeChain" },
        { proName: "BINANCE:ICPUSD", title: "Internet Computer" },
        { proName: "BINANCE:TRXUSD", title: "TRON" },
        { proName: "BINANCE:ETCUSD", title: "Ethereum Classic" },
        { proName: "BINANCE:FILUSD", title: "Filecoin" },
        { proName: "BINANCE:THETAUSD", title: "Theta Network" },
        { proName: "BINANCE:XTZUSD", title: "Tezos" },
        { proName: "BINANCE:EOSUSD", title: "EOS" },
        { proName: "BINANCE:AAVEUSD", title: "Aave" },
        { proName: "BINANCE:KSMUSD", title: "Kusama" },
        { proName: "BINANCE:NEOUSD", title: "Neo" },
        { proName: "BINANCE:MKRUSD", title: "Maker" },
        { proName: "BINANCE:CAKEUSD", title: "PancakeSwap" },
        { proName: "BINANCE:ATOMUSD", title: "Cosmos" },
        { proName: "BINANCE:CRVUSD", title: "Curve DAO Token" },
        { proName: "BINANCE:DASHUSD", title: "Dash" },
        { proName: "BINANCE:COMPUSD", title: "Compound" },
        { proName: "BINANCE:ZECUSD", title: "Zcash" },
        { proName: "BINANCE:ENJUSD", title: "Enjin Coin" },
        { proName: "BINANCE:MANAUSD", title: "Decentraland" },
        { proName: "BINANCE:SANDUSD", title: "The Sandbox" },
        { proName: "BINANCE:YFIUSD", title: "Yearn.finance" },
        { proName: "BINANCE:SNXUSD", title: "Synthetix" },
        { proName: "BINANCE:GRTUSD", title: "The Graph" },
        { proName: "BINANCE:UMAUSD", title: "UMA" },
        { proName: "BINANCE:SUSHIUSD", title: "SushiSwap" },
        { proName: "BINANCE:1INCHUSD", title: "1inch" },
        { proName: "BINANCE:BATUSD", title: "Basic Attention Token" },
        { proName: "BINANCE:ZRXUSD", title: "0x" },
        { proName: "BINANCE:QTUMUSD", title: "Qtum" },
      ],
      showSymbolLogo: true,
      isTransparent: theme === "dark", // Adjust based on your theme state
      displayMode: "compact",
      colorTheme: theme === "dark" ? "dark" : "light", // Dynamically set the color theme
      locale: "en",
    });

    // Ensure widgetRef.current exists before trying to manipulate it
    if (widgetRef.current) {
      widgetRef.current.innerHTML = ""; // Clear existing content
      widgetRef.current.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Ensure widgetRef.current exists before trying to clear it
      if (widgetRef.current) {
        widgetRef.current.innerHTML = ""; // Clear on component unmount
      }
    };
  }, [theme]); // Re-run the effect when the theme changes

  return (
    <div ref={widgetRef} className="tradingview-widget-container border-b border-zinc-700">
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default TradingViewTicker;
