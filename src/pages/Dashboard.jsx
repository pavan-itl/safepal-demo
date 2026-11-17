




















































































import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import swapIcon from "../assets/swap.png";
import bnbTokenIcon from "../assets/bnb.png";
import bitcoinTokenIcon from "../assets/btc.png";
import ethereumErc20TokenIcon from "../assets/eth_erc20.png";
import ethereumArbitrumTokenIcon from "../assets/eth_arbitrum.png";
import ethereumBaseTokenIcon from "../assets/eth_base.png";
import gramTokenIcon from "../assets/gram.png";
import mag7TokenIcon from "../assets/mag7.ssi.png";
import polTokenIcon from "../assets/polygon.png";
import sfpTokenIcon from "../assets/sfpl.png";
import solanaTokenIcon from "../assets/sol_solana.png";
import tronTokenIcon from "../assets/token-icons/tron.png";
import usdcTokenIcon from "../assets/usdc.png";
import usdtTokenIcon from "../assets/usdt.png";

const tokenIcon = (src, className = "") => (
  <img className={`token-icon token-logo ${className}`} src={src} alt="" aria-hidden="true" />
);

const TOKEN_ICONS = {
  BNB: tokenIcon(bnbTokenIcon),
  BTC: tokenIcon(bitcoinTokenIcon),
  ETH_ERC20: tokenIcon(ethereumErc20TokenIcon),
  ETH_ARB: tokenIcon(ethereumArbitrumTokenIcon),
  ETH_BASE: tokenIcon(ethereumBaseTokenIcon),
  SOL: tokenIcon(solanaTokenIcon),
  USDT: tokenIcon(usdtTokenIcon),
  GRAM: tokenIcon(gramTokenIcon, "gram-token-icon"),
  MAG7: tokenIcon(mag7TokenIcon),
  POL: tokenIcon(polTokenIcon),
  SFP: tokenIcon(sfpTokenIcon),
  TRX: tokenIcon(tronTokenIcon),
  USDC: tokenIcon(usdcTokenIcon),
};

const INITIAL_PORTFOLIO = [
  { cgId: "tether", symbol: "USDT", network: "(Solana)", networkFilter: "Solana", iconKey: "USDT", balance: 850, fallbackPrice: 0.9993, fallbackChange: 0 },
  { binanceSymbol: "BNBUSDT", cgId: "binancecoin", symbol: "BNB", network: "(BEP20)", networkFilter: "BEP20", iconKey: "BNB", balance: 0, fallbackPrice: 615.27, fallbackChange: -4.11 },
  { binanceSymbol: "BTCUSDT", cgId: "bitcoin", symbol: "BTC", network: "(Bitcoin)", networkFilter: "Bitcoin", iconKey: "BTC", balance: 0, fallbackPrice: 67158.01, fallbackChange: -3.09 },
  { binanceSymbol: "ETHUSDT", cgId: "ethereum", symbol: "ETH", network: "(ERC20)", networkFilter: "ERC20", iconKey: "ETH_ERC20", balance: 0, fallbackPrice: 1903.45, fallbackChange: -2.99 },
  { binanceSymbol: "ETHUSDT", cgId: "ethereum", symbol: "ETH", network: "(Arbitrum)", networkFilter: "Arbitrum", iconKey: "ETH_ARB", balance: 0, fallbackPrice: 1903.45, fallbackChange: -2.99 },
  { binanceSymbol: "ETHUSDT", cgId: "ethereum", symbol: "ETH", network: "(Base)", networkFilter: "Base", iconKey: "ETH_BASE", balance: 0, fallbackPrice: 1903.45, fallbackChange: -2.99 },
  { cgId: "gram", symbol: "GRAM", network: "(TON)", networkFilter: "TON", iconKey: "GRAM", balance: 0, fallbackPrice: 1.1, fallbackChange: -4.84 },
  { cgId: "mag7-ssi", symbol: "MAG7.ssi", network: "(Base)", networkFilter: "Base", iconKey: "MAG7", balance: 0, fallbackPrice: 0.4353, fallbackChange: -2.47 },
  { cgId: "polygon-ecosystem-token", symbol: "POL", network: "(Polygon)", networkFilter: "Polygon", iconKey: "POL", balance: 0, fallbackPrice: 0.0837, fallbackChange: -3.81 },
  { binanceSymbol: "SFPUSDT", cgId: "safepal", symbol: "SFP", network: "(BEP20)", networkFilter: "BEP20", iconKey: "SFP", balance: 0, fallbackPrice: 0.1813, fallbackChange: -6.88 },
  { binanceSymbol: "SOLUSDT", cgId: "solana", symbol: "SOL", network: "(Solana)", networkFilter: "Solana", iconKey: "SOL", balance: 0, fallbackPrice: 75.71, fallbackChange: -6.3 },
  { binanceSymbol: "TRXUSDT", cgId: "tron", symbol: "TRX", network: "", networkFilter: "TRON", iconKey: "TRX", balance: 0, fallbackPrice: 0.313, fallbackChange: 0.1 },
  { cgId: "usd-coin", symbol: "USDC", network: "(Arbitrum)", networkFilter: "Arbitrum", iconKey: "USDC", balance: 0, fallbackPrice: 1.0007, fallbackChange: 0 },
  { cgId: "usd-coin", symbol: "USDC", network: "(ERC20)", networkFilter: "ERC20", iconKey: "USDC", balance: 0, fallbackPrice: 1.0007, fallbackChange: 0 },
  { cgId: "usd-coin", symbol: "USDC", network: "(Base)", networkFilter: "Base", iconKey: "USDC", balance: 0, fallbackPrice: 1.0007, fallbackChange: 0 },
  { cgId: "tether", symbol: "USDT", network: "(TRC20)", networkFilter: "TRC20", iconKey: "USDT", balance: 0, fallbackPrice: 0.9993, fallbackChange: 0 },
  { cgId: "tether", symbol: "USDT", network: "(ERC20)", networkFilter: "ERC20", iconKey: "USDT", balance: 0, fallbackPrice: 0.9993, fallbackChange: 0 },
];

