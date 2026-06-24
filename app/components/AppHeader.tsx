"use client";
import { RiBellLine, RiArrowLeftLine } from "react-icons/ri";
import { mockCustomer, mockNotifications } from "../lib/mockData";

const tabTitles: Record<string, string> = {
  home: "My Loan",
  payments: "Payments",
  settlement: "Settlement Offer",
  documents: "Documents",
  support: "Support & Help",
  profile: "My Profile",
};

interface HeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onNotifClick: () => void;
}

export default function AppHeader({ activeTab, onNavigate, onNotifClick }: HeaderProps) {
  const unread = mockNotifications.filter(n => !n.read).length;
  const showBack = activeTab === "settlement";

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      padding: "14px 16px 10px",
      display: "flex", alignItems: "center", gap: 10
    }}>
      {showBack && (
        <button
          onClick={() => onNavigate("home")}
          style={{ width: 32, height: 32, borderRadius: 9, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
        >
          <RiArrowLeftLine size={16} style={{ color: "var(--text-secondary)" }} />
        </button>
      )}

      {!showBack && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <img src="/fss-logo.svg" alt="FSS logo" style={{ width: 28, height: 28, display: "block" }} />
          <span style={{ fontSize: 15, fontWeight: 800, color: "#000000", letterSpacing: "-0.2px" }}>fss.</span>
        </div>
      )}

      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
          {tabTitles[activeTab] || "Portal"}
        </h1>
        {activeTab === "home" && (
          <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 1 }}>
            {mockCustomer.name} · {mockCustomer.institution}
          </p>
        )}
      </div>

      <button
        onClick={onNotifClick}
        style={{
          width: 34, height: 34, borderRadius: 10,
          background: "var(--surface-2)", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative"
        }}
      >
        <RiBellLine size={17} style={{ color: "var(--text-secondary)" }} />
        {unread > 0 && (
          <div style={{
            position: "absolute", top: 6, right: 6,
            width: 7, height: 7, borderRadius: "50%",
            background: "#EF4444", border: "1.5px solid white"
          }} />
        )}
      </button>
    </div>
  );
}
