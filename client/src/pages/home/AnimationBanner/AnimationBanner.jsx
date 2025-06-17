import { useState, useEffect } from "react";
import GrandBoxBg from "../../../assets/grand_box.png";
import MajorBoxBg from "../../../assets/major_box.png";
import MiniBoxBg from "../../../assets/mini_box.png";

export default function AnimationBanner() {
  const [jackpots, setJackpots] = useState({
    mini: 1182.23,
    grand: 177923.66,
    major: 12037.73,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [jackpotImage, setJackpotImage] = useState(null); // নতুন স্টেট
  const baseURL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

  // ফেচ জ্যাকপট ইমেজ
  useEffect(() => {
    const fetchJackpotImage = async () => {
      try {
        const response = await fetch(`${baseURL}/features-image`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch jackpot image");
        }
        const data = await response.json();
        setJackpotImage(data.jackpotImage || null);
      } catch (err) {
        console.error("Fetch jackpot image error:", err);
      }
    };
    fetchJackpotImage();
  }, [baseURL]);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
      setIsMobile(true);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setJackpots((prev) => ({
        mini: prev.mini + 0.03,
        grand: prev.grand + 0.06,
        major: prev.major + 0.08,
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (!jackpotImage) return null;

  return (
    <div
      style={{
        display: isMobile ? "block" : "none",
        position: "relative",
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto",
        textAlign: "center",
        fontFamily: "'SolaimanLipi', sans-serif",
      }}
      className="md:hidden"
    >
      {/* Banner Image */}
      <img
        src={`${baseURL}${jackpotImage}`}
        alt="Jackpot Banner"
        style={{ width: "100%", height: "auto" }}
      />

      {/* Overlay Numbers */}
      <div
        style={{
          position: "absolute",
          top: "80%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
          alignItems: "center",
        }}
      >
        {/* Mini Jackpot */}
        <div style={{ position: "relative", textAlign: "center" }}>
          <img
            src={MiniBoxBg}
            alt="Mini Jackpot"
            style={{
              width: "100px",
              height: "auto",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "65%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#FFFFFF",
              fontSize: "clamp(10px, 2.5vw, 12px)",
              fontWeight: "bold",
              textAlign: "center",
              width: "80%",
            }}
          >
            {formatNumber(jackpots.mini)}
          </div>
        </div>

        {/* Grand Jackpot */}
        <div
          style={{
            position: "relative",
            textAlign: "center",
            marginRight: "10px",
            marginLeft: "10px",
            top: "-10px",
          }}
        >
          <img
            src={GrandBoxBg}
            alt="Grand Jackpot"
            style={{
              width: "140px",
              height: "auto",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "65%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#FFFFFF",
              fontSize: "clamp(14px, 3.5vw, 18px)",
              fontWeight: "bold",
              textAlign: "center",
              width: "80%",
            }}
          >
            {formatNumber(jackpots.grand)}
          </div>
        </div>

        {/* Major Jackpot */}
        <div style={{ position: "relative", textAlign: "center" }}>
          <img
            src={MajorBoxBg}
            alt="Major Jackpot"
            style={{
              width: "100px",
              height: "auto",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "65%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#FFFFFF",
              fontSize: "clamp(10px, 2.5vw, 12px)",
              fontWeight: "bold",
              textAlign: "center",
              width: "80%",
            }}
          >
            {formatNumber(jackpots.major)}
          </div>
        </div>
      </div>
    </div>
  );
}
