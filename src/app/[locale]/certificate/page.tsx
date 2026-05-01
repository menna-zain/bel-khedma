"use client";
import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { FaHandsHelping } from "react-icons/fa";
import axios from "axios";

const G = "#007A55";
const GD = "#005a3e";
const GL = "#e6f4ef";
const GOLD = "#c9a84c";

type CertificateProps = {
  name: string;
  hours: number;
};

type HoursData = {
  current: number;
  goal: number;
  progress: string;
};




export default function BilkhidmahCertificate({
  hours = 120,
}: CertificateProps) {
  const certRef = useRef<HTMLDivElement | null>(null);
  const [namee, setName] = useState("اسم المتطوع");
  const today = new Date().toLocaleDateString("ar-SA-u-ca-islamic", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  
 const [hoursData, setHoursData] = useState<HoursData | null>(null);
   const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchHours = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://bilkhidmah-api.vercel.app/api/v1/volunteers/hours",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setHoursData(res.data.data);
        console.log(hoursData)
      } catch (err: any) {
        console.error("ERROR:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHours();
  }, []);

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);

    try {
      const dataUrl = await toPng(certRef.current, {
        // scale: 3,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();

      pdf.addImage(dataUrl, "PNG", 0, 0, w, h);
      pdf.save(
        `bilkhidmah-certificate-${(namee || "certificate").replace(/\s+/g, "-")}.pdf`,
      );
    } catch (e: any) {
      alert("PDF error: " + e.message);
    }

    setDownloading(false);
  };

  return (
    <>
      <nav
        className={`flex items-center justify-between p-4 bg-white border-b border-gray-300 sticky top-0 left-0 w-full  shadow-md z-50`}
        // dir={direction}
      >
        {/* اللوجو واسم الخدمة */}
        <div className="flex items-center gap-2">
          <FaHandsHelping size={30} className="text-emerald-700" />
          <span className="font-bold text-2xl text-black">
            {/* {t("serviceName")} */}
            بالخدمة
          </span>
        </div>
      </nav>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        .bk-page { min-height:100vh; background:linear-gradient(160deg,#e8f2ee,#f5f9f7,#eaf3ef); display:flex; flex-direction:column; align-items:center; padding:40px 20px; gap:32px; direction:rtl; font-family:'Tajawal',sans-serif; }
        .bk-brand { display:flex; align-items:center; gap:12px; background:${G}; border-radius:14px; padding:16px 28px; width:100%;  }
        .bk-brand-logo { width:44px; height:44px; background:white; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .bk-brand-name { font-family:'Amiri',serif; font-size:1.5rem; color:white; font-weight:700; }
        .bk-brand-sub  { font-size:.75rem; color:rgba(255,255,255,.6); font-weight:300; }
        .bk-panel { background:white; border:1px solid #c2dfd6; border-radius:16px; padding:28px 32px; width:100%; max-width:900px; display:grid; grid-template-columns:1fr 1fr; gap:16px 24px; box-shadow:0 4px 24px rgba(0,122,85,.07); }
        .bk-panel-title { grid-column:1/-1; font-size:1rem; font-weight:700; color:${G}; border-bottom:2px solid #e6f4ef; padding-bottom:12px; }
        .bk-field { display:flex; flex-direction:column; gap:6px; }
        .bk-field label { font-size:.8rem; color:#555; font-weight:500; }
        .bk-field input { background:#fafafa; border:1.5px solid #c2dfd6; border-radius:9px; padding:10px 14px; color:#0d0d0d; font-family:'Tajawal',sans-serif; font-size:1rem; outline:none; transition:.2s; direction:rtl; text-align:right; }
        .bk-field input:focus { border-color:${G}; box-shadow:0 0 0 3px rgba(0,122,85,.1); }
        .bk-btns { grid-column:1/-1; display:flex; gap:12px; direction:ltr; }
        .bk-btn { flex:1; padding:12px 24px; border-radius:10px; font-family:'Tajawal',sans-serif; font-size:.9rem; font-weight:600; cursor:pointer; transition:.25s; border:none; }
        .bk-btn-p { background:${G}; color:white; box-shadow:0 4px 16px rgba(0,122,85,.3); }
        .bk-btn-p:hover { background:${GD}; transform:translateY(-1px); }
        .bk-btn-p:disabled { opacity:.55; cursor:not-allowed; transform:none; }
        .bk-btn-s { background:transparent; border:1.5px solid #c2dfd6; color:${G}; }
        .bk-btn-s:hover { border-color:${G}; background:#e6f4ef; }
        @media(max-width:600px){ .bk-panel{grid-template-columns:1fr} }
      `}</style>

      <div className="bk-page">
        {/* Controls */}
        <div
          className="bk-panel"
          style={{ gridTemplateColumns: "1fr auto", alignItems: "end" }}
        >
          <div className="bk-field">
            {/* <label>اسم المتطوع</label> */}
            <input value={namee} onChange={(e) => setName(e.target.value)} />
          </div>

          <button
            className="bk-btn bk-btn-p"
            onClick={handleDownload}
            disabled={downloading}
            style={{ height: "fit-content" }}
          >
            {downloading ? "جاري التحميل…" : "⬇ تحميل PDF"}
          </button>
        </div>

        {/* Certificate */}
        <div style={{ width: "100%", maxWidth: 960 }}>
          <div
            ref={certRef}
            style={{
              width: "100%",
              background: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontFamily: "'Tajawal',sans-serif",
              direction: "rtl",
              aspectRatio: "1.414/1",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Header */}
            <div
              style={{
                width: "100%",
                background: G,
                padding: "3.5% 6% 3%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "white",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaHandsHelping size={30} className="text-emerald-700" />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Amiri',serif",
                      fontSize: "clamp(1rem,2.5vw,1.6rem)",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    بالخدمة
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(.45rem,1.1vw,.7rem)",
                      color: "rgba(255,255,255,.6)",
                      fontWeight: 300,
                    }}
                  >
                    Bilkhidmah · منصة التطوع
                  </div>
                </div>
              </div>
              {/* Emblem */}
              <svg
                width="70"
                height="70"
                viewBox="0 0 70 70"
                fill="none"
                opacity="0.92"
              >
                <line
                  x1="35"
                  y1="58"
                  x2="35"
                  y2="30"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M35 35 Q28 30 22 32 Q28 28 35 32"
                  fill="white"
                  opacity="0.85"
                />
                <path
                  d="M35 35 Q42 30 48 32 Q42 28 35 32"
                  fill="white"
                  opacity="0.85"
                />
                <path
                  d="M35 31 Q30 25 26 26 Q31 22 35 28"
                  fill="white"
                  opacity="0.7"
                />
                <path
                  d="M35 31 Q40 25 44 26 Q39 22 35 28"
                  fill="white"
                  opacity="0.7"
                />
                <ellipse
                  cx="35"
                  cy="29"
                  rx="3"
                  ry="3"
                  fill="white"
                  opacity="0.6"
                />
                <line
                  x1="15"
                  y1="52"
                  x2="55"
                  y2="62"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="55"
                  y1="52"
                  x2="15"
                  y2="62"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="35" cy="57" r="3" fill="white" opacity="0.7" />
                <circle cx="20" cy="18" r="2" fill="white" opacity="0.5" />
                <circle cx="50" cy="18" r="2" fill="white" opacity="0.5" />
                <circle cx="35" cy="13" r="2.5" fill="white" opacity="0.7" />
                <circle
                  cx="35"
                  cy="35"
                  r="32"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                />
              </svg>
            </div>

            {/* Gold band */}
            <div
              style={{
                width: "100%",
                height: "clamp(8px,1.5%,14px)",
                background: `linear-gradient(90deg,${GOLD},#e8d5a3,${GOLD})`,
                flexShrink: 0,
              }}
            />

            {/* Body */}
            <div
              style={{
                flex: 1,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "3% 8%",
                position: "relative",
              }}
            >
              {/* Watermark */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  opacity: 0.04,
                }}
              >
                <svg width="55%" height="55%" viewBox="0 0 200 200" fill="none">
                  <g stroke="#007A55" strokeWidth="0.8">
                    <polygon
                      points="100,20 115,85 170,70 125,100 170,130 115,115 100,180 85,115 30,130 75,100 30,70 85,85"
                      fill="none"
                    />
                    <circle cx="100" cy="100" r="60" fill="none" />
                    <circle
                      cx="100"
                      cy="100"
                      r="40"
                      fill="none"
                      opacity="0.5"
                    />
                    <line x1="100" y1="20" x2="100" y2="180" />
                    <line x1="20" y1="100" x2="180" y2="100" />
                    <line x1="43" y1="43" x2="157" y2="157" />
                    <line x1="157" y1="43" x2="43" y2="157" />
                  </g>
                </svg>
              </div>

              <p
                style={{
                  fontFamily: "'Amiri',serif",
                  fontSize: "clamp(.5rem,1.2vw,.78rem)",
                  color: G,
                  letterSpacing: ".3em",
                  textTransform: "uppercase",
                  marginBottom: "clamp(4px,1%,10px)",
                }}
              >
                شهادة تقدير وعرفان
              </p>

              <h1
                style={{
                  fontFamily: "'Amiri',serif",
                  fontSize: "clamp(1.2rem,3.8vw,2.8rem)",
                  color: "#0d0d0d",
                  fontWeight: 700,
                  textAlign: "center",
                  lineHeight: 1.2,
                  marginBottom: "clamp(2px,.5%,8px)",
                }}
              >
                شهادة إتمام ساعات التطوع
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "50%",
                  margin: "clamp(6px,1.2%,14px) 0",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: `linear-gradient(to left,transparent,${GOLD},transparent)`,
                  }}
                />
                <div
                  style={{
                    width: 7,
                    height: 7,
                    background: GOLD,
                    transform: "rotate(45deg)",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: `linear-gradient(to right,transparent,${GOLD},transparent)`,
                  }}
                />
              </div>

              <p
                style={{
                  fontSize: "clamp(.55rem,1.3vw,.88rem)",
                  color: "#666",
                  marginBottom: "clamp(2px,.5%,6px)",
                  textAlign: "center",
                }}
              >
                تُقدِّم منصة <strong style={{ color: G }}>بالخدمة</strong> هذه
                الشهادة إلى المتطوع المتميز
              </p>

              <h2
                style={{
                  fontFamily: "'Amiri',serif",
                  fontSize: "clamp(1.3rem,4.2vw,3rem)",
                  color: G,
                  fontWeight: 700,
                  textAlign: "center",
                  lineHeight: 1.15,
                  marginBottom: "clamp(2px,.4%,6px)",
                }}
              >
                {namee || "اسم المتطوع"}
              </h2>
              <div
                style={{
                  width: "45%",
                  height: 2,
                  background: `linear-gradient(to left,transparent,${G},transparent)`,
                  marginBottom: "clamp(6px,1.2%,14px)",
                }}
              />

              <p
                style={{
                  fontSize: "clamp(.5rem,1.15vw,.82rem)",
                  color: "#555",
                  textAlign: "center",
                  lineHeight: 1.7,
                  maxWidth: "80%",
                  marginBottom: "clamp(6px,1.2%,14px)",
                }}
              >
                تقديرًا لجهوده المثمرة وإسهاماته القيّمة في خدمة المجتمع ضمن{" "}
                <strong style={{ color: G }}>فريق عمل بالخدمة</strong>
              </p>

              {/* Hours badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  border: `2px solid ${G}`,
                  marginBottom: "clamp(6px,1.2%,14px)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: G,
                    color: "white",
                    padding: "clamp(6px,1.5%,12px) clamp(10px,2.5%,24px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Tajawal',sans-serif",
                      fontSize: "clamp(1.2rem,3.5vw,2.4rem)",
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {hoursData?.goal || "0"}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(.35rem,.7vw,.52rem)",
                      opacity: 0.8,
                      letterSpacing: ".1em",
                    }}
                  >
                    ساعة تطوع
                  </div>
                </div>
                <div
                  style={{
                    padding: "clamp(6px,1.2%,10px) clamp(10px,2.2%,20px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 2,
                  }}
                ></div>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  width: "88%",
                  marginTop: "auto",
                  paddingTop: "clamp(4px,1%,10px)",
                }}
              >
                {[
                  { label: "التوقيع والاعتماد", val: "فريق عمل بالخدمة" },
                  null,
                  { label: "تاريخ الإصدار", val: today },
                ].map((sig, i) =>
                  sig === null ? (
                    <svg
                      key="seal"
                      width="70"
                      height="70"
                      viewBox="0 0 70 70"
                      fill="none"
                    >
                      <circle
                        cx="35"
                        cy="35"
                        r="33"
                        stroke={G}
                        strokeWidth="1.5"
                        strokeDasharray="4 2.5"
                      />
                      <circle
                        cx="35"
                        cy="35"
                        r="27"
                        stroke={GOLD}
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                      <circle
                        cx="35"
                        cy="35"
                        r="22"
                        stroke={G}
                        strokeWidth="0.8"
                      />
                      <circle
                        cx="35"
                        cy="35"
                        r="10"
                        fill="rgba(0,122,85,0.08)"
                        stroke={G}
                        strokeWidth="0.6"
                      />
                      <text
                        x="35"
                        y="31"
                        textAnchor="middle"
                        fill={G}
                        fontSize="5.5"
                        fontFamily="Tajawal,sans-serif"
                        fontWeight="700"
                      >
                        بالخدمة
                      </text>
                      <text
                        x="35"
                        y="39"
                        textAnchor="middle"
                        fill={GOLD}
                        fontSize="4"
                        fontFamily="Tajawal,sans-serif"
                      >
                        رسمي ✦
                      </text>
                      <circle cx="35" cy="3.5" r="1.5" fill={GOLD} />
                      <circle cx="35" cy="66.5" r="1.5" fill={GOLD} />
                      <circle cx="3.5" cy="35" r="1.5" fill={GOLD} />
                      <circle cx="66.5" cy="35" r="1.5" fill={GOLD} />
                    </svg>
                  ) : (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: 90,
                          height: 1,
                          background: "#ccc",
                          marginBottom: 3,
                        }}
                      />
                      <div
                        style={{
                          fontSize: "clamp(.35rem,.72vw,.52rem)",
                          color: "#aaa",
                          letterSpacing: ".1em",
                        }}
                      >
                        {sig.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Amiri',serif",
                          fontSize: "clamp(.45rem,.95vw,.68rem)",
                          color: "#555",
                          fontStyle: "italic",
                        }}
                      >
                        {sig.val}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Bottom bar */}
            <div
              style={{
                width: "100%",
                background: G,
                height: "clamp(8px,1.8%,16px)",
                flexShrink: 0,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
