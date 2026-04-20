import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const frameOptions = [
    "/assets/frames/heart-frame.png",
    "/assets/frames/heart-frame-2.png",
    "/assets/frames/heart-frame-3.png",
    "/assets/frames/heart-frame-4.png",
    "/assets/frames/jmin-singer-frame-1.png",
    "/assets/frames/martin-singer-1.png",
    "/assets/frames/viet-nam-frame.png",
    "/assets/frames/basic-frame-1.png",
    "/assets/frames/minion-frame.png",
    "/assets/frames/meme-frame.png",
    "/assets/frames/color-ful-frame.png",
    "/assets/frames/dpr-ian-frame.png",
    "/assets/frames/conan-frame.png", 
    "/assets/frames/film-frame.png",
    "/assets/frames/shane-frame.png",
    "/assets/frames/cinnamoroll-frame.png",
    "/assets/frames/y2k-frame.png",
    "/assets/frames/bunbohue-frame.png",
    "/assets/frames/girly-frame.png",
    "/assets/frames/Lucky-frame.png",
    "/assets/frames/wxrdie-frame.png",
    "/assets/frames/hellokitty-frame.png",
    "/assets/frames/emxinhsayhi-frame.png",
    "/assets/frames/weareone-frame.png",
    "/assets/frames/shine-frame.png",
    "/assets/frames/zeka-frame.png",
    "/assets/frames/bear-pink-frame.png",
    "/assets/frames/ios-frame.png",
    "/assets/frames/cutie-pink-frame.png",
    "/assets/frames/matcha-frame.png",
    "/assets/frames/giaykethon-frame.png",
    "/assets/frames/basic-black-1-frame.png",
    "/assets/frames/digitalcam-carton-frame.png",
    "/assets/frames/basic-blue-frame.png",
    "/assets/frames/chikawa-frame.png",
    "/assets/frames/locket-frame.png",
    "/assets/frames/eyed-blue-frame.png",
    "/assets/frames/merry-chirstmas-frame.png",
    "/assets/frames/school-frame.png",
    "/assets/frames/mattchalatte-frame.png",
    "/assets/frames/loopy-frame.png",
    "/assets/frames/vietnam2-frame.png",
    "/assets/frames/ins-frame.png",
    "/assets/frames/chibi-frame.png",
    "/assets/frames/basic-blue-2-frame.png",
    "/assets/frames/powerpuff-frame.png",
    "/assets/frames/Stitch-frame.png",
    "/assets/frames/bearbare.png",
    "/assets/frames/basic-white-frame.png",
    "/assets/frames/retro-windows-frame.png",
    "/assets/frames/dautay-frame.png",
    "/assets/frames/steven-frame.png",
    "/assets/frames/llya-frame.png",
    "/assets/frames/zeus-frame.png",
    "/assets/frames/soda-frame.png",
    "/assets/frames/porsche-frame.png",
];

const stickerOptions = [
    "/assets/stickers/leaf.png",
    "/assets/stickers/dino-cute.png",
    "/assets/stickers/duck-cute.png",
    "/assets/stickers/chicken.png",
    "/assets/stickers/mocking.png",
    "/assets/stickers/sun.png",
    "/assets/stickers/sparkles.png"
];

const SLOT_WIDTH = 953;
const SLOT_HEIGHT = 599;


