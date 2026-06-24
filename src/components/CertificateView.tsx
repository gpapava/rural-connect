"use client";

import { Printer, Download } from "lucide-react";

interface CertificateViewProps {
  id: string;
  neetName: string;
  counselorName: string;
  issuedAt: Date;
}

const STAGE_NAMES = [
  "Learning the Platform",
  "Previous Experience",
  "Why You Need an Opportunity",
  "Confidence & Orientation",
  "Career Opportunities",
];

export default function CertificateView({
  neetName,
  counselorName,
  issuedAt,
}: CertificateViewProps) {
  const handlePrint = () => window.print();

  const formatted = new Date(issuedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <style>{`
        @media print {
          html, body { margin: 0; padding: 0; background: white; }
          .no-print { display: none !important; }
          #certificate-paper {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            margin: 0 !important; padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>

      {/* Screen wrapper */}
      <div className="no-print min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-start py-10 px-4 gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-[#1e293b] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#0f172a] transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-[#1a73e8]/30 bg-white px-5 py-2.5 text-sm font-semibold text-[#1a73e8] shadow-sm hover:bg-blue-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>

        <p className="no-print text-xs text-gray-400">
          In the print dialog, choose "Save as PDF" and set paper to A4 Landscape for best results.
        </p>
      </div>

      {/* The actual certificate — always rendered, visible both on screen and in print */}
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 print:bg-white print:min-h-0 no-print:hidden print:flex">
        <CertificatePaper neetName={neetName} counselorName={counselorName} formatted={formatted} />
      </div>

      {/* Duplicate that shows on screen below the buttons */}
      <div className="no-print flex justify-center pb-12">
        <CertificatePaper neetName={neetName} counselorName={counselorName} formatted={formatted} />
      </div>
    </>
  );
}

function CertificatePaper({
  neetName,
  counselorName,
  formatted,
}: {
  neetName: string;
  counselorName: string;
  formatted: string;
}) {
  return (
    <div
      id="certificate-paper"
      style={{
        width: "297mm",
        minHeight: "210mm",
        background: "white",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        borderRadius: "4px",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Outer decorative border */}
      <div style={{
        position: "absolute", inset: "12px",
        border: "2px solid #1e293b",
        pointerEvents: "none",
        zIndex: 1,
      }} />
      {/* Inner gold border */}
      <div style={{
        position: "absolute", inset: "18px",
        border: "1px solid #c9a84c",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Corner ornaments */}
      {[
        { top: "24px", left: "24px" },
        { top: "24px", right: "24px" },
        { bottom: "24px", left: "24px" },
        { bottom: "24px", right: "24px" },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute", ...pos,
          width: "20px", height: "20px",
          background: "#c9a84c",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          zIndex: 2,
        }} />
      ))}

      {/* Background watermark */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: 0.03, pointerEvents: "none", zIndex: 0,
        fontSize: "180px", fontWeight: "bold", color: "#1e293b",
        letterSpacing: "-4px", userSelect: "none",
      }}>
        RC
      </div>

      {/* Top dark band */}
      <div style={{
        background: "#1e293b",
        padding: "18px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 3,
      }}>
        {/* Left: Logo + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "44px", height: "44px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #1a73e8, #0d47a1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", fontWeight: "bold", color: "white",
            fontFamily: "sans-serif",
            flexShrink: 0,
          }}>RC</div>
          <div>
            <div style={{ color: "white", fontSize: "18px", fontWeight: "bold", letterSpacing: "2px", fontFamily: "sans-serif" }}>
              RURAL-CONNECT
            </div>
            <div style={{ color: "#94a3b8", fontSize: "10px", letterSpacing: "1px", fontFamily: "sans-serif" }}>
              EMPOWERING NEET YOUTH IN RURAL COMMUNITIES
            </div>
          </div>
        </div>

        {/* Right: Erasmus+ badge */}
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#c9a84c", fontSize: "11px", fontWeight: "bold", letterSpacing: "2px", fontFamily: "sans-serif" }}>
            ERASMUS+ PROGRAMME
          </div>
          <div style={{ color: "#64748b", fontSize: "9px", letterSpacing: "1px", fontFamily: "sans-serif", marginTop: "2px" }}>
            CO-FUNDED BY THE EUROPEAN UNION
          </div>
          <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end", marginTop: "6px" }}>
            {["NO", "GR", "TR", "LV", "ES", "IT"].map((c) => (
              <div key={c} style={{
                width: "22px", height: "14px",
                background: "#334155",
                borderRadius: "2px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "8px", color: "#94a3b8", fontFamily: "sans-serif",
              }}>{c}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <div style={{ height: "4px", background: "linear-gradient(90deg, transparent, #c9a84c, #e8d082, #c9a84c, transparent)" }} />

      {/* Main content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "28px 64px 24px",
        position: "relative", zIndex: 3,
        textAlign: "center",
      }}>
        {/* Title */}
        <div style={{
          fontSize: "10px", letterSpacing: "4px", color: "#64748b",
          textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: "6px",
        }}>
          This is to certify that
        </div>

        {/* Recipient name */}
        <div style={{
          fontSize: "42px", fontWeight: "bold", color: "#1e293b",
          letterSpacing: "1px", lineHeight: 1.1, marginBottom: "10px",
          borderBottom: "2px solid #c9a84c",
          paddingBottom: "10px",
          minWidth: "300px",
        }}>
          {neetName}
        </div>

        {/* Body text */}
        <div style={{ fontSize: "13px", color: "#475569", lineHeight: 1.7, maxWidth: "520px", marginBottom: "16px" }}>
          has successfully completed the{" "}
          <strong style={{ color: "#1e293b" }}>RURAL-CONNECT Counselling Programme</strong>
          , a structured five-stage journey of personal development and employment support
          for NEET youth in rural communities across Europe.
        </div>

        {/* 5 stages strip */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap", justifyContent: "center" }}>
          {STAGE_NAMES.map((name, i) => (
            <div key={i} style={{
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "20px",
              padding: "3px 10px",
              fontSize: "9px",
              color: "#0369a1",
              fontFamily: "sans-serif",
              display: "flex", alignItems: "center", gap: "4px",
            }}>
              <span style={{
                width: "14px", height: "14px",
                background: "#0369a1",
                borderRadius: "50%",
                color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "8px", fontWeight: "bold", flexShrink: 0,
              }}>{i + 1}</span>
              {name}
            </div>
          ))}
        </div>

        {/* Bottom info row */}
        <div style={{
          display: "flex", gap: "48px", alignItems: "flex-start",
          borderTop: "1px solid #e2e8f0",
          paddingTop: "16px", width: "100%", justifyContent: "center",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "120px", borderBottom: "1px solid #94a3b8",
              marginBottom: "6px", height: "24px",
            }} />
            <div style={{ fontSize: "10px", color: "#64748b", fontFamily: "sans-serif" }}>Date of Issue</div>
            <div style={{ fontSize: "12px", fontWeight: "bold", color: "#1e293b", fontFamily: "sans-serif", marginTop: "2px" }}>
              {formatted}
            </div>
          </div>

          <div style={{
            width: "60px", height: "60px",
            border: "2px solid #c9a84c",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#fffbeb",
          }}>
            <div style={{ fontSize: "8px", textAlign: "center", color: "#92400e", fontFamily: "sans-serif", fontWeight: "bold", lineHeight: 1.2 }}>
              RURAL<br/>CONNECT<br/>✓
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "140px", borderBottom: "1px solid #94a3b8",
              marginBottom: "6px", height: "24px",
            }} />
            <div style={{ fontSize: "10px", color: "#64748b", fontFamily: "sans-serif" }}>Programme Counsellor</div>
            <div style={{ fontSize: "12px", fontWeight: "bold", color: "#1e293b", fontFamily: "sans-serif", marginTop: "2px" }}>
              {counselorName}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gold bar */}
      <div style={{ height: "4px", background: "linear-gradient(90deg, transparent, #c9a84c, #e8d082, #c9a84c, transparent)" }} />

      {/* Footer */}
      <div style={{
        background: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
        padding: "8px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative", zIndex: 3,
      }}>
        <div style={{ fontSize: "8px", color: "#94a3b8", fontFamily: "sans-serif" }}>
          ruralconnect-app.eu · Erasmus+ Project 2024–2027
        </div>
        <div style={{ fontSize: "8px", color: "#94a3b8", fontFamily: "sans-serif" }}>
          This certificate is issued upon successful completion of all five counselling stages.
        </div>
        <div style={{ fontSize: "8px", color: "#94a3b8", fontFamily: "sans-serif" }}>
          Co-funded by the European Union
        </div>
      </div>
    </div>
  );
}
