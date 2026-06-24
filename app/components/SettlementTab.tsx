"use client";
import { useState } from "react";
import { RiTimeLine, RiCheckboxCircleLine, RiFileTextLine, RiLineChartLine, RiLockUnlockLine } from "react-icons/ri";
import { mockLoan, formatCurrency, formatDate, daysUntil } from "../lib/mockData";
import PayNowSheet from "./PayNowSheet";
import RestructureSheet from "./RestructureSheet";

export default function SettlementTab() {
  const [accepted, setAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState<"full" | "instalment">("full");
  const [showPaySheet, setShowPaySheet] = useState(false);
  const [showRestructure, setShowRestructure] = useState(false);
  const daysLeft = daysUntil(mockLoan.discountExpiry);

  const segments = Math.ceil(mockLoan.settlementAmount / mockLoan.instalmentMonths);

  if (accepted) {
    return (
      <div style={{ padding: "0 16px 24px" }}>
        <div className="animate-fade-up card-padded" style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "var(--green-50)", border: "2px solid var(--green-200)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px"
          }}>
            <RiCheckboxCircleLine size={28} style={{ color: "var(--green-700)" }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Offer Accepted! 🎉</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
            An FSS agent will contact you within <strong>24 hours</strong> with payment instructions. Please keep your phone available.
          </p>
        </div>

        <div className="animate-fade-up stagger-1 card-padded">
          <p className="section-header">Settlement Summary</p>
          {[
            ["Original Balance", formatCurrency(mockLoan.outstandingBalance)],
            ["Discount (15%)", `-${formatCurrency(mockLoan.discountAmount)}`],
            ["Settlement Amount", formatCurrency(mockLoan.settlementAmount)],
            ["Offer Expires", formatDate(mockLoan.discountExpiry)],
          ].map(([label, value], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, marginBottom: 12, borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: i === 2 ? 800 : 600, color: i === 1 ? "var(--green-700)" : i === 2 ? "var(--text-primary)" : "var(--text-secondary)" }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="animate-fade-up stagger-2 card-padded" style={{ marginTop: 12 }}>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            <strong>What happens next?</strong><br />
            1. Agent contacts you with payment account details<br />
            2. You pay the settlement amount<br />
            3. We generate your Settlement Letter<br />
            4. Send it to your institution to clear your record
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 16px 24px" }}>
      {/* Countdown banner */}
      {mockLoan.discountAvailable && (
        <div className="animate-fade-up" style={{
          background: "linear-gradient(135deg, #F57F17 0%, #FF8F00 100%)",
          borderRadius: 16, padding: "16px 18px",
          display: "flex", alignItems: "center", gap: 14, marginBottom: 16
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
              Offer Expires In
            </p>
            <p style={{ fontSize: 28, fontWeight: 800, color: "white", lineHeight: 1 }}>{daysLeft} days</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{formatDate(mockLoan.discountExpiry)}</p>
          </div>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
          }}>
            <RiTimeLine size={22} style={{ color: "white" }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", fontWeight: 700, marginTop: 2 }}>HURRY</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="animate-fade-up stagger-1" style={{ display: "flex", background: "var(--surface-3)", borderRadius: 12, padding: 4, marginBottom: 16 }}>
        {[["full", "Full Settlement"], ["instalment", "Instalment Plan"]].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id as "full" | "instalment")} style={{
            flex: 1, padding: "8px 0", borderRadius: 9, border: "none", cursor: "pointer",
            background: activeTab === id ? "white" : "transparent",
            boxShadow: activeTab === id ? "var(--shadow-sm)" : "none",
            fontSize: 12, fontWeight: activeTab === id ? 700 : 600,
            color: activeTab === id ? "var(--text-primary)" : "var(--text-muted)",
            transition: "all 0.2s", fontFamily: "inherit"
          }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === "full" ? (
        <>
          <div className="animate-fade-up stagger-2 card" style={{ overflow: "visible", marginBottom: 16 }}>
            <div style={{ padding: "18px 18px 0" }}>
              <p className="section-header">Your Offer</p>
            </div>
            <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Outstanding balance</span>
                <span style={{ fontSize: 13, fontWeight: 600, textDecoration: "line-through", color: "var(--text-muted)" }}>
                  {formatCurrency(mockLoan.outstandingBalance)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Discount ({mockLoan.discountPercent}%)</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 9999, background: "var(--green-50)", color: "var(--green-700)" }}>YOU SAVE</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--green-700)" }}>-{formatCurrency(mockLoan.discountAmount)}</span>
              </div>
              <div style={{ height: 1, background: "var(--border)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>Settlement Amount</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "var(--green-700)" }}>{formatCurrency(mockLoan.settlementAmount)}</span>
              </div>
            </div>
            <div style={{ padding: "14px 18px", background: "var(--green-50)", borderTop: "1px solid var(--green-100)" }}>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                ✅ Paying this amount <strong>fully clears your loan</strong>. You'll receive a Clearance Certificate and can request removal from bureau records.
              </p>
            </div>
          </div>

          <div className="animate-fade-up stagger-3 card-padded" style={{ marginBottom: 16 }}>
            <p className="section-header">What Settlement Means</p>
            {[
              { icon: <RiCheckboxCircleLine size={18} style={{ color: "var(--green-700)" }} />, title: "Loan fully cleared", desc: "Your account is marked as settled in our system immediately." },
              { icon: <RiFileTextLine size={18} style={{ color: "var(--green-700)" }} />, title: "Settlement letter issued", desc: "Use it to notify your institution. They'll update your record within 30–60 days." },
              { icon: <RiLineChartLine size={18} style={{ color: "var(--green-700)" }} />, title: "Credit record improves", desc: "Settled status is better than in-arrears on your credit report." },
              { icon: <RiLockUnlockLine size={18} style={{ color: "var(--green-700)" }} />, title: "No more contact", desc: "All recovery communication stops the moment payment is confirmed." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 14 : 0, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary animate-fade-up stagger-4 tap-scale" onClick={() => setShowPaySheet(true)}>
            Accept Settlement Offer
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.5 }}>
            By accepting, an FSS agent will reach out with payment details. This does not charge you automatically.
          </p>
        </>
      ) : (
        <>
          <div className="animate-fade-up stagger-2 card-padded" style={{ marginBottom: 16 }}>
            <p className="section-header">Instalment Plan</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>
              Split your settlement over {mockLoan.instalmentMonths} months. Same discount applies.
            </p>

            {Array.from({ length: mockLoan.instalmentMonths }).map((_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() + i + 1);
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 0",
                  borderBottom: i < mockLoan.instalmentMonths - 1 ? "1px solid var(--border)" : "none"
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                    background: "var(--green-50)", border: "1px solid var(--green-200)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, color: "var(--green-700)"
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>
                      {date.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Instalment {i + 1} of {mockLoan.instalmentMonths}</p>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "var(--green-700)" }}>{formatCurrency(segments)}</p>
                </div>
              );
            })}

            <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--surface-3)", borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Total to pay</span>
                <span style={{ fontSize: 13, fontWeight: 800 }}>{formatCurrency(mockLoan.settlementAmount)}</span>
              </div>
            </div>
          </div>

          <button className="btn-primary animate-fade-up stagger-3 tap-scale" onClick={() => setShowRestructure(true)}>
            Accept Instalment Plan
          </button>
        </>
      )}

      {showPaySheet && (
        <PayNowSheet
          defaultAmount={mockLoan.settlementAmount}
          onClose={() => setShowPaySheet(false)}
          onSuccess={() => { setShowPaySheet(false); setAccepted(true); }}
        />
      )}
      {showRestructure && (
        <RestructureSheet
          defaultMonths={mockLoan.instalmentMonths}
          locked
          onClose={() => setShowRestructure(false)}
          onSuccess={() => { setShowRestructure(false); setAccepted(true); }}
        />
      )}
    </div>
  );
}
