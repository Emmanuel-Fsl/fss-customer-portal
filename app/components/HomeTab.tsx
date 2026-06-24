"use client";
import { useState } from "react";
import {
  RiStockLine, RiCalendarLine, RiBankLine, RiBankCardLine, RiShakeHandsLine,
  RiArrowRightSLine, RiAlertLine, RiCheckboxCircleLine, RiPriceTag3Line,
  RiInformationLine
} from "react-icons/ri";
import {
  mockCustomer, mockLoan, mockPTP,
  formatCurrency, formatDate, daysUntil
} from "../lib/mockData";

interface HomeTabProps {
  onNavigate: (tab: string) => void;
}

export default function HomeTab({ onNavigate }: HomeTabProps) {
  const [showCreditInfo, setShowCreditInfo] = useState(false);
  const progress = (mockLoan.totalPaid / mockLoan.originalAmount) * 100;
  const daysToExpiry = daysUntil(mockLoan.discountExpiry);
  const daysToPayment = daysUntil(mockLoan.nextPaymentDue);

  const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
    "Active": { bg: "#dcf5e0", text: "#1a7e2e", dot: "#22c55e" },
    "In Recovery": { bg: "#fff3dc", text: "#b45309", dot: "#f59e0b" },
    "Settled": { bg: "#dcefff", text: "#1d5fb0", dot: "#3b82f6" },
    "Legal": { bg: "#ffe0e0", text: "#b91c1c", dot: "#ef4444" },
  };
  const sc = statusColors[mockLoan.status];

  return (
    <div style={{ padding: "0 16px 24px" }}>
      {/* Hero Balance Card */}
      <div className="animate-fade-up" style={{
        background: "linear-gradient(145deg, #1B5E20 0%, #2E7D32 50%, #33691E 100%)",
        borderRadius: 20, padding: "24px 22px 22px",
        position: "relative", overflow: "hidden", marginBottom: 16
      }}>
        <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
        <div style={{ position:"absolute", bottom:-20, left:-20, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
          <div>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.55)", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>
              Outstanding Balance
            </p>
            <p style={{ fontSize:34, fontWeight:800, color:"white", letterSpacing:"-0.5px", lineHeight:1 }}>
              {formatCurrency(mockLoan.outstandingBalance)}
            </p>
          </div>
          <div style={{
            padding:"4px 10px", borderRadius:9999,
            background: sc.bg, display:"flex", alignItems:"center", gap:5
          }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background: sc.dot, animation: mockLoan.status === "In Recovery" ? "pulseGreen 2s infinite" : "none" }} />
            <span style={{ fontSize:11, fontWeight:700, color: sc.text, letterSpacing:"0.04em" }}>{mockLoan.status}</span>
          </div>
        </div>

        <div style={{ marginBottom:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.55)", fontWeight:600 }}>Repayment progress</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.80)", fontWeight:700 }}>
              {formatCurrency(mockLoan.totalPaid)} of {formatCurrency(mockLoan.originalAmount)}
            </span>
          </div>
          <div style={{ height:6, borderRadius:9999, background:"rgba(255,255,255,0.15)", overflow:"hidden" }}>
            <div style={{
              height:"100%", borderRadius:9999,
              background:"linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.65) 100%)",
              width:`${progress}%`, transition:"width 1s cubic-bezier(0.4,0,0.2,1)"
            }} />
          </div>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.55)" }}>{progress.toFixed(0)}% cleared</span>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.55)" }}>{mockCustomer.institution}</span>
        </div>
      </div>

      {/* Discount Banner */}
      {mockLoan.discountAvailable && (
        <div className="animate-fade-up stagger-1 tap-scale" onClick={() => onNavigate("settlement")} style={{
          background: "linear-gradient(135deg, #FFF8E1 0%, #FFFDE7 100%)",
          border: "1.5px solid #FDD835",
          borderRadius: 14, padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 16, cursor: "pointer"
        }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"#FFF59D", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <RiPriceTag3Line size={18} style={{ color:"#F57F17" }} />
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:13, fontWeight:800, color:"#5D4037" }}>
              You qualify for a {mockLoan.discountPercent}% settlement offer!
            </p>
            <p style={{ fontSize:11, color:"#8D6E63" }}>
              Save {formatCurrency(mockLoan.discountAmount)} · Expires in {daysToExpiry} days
            </p>
          </div>
          <RiArrowRightSLine size={18} style={{ color:"#8D6E63", flexShrink:0 }} />
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="animate-fade-up stagger-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        {[
          {
            icon: <RiStockLine size={16} style={{ color:"var(--green-700)" }} />,
            label: "Original Loan",
            value: formatCurrency(mockLoan.originalAmount),
            sub: `Disbursed ${formatDate(mockLoan.disbursementDate)}`
          },
          {
            icon: <RiAlertLine size={16} style={{ color:"#f59e0b" }} />,
            label: "Days in Arrears",
            value: `${mockLoan.daysInArrears} days`,
            sub: `Since ${formatDate(mockLoan.firstDefaultDate)}`,
            warn: true
          },
          {
            icon: <RiCalendarLine size={16} style={{ color:"var(--green-700)" }} />,
            label: "Next Payment",
            value: daysToPayment <= 7 ? `In ${daysToPayment}d` : formatDate(mockLoan.nextPaymentDue),
            sub: formatDate(mockLoan.nextPaymentDue),
            urgent: daysToPayment <= 3
          },
          {
            icon: <RiBankLine size={16} style={{ color:"var(--green-700)" }} />,
            label: "Loan Type",
            value: mockCustomer.loanType,
            sub: mockCustomer.institution
          },
        ].map((item, i) => (
          <div key={i} className="card-padded" style={{ padding:"14px 14px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
              <div style={{ width:28, height:28, borderRadius:8, background: item.warn ? "#FFF3E0" : (item as any).urgent ? "#FFEBEE" : "var(--green-50)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {item.icon}
              </div>
              <span style={{ fontSize:10, color:"var(--text-muted)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{item.label}</span>
            </div>
            <p style={{ fontSize:15, fontWeight:800, color: (item as any).urgent ? "#dc2626" : "var(--text-primary)", lineHeight:1.1 }}>{item.value}</p>
            <p style={{ fontSize:10, color:"var(--text-muted)", marginTop:2, lineHeight:1.3 }}>{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Active PTP */}
      {mockPTP.active && (
        <div className="animate-fade-up stagger-3 card" style={{ padding:"16px", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"var(--green-50)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <RiCheckboxCircleLine size={18} style={{ color:"var(--green-700)" }} />
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12, fontWeight:700, color:"var(--text-primary)" }}>Active Promise to Pay</p>
              <p style={{ fontSize:11, color:"var(--text-muted)" }}>
                {formatCurrency(mockPTP.amount)} by {formatDate(mockPTP.date)} · {mockPTP.channel}
              </p>
            </div>
            <span style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:9999, background:"var(--green-50)", color:"var(--green-700)" }}>Active</span>
          </div>
        </div>
      )}

      {/* Credit Health teaser */}
      <div className="animate-fade-up stagger-4 card-padded tap-scale" onClick={() => setShowCreditInfo(!showCreditInfo)} style={{ marginBottom:16, cursor:"pointer" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"var(--green-50)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <RiInformationLine size={16} style={{ color:"var(--green-700)" }} />
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)" }}>Credit Health</p>
              <p style={{ fontSize:11, color:"var(--text-muted)" }}>What this loan means for your record</p>
            </div>
          </div>
          <RiArrowRightSLine size={18} style={{ color:"var(--text-muted)", transform: showCreditInfo ? "rotate(90deg)" : "none", transition:"0.2s" }} />
        </div>

        {showCreditInfo && (
          <div style={{ marginTop:16, borderTop:"1px solid var(--border)", paddingTop:16 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { icon:"⚠️", text: "Being in arrears is reported to credit bureaus and can affect your ability to get future loans." },
                { icon:"✅", text: "Clearing this loan removes your name from lenders' watchlists and improves your CRB score." },
                { icon:mockLoan.bvnBlacklisted ? "🔴" : "🟢", text: mockLoan.bvnBlacklisted ? "Your BVN is currently flagged. Settling will trigger a removal request." : "Your BVN is not on a blacklist — clearing this loan keeps it that way." },
              ].map((item, i) => (
                <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>{item.icon}</span>
                  <p style={{ fontSize:12, color:"var(--text-secondary)", lineHeight:1.5 }}>{item.text}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop:14, padding:"12px 14px", background:"var(--green-50)", borderRadius:10, borderLeft:"3px solid var(--green-600)" }}>
              <p style={{ fontSize:12, fontWeight:700, color:"var(--green-700)", marginBottom:4 }}>Steps to clear your record</p>
              {["Pay outstanding balance or accept settlement", "Obtain Clearance Certificate from this portal", "Submit to credit bureau via institution", "Allow 30–60 days for record to update"].map((step, i) => (
                <div key={i} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", background:"var(--green-600)", color:"white", fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
                  <p style={{ fontSize:11, color:"var(--text-secondary)" }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="animate-fade-up stagger-5" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <button className="tap-scale" onClick={() => onNavigate("payments")} style={{
          background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:14,
          padding:"16px 14px", display:"flex", flexDirection:"column", gap:6,
          cursor:"pointer", textAlign:"left"
        }}>
          <RiBankCardLine size={22} style={{ color:"var(--green-700)" }} />
          <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)" }}>View Payments</p>
          <p style={{ fontSize:11, color:"var(--text-muted)" }}>History & receipts</p>
        </button>
        <button className="tap-scale" onClick={() => onNavigate("settlement")} style={{
          background: mockLoan.discountAvailable ? "linear-gradient(135deg, var(--green-50) 0%, #E8F5E9 100%)" : "var(--surface)",
          border:`1.5px solid ${mockLoan.discountAvailable ? "var(--green-200)" : "var(--border)"}`,
          borderRadius:14, padding:"16px 14px",
          display:"flex", flexDirection:"column", gap:6,
          cursor:"pointer", textAlign:"left"
        }}>
          <RiShakeHandsLine size={22} style={{ color:"var(--green-700)" }} />
          <p style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)" }}>Settlement Offer</p>
          <p style={{ fontSize:11, color:"var(--text-muted)" }}>Save up to {mockLoan.discountPercent}%</p>
        </button>
      </div>
    </div>
  );
}