export default function PhotoBooth() {
    const autoRef = useRef({
        stopped: false,
        interval: null,
        timeout: null
    });
    const shutterSound = useRef(new Audio("/sounds/take-photo.mp3"));
    const doneSound = useRef(new Audio("/sounds/set-photo.mp3"));
    const downloadSound = useRef(new Audio("/sounds/download.mp3"));
    const uploadSound = useRef(new Audio("/sounds/upload.mp3"));
    const [filter, setFilter] = useState("none");
    const photoCountRef = useRef(0);
    const [facingMode, setFacingMode] = useState("user");
    const stopAutoCapture = () => { autoRef.current.stopped = true; };
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const frameImgRef = useRef(null);
    const [detectedSlots, setDetectedSlots] = useState([]);
    // const slots = [
    //     { x: 123, y: 78 },
    //     { x: 123, y: 697 },
    //     { x: 123, y: 1286 },
    //     { x: 123, y: 1885 }
    // ];
    const slots = detectedSlots;
    const filterBtn = (active) => ({
    padding: "8px 14px",
    borderRadius: 20,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    transition: "0.3s",
    background: active
        ? "linear-gradient(135deg,#ff9a9e,#fecfef)"
        : "#f1f1f1",
    color: active ? "white" : "#555",
    boxShadow: active
        ? "0 4px 10px rgba(0,0,0,0.15)"
        : "0 2px 6px rgba(0,0,0,0.1)"
    });
    const [selectedFrame, setSelectedFrame] = useState(null);
    const [mode, setMode] = useState("photo");

    const [photos, setPhotos] = useState([]);
    const [photoCount, setPhotoCount] = useState(0);
    const [canTakePhoto, setCanTakePhoto] = useState(true);
    const [draggingPhoto, setDraggingPhoto] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [countdown, setCountdown] = useState(null);

    const [stickers, setStickers] = useState([]);
    const [draggingSticker, setDraggingSticker] = useState(null);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [autoMode, setAutoMode] = useState(false);
    // useEffects

    // frames
    useEffect(() => {
        if (!selectedFrame) return;
        const img = new Image();
        img.src = selectedFrame;

        img.onload = () => {
            frameImgRef.current = img;
            const detectedSlots = detectSlotsFromFrame(img);
            setDetectedSlots(detectedSlots);
            drawCanvas();
        }
    }, [selectedFrame]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !frameImgRef.current) return;

        const ctx = canvas.getContext("2d");

        const frameWidth = frameImgRef.current.width;
        const frameHeight = frameImgRef.current.height;
        canvas.width = frameWidth;
        canvas.height = frameHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        photos.forEach(p => {
            const slot = slots[p.slotIndex];
            const drawW = p.img.width * p.scale;
            const drawH = p.img.height * p.scale;
            const dx = slot.x + p.offsetX;
            const dy = slot.y + p.offsetY;

            ctx.save();
            ctx.beginPath();
            ctx.rect(slot.x, slot.y, SLOT_WIDTH, SLOT_HEIGHT);
            ctx.clip();
            ctx.drawImage(p.img, dx, dy, drawW, drawH);
            ctx.restore();
        });
                ctx.drawImage(frameImgRef.current, 0, 0, frameWidth, frameHeight);

        stickers.forEach((s, i) => {
            ctx.drawImage(s.img, s.x, s.y, 150, 150);
            if (i === selectedSticker) {
                ctx.strokeStyle = "#ff7aa2";
                ctx.lineWidth = 4;
                ctx.strokeRect(s.x, s.y, 150, 150);
            }
        });
    };

    useEffect(() => {
  drawCanvas();
}, [photos, stickers, selectedSticker, photoCount, slots]);
    useEffect(() => {
        photoCountRef.current = photoCount;
    }, [photoCount]);
    const handleBack = () => {
        if (mode === "decorate") {
            setMode("photo");
            setCanTakePhoto(false);
            setStickers([]);
            setSelectedSticker(null);
        } else {
            setSelectedFrame(null);
            setPhotos([]);
            setPhotoCount(0);
            setStickers([]);
            setSelectedSticker(null);
            setMode("photo");
            setCanTakePhoto(true);
        }
    };
