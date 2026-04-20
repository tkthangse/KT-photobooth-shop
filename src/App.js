import './App.css';
import React, { useState } from "react";
import Photobooth from "./components/Photobooth";
import "./styles/global.css";

const logoSrc = "/assets/logo/jiggleduo-logo.png";

function App() {
  const [showBooth, setShowBooth] = useState(false);

  // 🌸 Trang chủ cute
  if (!showBooth) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ffd6e0, #e0c3fc)",
        fontFamily: "sans-serif",
        textAlign: "center"
      }}>
        <img src={logoSrc} alt="logo" style={{ width: 80, marginBottom: 20 }} />

        <h1 style={{
          fontSize: 36,
          color: "#8c5b4a",
          marginBottom: 10
        }}>
          Tiệm Photobooth của Kim Thắng
        </h1>

<p style={{
  color: "#555",
  marginBottom: 30,
  lineHeight: "1.6"
}}>
  Chào mừng các vợ đã đến với tiệm photobooth của anh.<br/>
  Một lưu ý quan trọng là tất cả các ảnh của các vợ<br/>
  chụp hoặc tải lên sẽ không lưu lại máy chủ đâu nhé.<br/>
  Các vợ yên tâm sử dụng nhoa 💖
</p>

        <button
          onClick={() => setShowBooth(true)}
          style={{
            padding: "14px 32px",
            fontSize: 16,
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
            color: "#fff",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease"
          }}
          onMouseOver={e => e.target.style.transform = "scale(1.05)"}
          onMouseOut={e => e.target.style.transform = "scale(1)"}
        >
          📸 BẮT ĐẦU SỐNG ẢO THÔI
        </button>
      </div>
    );
  }

  // 📸 Photobooth
  return (
    <div className="App" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 32px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={logoSrc} alt="logo" style={{ width: 50 }} />
          <h1 style={{
            fontFamily:"'Baloo 2', cursive",
            color: "#8c5b4a",
            margin: 0
          }}>
            Tiệm Photobooth của Kim Thắng
          </h1>
        </div>

        {/* 🔙 Nút quay lại */}
        <button
  onClick={() => setShowBooth(false)}
  style={{
    padding: "10px 22px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    color: "#fff",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "all 0.25s ease"
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.transform = "scale(1.07)";
    e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  }}
>
  <span style={{ fontSize: 16 }}>🏠</span>
  Về nhà thôi các vợ
</button>
      </div>

      <div style={{
        flex: 1,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "40px"
      }}>
        <Photobooth />
      </div>
    </div>
  );
}

export default App;