const COINGECKO_IDS = [...new Set(INITIAL_PORTFOLIO.map((token) => token.cgId))].join(",");
const NETWORK_OPTIONS = ["All", "BEP20", "Bitcoin", "ERC20", "Arbitrum", "Base", "TON", "Polygon", "TRON", "TRC20", "Solana"];
const PULL_THRESHOLD = 65;

// Helper: Fetch with 4-second timeout so blocked domains never hang
async function fetchWithTimeout(url, timeoutMs = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export default function CryptoWalletApp() {
  const [walletInfo] = useState({
    name: "Wallet01-598",
    address: "0x71C9482A9032F89A4",
  });

  const [tokens, setTokens] = useState([]);
  const [exchangeMeta, setExchangeMeta] = useState({});
  const [activeTab, setActiveTab] = useState("Coin");
  const [activeBottomNav, setActiveBottomNav] = useState("Wallet");
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("All");
  const [showToast, setShowToast] = useState(false);
  const [isRefreshingUsdtSolana, setIsRefreshingUsdtSolana] = useState(false);

  // Pull-to-refresh states
  const [refreshStatus, setRefreshStatus] = useState("idle");
  const [pullHeight, setPullHeight] = useState(0);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const scrollAreaRef = useRef(null);

  const formatUSD = (num) =>
    "$" +
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // 1. Binance ExchangeInfo (Uses unblocked data-api.binance.vision first, then api.binance.com)
  const fetchBinanceExchangeInfo = useCallback(async () => {
    const symbolsParam = encodeURIComponent(
      JSON.stringify(["BNBUSDT", "BTCUSDT", "ETHUSDT", "SOLUSDT"])
    );
    const urls = [
      `https://data-api.binance.vision/api/v3/exchangeInfo?symbols=${symbolsParam}`,
      `https://api.binance.com/api/v3/exchangeInfo?symbols=${symbolsParam}`,
    ];

    for (const url of urls) {
      try {
        const data = await fetchWithTimeout(url, 4000);
        const metaMap = {};
        (data.symbols || []).forEach((s) => {
          metaMap[s.symbol] = {
            status: s.status,
            baseAsset: s.baseAsset,
            quoteAsset: s.quoteAsset,
          };
        });
        setExchangeMeta(metaMap);
        return;
      } catch (_) {
        // Try next endpoint
      }
    }
  }, []);

  // 2. Binance tickers with CoinGecko prices for the full portfolio
  const fetchBinanceTickers = useCallback(async () => {
    const symbolsList = ["BNBUSDT", "BTCUSDT", "ETHUSDT", "SOLUSDT"];
    const baseDomains = [
      "https://data-api.binance.vision",
      "https://api.binance.com",
    ];
    const setPortfolioPrices = (getPrice) => {
      setTokens((currentTokens) =>
        INITIAL_PORTFOLIO.map((item) => {
          const currentToken = currentTokens.find(
            (token) => token.symbol === item.symbol && token.networkFilter === item.networkFilter
          );
          const balance = currentToken?.balance ?? item.balance;
          const { price, change24h } = getPrice(item);
          return { ...item, balance, price, change24h, fiatValue: balance * price };
        })
      );
    };

    // Try Binance endpoints (unblocked vision mirror first)
    for (const domain of baseDomains) {
      try {
        const responses = await Promise.all(
          symbolsList.map((sym) =>
            fetchWithTimeout(`${domain}/api/v3/ticker/24hr?symbol=${sym}`, 4000)
          )
        );

        const priceMap = {};
        responses.forEach((ticker) => {
          priceMap[ticker.symbol] = {
            price: parseFloat(ticker.lastPrice),
            change24h: parseFloat(ticker.priceChangePercent),
          };
        });

        let coinGeckoData = {};
        try {
          coinGeckoData = await fetchWithTimeout(
            `https://api.coingecko.com/api/v3/simple/price?ids=${COINGECKO_IDS}&vs_currencies=usd&include_24hr_change=true`,
            5000
          );
        } catch {
          // Binance prices and local fallbacks remain available if CoinGecko is blocked.
        }

        setPortfolioPrices((item) => {
            const binancePrice = priceMap[item.binanceSymbol];
            const coinGeckoPrice = coinGeckoData[item.cgId];
            const price = binancePrice?.price ?? coinGeckoPrice?.usd ?? item.fallbackPrice;
            const change24h = binancePrice?.change24h ?? coinGeckoPrice?.usd_24h_change ?? item.fallbackChange;
            return { price, change24h };
        });
        return; // Success! Exit function
      } catch (_) {
        // Try next domain
      }
    }

    // Backup: CoinGecko if ISP blocks all Binance domains
    try {
      const cgData = await fetchWithTimeout(
        `https://api.coingecko.com/api/v3/simple/price?ids=${COINGECKO_IDS}&vs_currencies=usd&include_24hr_change=true`,
        5000
      );
      setPortfolioPrices((item) => {
          const live = cgData[item.cgId];
          const price = live ? live.usd : item.fallbackPrice;
          const change24h = live ? live.usd_24h_change : item.fallbackChange;
          return { price, change24h };
      });
    } catch (_) {
      // Final offline fallback
      setPortfolioPrices((item) => ({ price: item.fallbackPrice, change24h: item.fallbackChange }));
    }
  }, []);

  const updateUsdtSolanaBalance = (value) => {
    const balance = value === "" ? 0 : Number(value);
    if (!Number.isFinite(balance) || balance < 0) return;

    setTokens((currentTokens) =>
      currentTokens.map((token) =>
        token.symbol === "USDT" && token.networkFilter === "Solana"
          ? { ...token, balance, fiatValue: balance * token.price }
          : token
      )
    );
  };

  const refreshUsdtSolanaPrice = async () => {
    setIsRefreshingUsdtSolana(true);
    try {
      const data = await fetchWithTimeout(
        "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd&include_24hr_change=true",
        5000
      );
      const livePrice = data.tether;
      if (!Number.isFinite(livePrice?.usd)) throw new Error("USDT price unavailable");

      setTokens((currentTokens) =>
        currentTokens.map((token) =>
          token.symbol === "USDT" && token.networkFilter === "Solana"
            ? {
                ...token,
                price: livePrice.usd,
                change24h: Number.isFinite(livePrice.usd_24h_change)
                  ? livePrice.usd_24h_change
                  : token.change24h,
                fiatValue: token.balance * livePrice.usd,
              }
            : token
        )
      );
    } catch {
      // Keep the last known price when the refresh request fails.
    } finally {
      setIsRefreshingUsdtSolana(false);
    }
  };

  useEffect(() => {
    fetchBinanceExchangeInfo();
    fetchBinanceTickers();

    const interval = setInterval(fetchBinanceTickers, 15000);
    return () => clearInterval(interval);
  }, [fetchBinanceExchangeInfo, fetchBinanceTickers]);

  // Pull-to-refresh sequence
  const triggerRefresh = async () => {
    setRefreshStatus("updating");
    setPullHeight(54);

    await Promise.all([
      fetchBinanceTickers(),
      new Promise((res) => setTimeout(res, 700)),
    ]);

    setRefreshStatus("updated");

    setTimeout(() => {
      setRefreshStatus("idle");
      setPullHeight(0);
    }, 1000);
  };

  const handleStart = (clientY) => {
    if (refreshStatus === "updating" || refreshStatus === "updated") return;
    const scrollTop = scrollAreaRef.current ? scrollAreaRef.current.scrollTop : 0;
    if (scrollTop <= 0) {
      startYRef.current = clientY;
      isDraggingRef.current = true;
    }
  };

  const handleMove = (clientY) => {
    if (!isDraggingRef.current) return;
    const delta = clientY - startYRef.current;
    if (delta > 0) {
      const damped = Math.min(delta * 0.55, 95);
      setPullHeight(damped);
      setRefreshStatus(damped >= PULL_THRESHOLD ? "ready" : "pulling");
    } else {
      setPullHeight(0);
      setRefreshStatus("idle");
    }
  };

  const handleEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (pullHeight >= PULL_THRESHOLD) {
      triggerRefresh();
    } else {
      setPullHeight(0);
      setRefreshStatus("idle");
    }
  };

  const { totalFiat, totalBtc } = useMemo(() => {
    const sumUsd = tokens.reduce((acc, t) => acc + t.fiatValue, 0);
    const btcToken = tokens.find((t) => t.symbol === "BTC");
    const btcRate = btcToken && btcToken.price > 0 ? btcToken.price : 73633.12;
    return {
      totalFiat: sumUsd,
      totalBtc: sumUsd / btcRate,
    };
  }, [tokens]);

  const filteredTokens = useMemo(() => {
    return tokens.filter((t) => {
      const matchesSearch =
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.network.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNetwork =
        selectedNetwork === "All" || t.networkFilter === selectedNetwork;
      return matchesSearch && matchesNetwork;
    });
  }, [tokens, searchQuery, selectedNetwork]);

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(walletInfo.address);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  const handleCycleNetwork = () => {
    const nextIdx = (NETWORK_OPTIONS.indexOf(selectedNetwork) + 1) % NETWORK_OPTIONS.length;
    setSelectedNetwork(NETWORK_OPTIONS[nextIdx]);
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          -webkit-tap-highlight-color: transparent;
        }

        body {
          background-color: #0b0c0e;
          color: #ffffff;
        }

        .wallet-wrapper {
          min-height: 100vh;
          background-color: #0b0c0e;
          display: flex;
          justify-content: center;
        }

        .app-container {
          width: 100%;
          max-width: 412px;
          background-color: #131418;
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        /* Top Header */
        .top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px 10px;
          background-color: #131418;
          z-index: 20;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

       .icon-btn {
          position: relative;
          background: transparent;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          color: #ffffff; /* Bell icon ka color */
        }

        .notification-badge {
          position: absolute;
          top: 1px;
          right: 1px;
          background-color: #ef4444; /* Red circle */
          color: #ffffff; /* White text */
          font-size: 10px;
          font-weight: 700;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .wallet-selector {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: 14px;
        }

        .wallet-name {
          font-size: 17px;
          font-weight: 500;
          color: #f3f4f6;
          letter-spacing: 0.2px;
        }

        .dropdown-arrow {
          color: #9ca3af;
          font-size: 11px;
          margin-top: 2px;
        }

        .copy-divider {
          width: 1px;
          height: 14px;
          background-color: #2e313a;
          margin: 0 2px;
        }

        /* Navigation Tabs */
        .nav-tabs {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #22242c;
          padding: 4px 16px 0;
          background-color: #131418;
          z-index: 20;
        }

        .tab-item {
          flex: 1;
          text-align: center;
          padding: 10px 0 12px;
          font-size: 15px;
          font-weight: 500;
          color: #8b8e98;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }

        .tab-item.active {
          color: #ffffff;
          font-weight: 600;
        }

        .tab-item.active::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 12%;
          width: 76%;
          height: 3px;
          background-color: #5b54e8;
          border-radius: 3px 3px 0 0;
        }

        /* Scrollable Area with Pull to Refresh */
        .scrollable-content {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 76px;
          user-select: none;
        }

        .scrollable-content::-webkit-scrollbar {
          display: none;
        }

        /* Pull to Refresh Indicator */
        .ptr-indicator {
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          color: #9ca3af;
          font-size: 14px;
          font-weight: 400;
          background-color: #131418;
        }

        .ptr-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(156, 163, 175, 0.25);
          border-top-color: #d1d5db;
          border-radius: 50%;
          animation: ptrSpin 0.75s linear infinite;
        }

        @keyframes ptrSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Balance Section */
        .balance-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 16px 20px;
        }

        .balance-label-row {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #9ca3af;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .eye-btn {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .main-balance {
          font-size: 38px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.15;
          letter-spacing: -0.5px;
        }

        .btc-equivalent {
          font-size: 13.5px;
          color: #d1d5db;
          margin-top: 6px;
          font-weight: 500;
        }

        /* Quick Action Buttons */
        .actions-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 18px 22px;
        }

        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          width: 60px;
        }

        .action-circle {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background-color: #24262d;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e5e7eb;
          transition: background-color 0.15s;
        }

        .action-item:active .action-circle {
          background-color: #323540;
        }

        .action-text {
          font-size: 12px;
          color: #d1d5db;
          font-weight: 400;
          white-space: nowrap;
        }

        /* Search & Filter Bar */
        .filter-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 14px 14px;
        }

        .search-box {
          flex: 1;
          height: 38px;
          background-color: #1c1d22;
          border: 1px solid #262830;
          border-radius: 8px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 8px;
        }

        .search-box input {
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 14px;
          width: 100%;
        }

        .search-box input::placeholder {
          color: #7d808a;
        }

        .network-filter {
          height: 38px;
          background-color: #1c1d22;
          border: 1px solid #262830;
          border-radius: 8px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #e5e7eb;
          font-size: 13.5px;
          cursor: pointer;
          user-select: none;
        }

        .more-options-btn {
          width: 34px;
          height: 38px;
          background-color: #1c1d22;
          border: 1px solid #262830;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d1d5db;
          cursor: pointer;
        }

        /* Token List */
        .token-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 0 14px;
        }

        .token-card {
          background-color: #1c1d22;
          border-radius: 12px;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: background-color 0.15s;
        }

        .token-card:active {
          background-color: #24262e;
        }

        .token-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .token-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .token-logo {
          object-fit: contain;
        }

        .gram-token-icon {
          object-fit: cover;
          transform: scale(1.45);
        }

        .token-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .token-title-row {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 15px;
        }

        .token-symbol {
          font-weight: 600;
          color: #f3f4f6;
        }

        .token-network {
          color: #8b8e98;
          font-weight: 400;
          font-size: 14px;
        }



        .token-price-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
        }

        .token-price {
          color: #d1d5db;
          font-weight: 400;
        }

        .token-price-refresh {
          background: none;
          border: 0;
          padding: 0;
          color: inherit;
          font: inherit;
          cursor: pointer;
        }

        .token-price-refresh:hover:not(:disabled) {
          text-decoration: underline;
        }

        .token-price-refresh:disabled {
          cursor: wait;
          opacity: 0.7;
        }

        .price-change {
          font-weight: 500;
        }

        .price-change.negative {
          color: #d9534f;
        }

        .price-change.positive {
          color: #2ebd85;
        }

        .token-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .featured-token-change {
          color: #d9534f;
        }

        .holding-amount {
          font-size: 15px;
          font-weight: 600;
          color: #f3f4f6;
        }

        .holding-amount-input {
          width: 82px;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          text-align: right;
          font-family: inherit;
        }

        .holding-fiat {
          font-size: 13px;
          color: #8b8e98;
        }

        /* Bottom Navigation Bar */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          width: 100%;
          max-width: 412px;
          height: 62px;
          background-color: #131418;
          border-top: 1px solid #1f2128;
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 50;
        }

        .nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: none;
          border: none;
          color: #7d808a;
          font-size: 11px;
          cursor: pointer;
          width: 20%;
        }

        .nav-btn.active {
          color: #2ebd85;
        }

        .toast {
          position: fixed;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          background: #2b2d36;
          color: #fff;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s;
          z-index: 100;
        }

        .toast.show {
          opacity: 1;
        }
      `}</style>

      <div className="wallet-wrapper">
        <div className="app-container">
          <div className={`toast ${showToast ? "show" : ""}`}>
            Address Copied
          </div>

          {/* Top Header */}
          <header className="top-header">
            <div className="header-left">
              <button className="icon-btn" title="Settings">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>

              {/* <button className="icon-btn" title="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button> */}

              <button className="icon-btn" title="Notifications">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="notification-badge">17</span>
      </button>

              <div className="wallet-selector">
                <span className="wallet-name">{walletInfo.name}</span>
                <span className="dropdown-arrow">⌄</span>
                <div className="copy-divider" />
                <button className="icon-btn" onClick={handleCopyAddress} title="Copy Address">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            </div>

            <button className="icon-btn" title="Scan QR">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <line x1="7" y1="12" x2="17" y2="12" />
              </svg>
            </button>
          </header>

          {/* Navigation Tabs */}
          <nav className="nav-tabs">
            {["Coin", "Earn", "NFT"].map((tab) => (
              <div
                key={tab}
                className={`tab-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </nav>

          {/* Pull-to-Refresh Scroll Container */}
          <div
            ref={scrollAreaRef}
            className="scrollable-content"
            onTouchStart={(e) => handleStart(e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientY)}
            onTouchEnd={handleEnd}
            onMouseDown={(e) => handleStart(e.clientY)}
            onMouseMove={(e) => handleMove(e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
          >
            {/* Dynamic Pull-to-Refresh Status Bar */}
            <div
              className="ptr-indicator"
              style={{
                height: `${pullHeight}px`,
                opacity: pullHeight > 10 ? 1 : 0,
                transition: isDraggingRef.current
                  ? "none"
                  : "height 0.28s ease, opacity 0.2s ease",
              }}
            >
              {refreshStatus === "pulling" && (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                  <span>Pull down to update</span>
                </>
              )}

              {refreshStatus === "ready" && (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                  <span>Release to update</span>
                </>
              )}

              {refreshStatus === "updating" && (
                <>
                  <div className="ptr-spinner" />
                  <span>Updating...</span>
                </>
              )}

              {refreshStatus === "updated" && (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Updated</span>
                </>
              )}
            </div>

            {/* Balance Display */}
            <section className="balance-section">
              <div className="balance-label-row">
                <span>Balance</span>
                <button
                  className="eye-btn"
                  onClick={() => setIsBalanceHidden((prev) => !prev)}
                  title="Toggle Balance"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>

              <div className="main-balance">
                {isBalanceHidden ? "****" : totalFiat === 0 ? "$0" : formatUSD(totalFiat)}
              </div>
              <div className="btc-equivalent">
                {isBalanceHidden ? "**** BTC" : totalBtc === 0 ? "0 BTC" : `${totalBtc.toFixed(6)} BTC`}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="actions-row">
              <div className="action-item">
                <div className="action-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </div>
                <span className="action-text">Send</span>
              </div>

              <div className="action-item">
                <div className="action-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                </div>
                <span className="action-text">Receive</span>
              </div>

              <div className="action-item">
                <div className="action-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <span className="action-text">Buy</span>
              </div>

              <div className="action-item">
                <div className="action-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
                    <path d="M15 10h2a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9l-3-3" />
                    <line x1="2" y1="22" x2="16" y2="22" />
                    <rect x="6" y="8" width="6" height="4" />
                  </svg>
                </div>
                <span className="action-text">Gas Station</span>
              </div>

              <div className="action-item">
                <div className="action-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="1.8" />
                    <circle cx="12" cy="12" r="1.8" />
                    <circle cx="12" cy="19" r="1.8" />
                  </svg>
                </div>
                <span className="action-text">More</span>
              </div>
            </section>

            {/* Search & Network Filter */}
            <section className="filter-bar">
              <div className="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7d808a" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="network-filter" onClick={handleCycleNetwork}>
                <span>{selectedNetwork}</span>
                <span style={{ fontSize: "11px", color: "#9ca3af" }}>⌄</span>
              </div>

              <button className="more-options-btn" title="Manage Tokens">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.7" />
                  <circle cx="12" cy="12" r="1.7" />
                  <circle cx="12" cy="19" r="1.7" />
                </svg>
              </button>
            </section>

            {/* Dynamic Token List */}
            <main className="token-list">
              {filteredTokens.map((token, idx) => {
                const isNeg = token.change24h < 0;
                const formattedChange = `${isNeg ? "" : "+"}${token.change24h.toFixed(2)}%`;
                const isTrading = exchangeMeta[token.binanceSymbol]?.status === "TRADING";

                return (
                  <div className="token-card" key={`${token.symbol}-${token.network}-${idx}`}>
                    <div className="token-left">
                      {TOKEN_ICONS[token.iconKey]}
                      <div className="token-info">
                        <div className="token-title-row">
                          <span className="token-symbol">{token.symbol}</span>
                          <span className="token-network">{token.network}</span>
                          {isTrading && <span className="status-dot" title="TRADING on Binance" />}
                        </div>
                        <div className="token-price-row">
                          {token.symbol === "USDT" && token.networkFilter === "Solana" ? (
                            <button
                              className="token-price token-price-refresh"
                              type="button"
                              onClick={refreshUsdtSolanaPrice}
                              disabled={isRefreshingUsdtSolana}
                              aria-label="Refresh USDT Solana price"
                              aria-busy={isRefreshingUsdtSolana}
                              title="Click to refresh price"
                            >
                              {formatUSD(token.price)}
                            </button>
                          ) : (
                            <span className="token-price">{formatUSD(token.price)}</span>
                          )}
                          <span className={`price-change ${isNeg ? "negative" : "positive"}`}>
                            {formattedChange}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="token-right">
                      {token.symbol === "USDT" && token.networkFilter === "Solana" ? (
                        isBalanceHidden ? (
                          <span className="holding-amount">****</span>
                        ) : (
                          <input
                            className="holding-amount holding-amount-input"
                            type="number"
                            min="0"
                            step="any"
                            value={850}
                            onChange={(event) => updateUsdtSolanaBalance(event.target.value)}
                            aria-label="USDT Solana balance"
                          />
                        )
                      ) : (
                        <span className="holding-amount">
                          {isBalanceHidden ? "****" : token.balance}
                        </span>
                      )}
                      <span className="holding-fiat">
                        {isBalanceHidden
                          ? "****"
                          : token.fiatValue === 0
                          ? "$0"
                          : formatUSD(token.fiatValue)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </main>
          </div>

          {/* Bottom Navigation Bar */}
          <footer className="bottom-nav">
            <button
              className={`nav-btn ${activeBottomNav === "Wallet" ? "active" : ""}`}
              onClick={() => setActiveBottomNav("Wallet")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={activeBottomNav === "Wallet" ? "#2ebd85" : "currentColor"}>
                <path d="M21 7H5a2 2 0 0 1 0-4h14v4zm0 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a4 4 0 0 0 2 .5h16zm-4 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
              </svg>
              <span>Wallet</span>
            </button>

            <button
              className={`nav-btn ${activeBottomNav === "Market" ? "active" : ""}`}
              onClick={() => setActiveBottomNav("Market")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="4" y="12" width="3" height="8" rx="1" />
                <rect x="10.5" y="6" width="3" height="14" rx="1" />
                <rect x="17" y="9" width="3" height="11" rx="1" />
              </svg>
              <span>Market</span>
            </button>

            <button
              className={`nav-btn ${activeBottomNav === "Explore" ? "active" : ""}`}
              onClick={() => setActiveBottomNav("Explore")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" transform="rotate(45 17.5 6.5)" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              <span>Explore</span>
            </button>

            {/* <button
              className={`nav-btn ${activeBottomNav === "Swap" ? "active" : ""}`}
              onClick={() => setActiveBottomNav("Swap")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              <span>Swap</span>
            </button> */}




           <button
  className={`nav-btn ${activeBottomNav === "Swap" ? "active" : ""}`}
  onClick={() => setActiveBottomNav("Swap")}
>
  <img src={swapIcon} alt="" aria-hidden="true" width="20" height="20" />
  <span>Swap</span>
</button>
            <button
              className={`nav-btn ${activeBottomNav === "Trade" ? "active" : ""}`}
              onClick={() => setActiveBottomNav("Trade")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <polyline points="9 10 15 10 13 8" />
                <polyline points="15 14 9 14 11 16" />
              </svg>
              <span>Trade</span>
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