const videoConstraints = {
  facingMode: facingMode,
  width: { ideal: 1920 },
  height: { ideal: 1080 }
};
// sounds take
const playShutter = () => {
    const sound = shutterSound.current;
    sound.currentTime = 0; // 🔥 reset để spam được
    sound.play();
};
 const playDoneSound = () => {
        const sound = doneSound.current;
        sound.currentTime = 0;
        sound.play();
    };
    const playDownloadSound = () => {
    const sound = downloadSound.current;
    sound.currentTime = 0;
    sound.play();
};
const playUploadSound = () => {
    const sound = uploadSound.current;
    sound.currentTime = 0;
    sound.play();
};
    // photo auto
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const startAutoCapture = async () => {
    if (photoCountRef.current >= 4) return;

    autoRef.current.stopped = false;

    setAutoMode(true);
    setCanTakePhoto(false);

    while (!autoRef.current.stopped) {

        const currentSlot = photoCountRef.current;

        if (currentSlot >= 4) break;

        // countdown
        for (let i = 3; i > 0; i--) {
            if (autoRef.current.stopped) break;

            setCountdown(i);
            await sleep(1000);
        }

        if (autoRef.current.stopped) break;

        setCountdown(null);

        takePhotoNow(currentSlot);

        await sleep(500);
    }

    setAutoMode(false);
    setCanTakePhoto(true);
    setCountdown(null);
};
// fit photos
const detectSlotsFromFrame = (img) => {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;

  const ctx = tempCanvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const { data, width, height } = ctx.getImageData(0, 0, img.width, img.height);

  const visited = new Uint8Array(width * height);
  const slots = [];

  const isTransparent = (i) => data[i + 3] < 10;

  const getIndex = (x, y) => (y * width + x) * 4;

  const floodFill = (startX, startY) => {
    let stack = [[startX, startY]];
    let minX = startX, maxX = startX;
    let minY = startY, maxY = startY;

    while (stack.length) {
      const [x, y] = stack.pop();
      const idx = y * width + x;

      if (visited[idx]) continue;
      visited[idx] = 1;

      const pixelIndex = getIndex(x, y);
      if (!isTransparent(pixelIndex)) continue;

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      if (x > 0) stack.push([x - 1, y]);
      if (x < width - 1) stack.push([x + 1, y]);
      if (y > 0) stack.push([x, y - 1]);
      if (y < height - 1) stack.push([x, y + 1]);
    }

    return {
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY
    };
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (visited[idx]) continue;

      const pixelIndex = getIndex(x, y);

      if (isTransparent(pixelIndex)) {
        const box = floodFill(x, y);

        // lọc vùng nhỏ (noise)
        if (box.w > 200 && box.h > 200) {
          slots.push(box);
        }
      }
    }
  }

  return slots.sort((a, b) => a.y - b.y); // sắp xếp từ trên xuống
};
    // photos
  const addPhoto = (img, slotIndexParam = null) => {
    if (photoCount >= 4) return;

    const slotIndex = slotIndexParam !== null ? slotIndexParam : photoCount;
    const slot = slots[slotIndex];
    if (!slot) return;

    const scaleX = slot.w / img.width;
    const scaleY = slot.h / img.height;

    // 🔥 dùng MAX để fill full khung
    const scale = Math.max(scaleX, scaleY);

    const drawW = img.width * scale;
    const drawH = img.height * scale;

    // 🔥 crop từ giữa (rất quan trọng)
    const offsetX = (slot.w - drawW) / 2;
    const offsetY = (slot.h - drawH) / 2;

    setPhotos(p => [
        ...p,
        { img, slotIndex, scale, offsetX, offsetY }
    ]);

    setCanTakePhoto(true);

  setPhotoCount(c => {
    const next = c + 1;

    if (next === 4) {
        setMode("decorate");
        playDoneSound(); // 🔥 thêm dòng này
    }

    return next;
});
};

  const takePhotoNow = (slotIndex) => {
    const video = webcamRef.current.video;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;

    const ctx = tempCanvas.getContext("2d");

    ctx.filter = filter; // 🔥 áp dụng filter thật
    ctx.drawImage(video, 0, 0);
    playShutter();
    const src = tempCanvas.toDataURL("image/png");

    const img = new Image();
    img.src = src;

    img.onload = () => addPhoto(img, slotIndex);
};

    const capturePhoto = () => {
        if (!canTakePhoto || countdown !== null) return;

        setCanTakePhoto(false);
        setCountdown(3);

        let current = 3;
        const interval = setInterval(() => {
            current -= 1;

            if (current === 0) {
                clearInterval(interval);
                setCountdown(null);
                takePhotoNow();
            } else {
                setCountdown(current);
            }
        }, 1000);
    };

    const uploadPhoto = e => {
        const file = e.target.files[0];
        if (!file) return;

        playUploadSound();
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => addPhoto(img);
        };

        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const redoLastPhoto = () => {
        if (!photos.length) return;
        setPhotos(p => p.slice(0, -1));
        setPhotoCount(c => Math.max(0, c - 1));
        setCanTakePhoto(true);
    };

    const getCoords = e => {
        const r = canvasRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - r.left) * (canvasRef.current.width / r.width),
            y: (e.clientY - r.top) * (canvasRef.current.height / r.height)
        };
    };

    // drag photos
    const handleMouseDown = e => {
        const { x, y } = getCoords(e);
        if (mode === "photo") {
            for (let i = photos.length - 1; i >= 0; i--) {
                const p = photos[i];
                const slot = slots[p.slotIndex];
                const w = p.img.width * p.scale;
                const h = p.img.height * p.scale;

                if(
                    x >= slot.x + p.offsetX &&
                    x <= slot.x + p.offsetX + w &&
                    y >= slot.y + p.offsetY &&
                    y <= slot.y + p.offsetY + h
                ) {
                    setDraggingPhoto(i);
                    setDragOffset({
                        x: x - slot.x - p.offsetX,
                        y: y - slot.y - p.offsetY
                    });
                    return;
                }

            }
        }

        if (mode === "decorate") {
            for(let i = stickers.length - 1; i >= 0; i --){
                const s = stickers[i];
                if (x >= s.x && x <= s.x + 150 && y>= s.y && y <= s.y + 150) {
                    setDraggingSticker(i);
                    setSelectedSticker(i);
                    setDragOffset({x: x-s.x, y: y-s.y});
                    return;
                }
            }
        }
    };

    const handleMouseMove = e => {
        const {x,y} = getCoords(e);

        if (draggingPhoto !== null && mode === "photo") {
            setPhotos(prev => {
                const updated = [...prev];
                const p = updated[draggingPhoto];
                const slot = slots[p.slotIndex];
                const w = p.img.width * p.scale;
                const h = p.img.height * p.scale;

                p.offsetX = x - slot.x - dragOffset.x;
                p.offsetY = y - slot.y - dragOffset.y;
                p.offsetX = Math.min(Math.max(p.offsetX, SLOT_WIDTH - w), 0);
                p.offsetY = Math.min(Math.max(p.offsetY, SLOT_HEIGHT - h),0);

                return updated;
            });
        }

        if (draggingSticker != null && mode === "decorate") {
            setStickers(s => {
                const u = [...s];
                u[draggingSticker] = {
                    ...u[draggingSticker],
                    x: x - dragOffset.x,
                    y: y - dragOffset.y
                };
                return u;
            });
        }
    };

    const handleMouseUp = () => {
        setDraggingPhoto(null);
        setDraggingSticker(null);
    };

    // add Sticker
    const addSticker = src => {
        const img = new Image();
        img.src = src;
        img.onload = () =>
            setStickers(s => [...s, {img, x: 400, y: 100}]);
    };

    // delete Sticker
    useEffect(() => {
        const handleKeyDown = e => {
            if (
                (e.key === "Delete" || e.key === "Backspace") &&
                selectedSticker != null &&
                mode === "decorate"
            ){
                setStickers(s => s.filter((_,i) => i !== selectedSticker));
                setSelectedSticker(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedSticker,mode]);

    //download

    const downloadPhoto = () => {
       playDownloadSound();
        setTimeout(() => {
        const a = document.createElement("a");
        a.href = canvasRef.current.toDataURL("image/png", 1.0);
        a.download = `photobooth_${Date.now()}.png`;
        a.click();
        }, 100);
    };

    return (
        <div style={centerCol}>
            {/* top bar with back btn and text */}
            <div style={topBar}>
                {selectedFrame && (
                    <button
                        style={{
                            ...buttonStyle,
                            position: "absolute",
                            left: 0,
                            top: 10,
                            height: 40,
                            padding: "0 16px",
                            lineHeight: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    onClick={handleBack}
                    > ← Trở về</button>
                )}

                <h1 style={titleBar}>
                    {!selectedFrame
                        ? "₊✩‧₊˚ Chọn phông nền đi nào các vợ ౨ৎ ˚₊✩‧₊"
                        : mode === "photo"
                            ? "⋆｡‧˚ʚ Photobooth giờ của các vợ đó :)?ɞ˚‧｡⋆"
                            : ". ݁₊ ⊹ . ݁Thành quả của các vợ đây . ⊹ ₊ ݁."}

                </h1>
            </div>
            <div style={mainContent} >
                {!selectedFrame ? (
                   <div style={frameGrid}>
                    
                        {frameOptions.map((src) => {
                            const isSelected = selectedFrame === src;

                            return (
                                <img
                                    key={src}
                                    src={src}
                                    alt="frame"
                                    onClick={() => setSelectedFrame(src)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.08)";
                                        e.currentTarget.style.boxShadow = "0 12px 30px rgba(255,122,162,0.45)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.boxShadow = frameThumb.boxShadow;

                                    }}
                                    style={{
                                        ...frameThumb,
                                        transform: isSelected ? "scale(1.08)" : "scale(1)",
                                        transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                        boxShadow: isSelected ? "0 12px 30px rgba(255,122,162,0.45)" : frameThumb.boxShadow,
                                    }}

                                />
                            )
                        })}
                    </div>
                ) : (
                    <div style={row}>
                        <div>
                            {mode === "photo" && (
                                <>
                                    <div style={{ position: "relative", width: "90%", maxWidth: 1100 }}>
                                        {/* Webcam */}
                                   <Webcam
                                            ref={webcamRef}
                                            screenshotFormat="image/png"
                                            videoConstraints={videoConstraints}
                                            style={{
                                            width: "100%",
                                            borderRadius: 16,
                                            border: "4px solid #fff",
                                            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                            filter: filter
                                            }}
                                             mirrored={true}
                                            />
                                            {mode === "photo" && (
  <div style={{
    marginTop: 12,
    width: "100%",
    overflowX: "auto"
  }}>
    <div style={{
      display: "flex",
      gap: 10,
      padding: "6px 4px"
    }}>

      <button style={filterBtn(filter==="none")} onClick={() => setFilter("none")}>
        🌸 Normal
      </button>

      <button style={filterBtn(filter==="grayscale(1)")} onClick={() => setFilter("grayscale(1)")}>
        🖤 B&W
      </button>

      <button style={filterBtn(filter==="sepia(1)")} onClick={() => setFilter("sepia(1)")}>
        🧡 Vintage
      </button>

      <button style={filterBtn(filter==="brightness(1.2)")} onClick={() => setFilter("brightness(1.2)")}>
        ✨ Bright
      </button>

      <button style={filterBtn(filter==="contrast(1.5)")} onClick={() => setFilter("contrast(1.5)")}>
        🎞 Contrast
      </button>

      <button style={filterBtn(filter==="brightness(1.1) contrast(1.1) saturate(1.3)")} 
        onClick={() => setFilter("brightness(1.1) contrast(1.1) saturate(1.3)")}>
        💖 Cute
      </button>

    </div>
  </div>
)}

                                        {/* Overlay countdown */}

                                        {countdown != null && (
                                            <div style = {{
                                                position: "absolute",
                                                inset: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 96,
                                                fontWeight: "bold",
                                                color: "white",
                                                textShadow: "0 4px 20px rgba(0,0,0,0.6)",
                                                background: "rgba(0,0,0,0.25)",
                                                borderRadius: 12,
                                                pointerEvents: "none",
                                            }}
                                            >
                                                {countdown}
                                                </div>
                                        )}
                                    </div>

                                    {/* Buttons */}
                                    <div style = {{marginTop: 16, display: "flex", gap:12}}>
                                        {canTakePhoto && !autoMode &&  (
                                            <><button
  style={buttonStyle}
  onClick={() =>
    setFacingMode(prev => prev === "user" ? "environment" : "user")
  }
>
  Đổi Camera
</button>
                                                <button style={buttonStyle} onClick={capturePhoto}>
                                                    Chụp ảnh
                                                </button>
                                                <button
                                                    style={{
                                                        ...buttonStyle,
                                                        background: "linear-gradient(135deg, #84fab0, #8fd3f4)"
                                                    }}
                                                    onClick={startAutoCapture}
                                                >
                                                    Auto chụp 📸
                                                </button>
                                                <label style={{...buttonStyle, cursor: "pointer"}}>
                                                    Tải ảnh lên
                                                    <input
                                                        type="file"
                                                        accept="image /*"
                                                        onChange={uploadPhoto}
                                                        style={{ display: "none"}}
                                                        />
                                                </label>
                                            </>
                                        )}
                                        {/* redo btn */}
                                        {autoMode ? (
    <button
        style={{
            ...buttonStyle,
            background: "linear-gradient(135deg, #ff6a88, #ff3d68)"
        }}
        onClick={stopAutoCapture}
    >
        ⛔ Dừng
    </button>
) : (
    photoCount > 0 && (
        <button
            style={{
                ...buttonStyle,
                fontSize: 22,
                padding: "4px 10px"
            }}
            onClick={redoLastPhoto}
        >
            ⟳
        </button>
    )
)}

                                    </div>
                                </>
                            )}

                            {mode === "decorate" && (
                                stickerOptions.map((src) => (
                                    <img
                                        key={src}
                                        src={src}
                                        alt="sticker"
                                        onClick={() => addSticker(src)}
                                        style={{ width: 50, cursor: "pointer"}}
                                    />
                                ))
                            )
                            }
                        </div>

                        {/* Display frame */}
                            <div>
                                <canvas ref={canvasRef}
                                style={{
                                    width: 200,
                                    height: 500,
                                    borderRadius: 16,
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                />

                                {mode === "decorate" && (
                                <div style={{
                                    marginTop: 16,
                                    display:"flex",
                                    justifyContent: "center",
                                }}>
                                    <button style={buttonStyle} onClick={downloadPhoto}>
                                        Download
                                    </button>
                                </div>
                                )}
                            </div>
                    </div>
                )
                }
            </div>
        </div>
    )
}

// styles
const centerCol = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 20,

  minHeight: "100vh",
  width: "100%",
  background: "linear-gradient(135deg, #ffe4ec, #e0f7fa)",
  padding: "20px 0"
};
const topBar = {
  width: 750,
  height: 60,
  position: "relative",
  marginBottom: 20,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  background: "linear-gradient(135deg, #ffdde1, #ee9ca7)",
  borderRadius: 16,

  boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
};
const buttonStyle = {
  padding: "12px 26px",
  fontSize: 16,
  cursor: "pointer",

  fontFamily: "'Baloo 2', cursive",
  color: "#fff",

  border: "none",
  borderRadius: 999,

  background: "linear-gradient(135deg, #ff7eb3, #ff758c)",

  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  textShadow: "0 1px 2px rgba(0,0,0,0.3)",

  transition: "all 0.25s ease"
};
const row = { display: "flex", gap: 40, alignItems: "flex-start" };
const frameThumb = {
    width: 180,
    cursor: "pointer",
    borderRadius: 12,
    boxShadow: "0 8px 8px rgba(0,0,0,0.15)"
};
const frameGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 20,
  width: "95%",
maxWidth: 1000,
  padding: "10px 5px",

  maxHeight: 450,       // 🔥 giới hạn chiều cao
  overflowY: "auto",    // 🔥 cho scroll
};
const titleBar = {
  margin: 0,
  lineHeight: "60px",
  textAlign: "center",
  width: "100%",

  fontFamily: "'Baloo 2', cursive",
  fontSize: "21px",
  color: "#8c5b4a",

  letterSpacing: "1px",
  textShadow: "0 3px 8px rgba(0,0,0,0.1)",

  transition: "all 0.3s ease"
};
const mainContent = {
  height: 600,
  width: 750,

  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(10px)",

  borderRadius: 20,
  padding: 20,

  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",

  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};
