import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Next.js ke liye 'next/navigation' se useRouter use karein

export default function PinLockScreen() {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  // Jaise hi 6 digits pure honge, dashboard open ho jayega
  useEffect(() => {
    if (pin.length === 6) {
      const timer = setTimeout(() => {
        navigate("/dashboard"); // Apne dashboard ka route path yahan likhein
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [pin, navigate]);

  const handleNumberClick = (num) => {
    if (pin.length < 6) {
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <>
      {/* Internal CSS */}
      <style>{`
        .pin-container {
          min-height: 100vh;
          background-color: #121212;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 40px 16px 24px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-sizing: border-box;
        }

        .pin-header {
          text-align: center;
          margin-top: 40px;
        }

        .pin-title {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
        }

        .pin-subtitle {
          color: #9e9e9e;
          font-size: 14px;
          margin-top: 8px;
        }

        .pin-boxes {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 44px;
        }

        .pin-box {
          width: 44px;
          height: 50px;
          border-radius: 8px;
          border: 1.5px solid #555555;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          transition: all 0.15s ease;
        }

        .pin-box.filled {
          border-color: #ffffff;
          background-color: #1e1e1e;
        }

        .keypad-grid {
          width: 100%;
          max-width: 360px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .keypad-btn {
          background-color: #2b2b2b;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 16px 0;
          font-size: 22px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .keypad-btn:active {
          background-color: #4a4a4a;
        }
      `}</style>

      {/* UI Layout */}
      <div className="pin-container">
        <div className="pin-header">
          <h1 className="pin-title">Welcome back!</h1>
          <p className="pin-subtitle">Unlock SafePal App with password</p>

          {/* 6 PIN Boxes */}
          <div className="pin-boxes">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`pin-box ${pin[index] ? "filled" : ""}`}
              >
                {pin[index] ? "•" : ""}
              </div>
            ))}
          </div>
        </div>

        {/* Numeric Keypad */}
        <div className="keypad-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              className="keypad-btn"
              onClick={() => handleNumberClick(num.toString())}
            >
              {num}
            </button>
          ))}

          {/* Empty Left Cell */}
          <div></div>

          {/* Zero Button */}
          <button
            type="button"
            className="keypad-btn"
            onClick={() => handleNumberClick("0")}
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            type="button"
            className="keypad-btn"
            onClick={handleDelete}
            aria-label="Delete"
          >
            ⌫
          </button>
        </div>
      </div>
    </>
  );
}