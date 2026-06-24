"use client";
import { useState } from "react";
import { RiArrowDownSLine, RiMessage2Line, RiPhoneLine, RiExternalLinkLine } from "react-icons/ri";
import { mockFAQs } from "../lib/mockData";

export default function SupportTab() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div style={{ padding: "0 16px 24px" }}>
      {/* AI Chat embed */}
      <div className="animate-fade-up card" style={{ overflow: "hidden", marginBottom: 16 }}>
        <div style={{
          padding: "16px 18px",
          background: "linear-gradient(135deg, var(--green-700) 0%, var(--green-600) 100%)",
          display: "flex", alignItems: "center", gap: 12
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <RiMessage2Line size={18} style={{ color: "white" }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Chat with FSS Support</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Available in English & Pidgin · 24/7</p>
          </div>
        </div>

        {/* ElevenLabs widget placeholder */}
        <div style={{
          padding: "20px 18px", background: "var(--surface-2)",
          borderTop: "1px solid var(--border)", minHeight: 120,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8
        }}>
          {/*
            ─── WIRE-UP POINT ──────────────────────────────────────────
            Replace this block with your ElevenLabs Convai widget embed:

            <elevenlabs-convai agent-id="your-agent-id"></elevenlabs-convai>
            <script src="https://elevenlabs.io/convai-widget/index.js" async></script>
            ────────────────────────────────────────────────────────────
          */}
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--green-50)", border: "2px solid var(--green-200)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <RiMessage2Line size={22} style={{ color: "var(--green-700)" }} />
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>AI Voice Support</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5, maxWidth: 220 }}>
            Have a complaint or question? Click to start a voice or text conversation with our AI agent.
          </p>
          <button style={{
            padding: "10px 20px", borderRadius: 9999,
            background: "var(--green-700)", border: "none",
            color: "white", fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 6
          }}>
            <RiMessage2Line size={13} />
            Chat with us
          </button>
          <p style={{ fontSize: 10, color: "var(--text-muted)", fontStyle: "italic" }}>ElevenLabs widget loads here</p>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <a
        href="https://wa.me/2349133498462"
        target="_blank"
        rel="noopener noreferrer"
        className="animate-fade-up stagger-1 tap-scale"
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 16px", marginBottom: 16,
          background: "#25D366", borderRadius: 14, textDecoration: "none"
        }}
      >
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <RiPhoneLine size={18} style={{ color: "white" }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "white" }}>WhatsApp a Human Agent</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Mon–Fri, 8am–6pm · +234 913 349 8462</p>
        </div>
        <RiExternalLinkLine size={15} style={{ color: "rgba(255,255,255,0.7)", flexShrink: 0 }} />
      </a>

      {/* FAQ */}
      <p className="section-header animate-fade-up stagger-2">Frequently Asked Questions</p>

      <div className="animate-fade-up stagger-3" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {mockFAQs.map((faq, i) => (
          <div key={i} className="card" style={{ overflow: "hidden" }}>
            <button
              onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
              style={{
                width: "100%", padding: "16px 16px",
                display: "flex", alignItems: "center", gap: 12,
                background: "none", border: "none", cursor: "pointer",
                textAlign: "left", fontFamily: "inherit"
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>{faq.q}</p>
              </div>
              <RiArrowDownSLine
                size={18}
                style={{
                  color: "var(--text-muted)", flexShrink: 0,
                  transform: openFAQ === i ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s"
                }}
              />
            </button>

            {openFAQ === i && (
              <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                  {faq.a.replace(/\*\*(.*?)\*\*/g, "$1")}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* About FSS */}
      <div className="animate-fade-up stagger-4 card-padded" style={{ marginTop: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>🏢 About FSS Recoveries</p>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          FSS Recoveries (Fintech Solutions Limited) is a licensed, professional debt recovery company operating in Nigeria and Kenya on behalf of licensed financial institutions.
          {"\n\n"}
          We are authorised representatives of the lending institution. Our team works within the framework of the Central Bank of Nigeria and CBK regulations, and we are committed to treating every borrower with dignity and respect.
          {"\n\n"}
          If you believe this contact is in error, please reach out via WhatsApp above.
        </p>
      </div>
    </div>
  );
}
