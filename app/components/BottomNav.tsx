"use client";
import { RiHome4Line, RiBankCardLine, RiFileList3Line, RiUserLine, RiLifebuoyLine } from "react-icons/ri";

interface BottomNavProps {
  active: string;
  onNavigate: (tab: string) => void;
  notifCount?: number;
}

const tabs = [
  { id: "home", label: "Overview", icon: RiHome4Line },
  { id: "payments", label: "Payments", icon: RiBankCardLine },
  { id: "documents", label: "Docs", icon: RiFileList3Line },
  { id: "support", label: "Support", icon: RiLifebuoyLine },
  { id: "profile", label: "Profile", icon: RiUserLine },
];

export default function BottomNav({ active, onNavigate, notifCount = 0 }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: "4px 12px",
                background: "none", border: "none", cursor: "pointer",
                position: "relative",
                minWidth: 52,
              }}
            >
              <div style={{
                width: 36, height: 32,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 10,
                background: isActive ? "var(--green-50)" : "transparent",
                transition: "all 0.15s",
                position: "relative"
              }}>
                <Icon
                  size={20}
                  style={{
                    color: isActive ? "var(--green-700)" : "var(--text-muted)",
                    transition: "all 0.15s"
                  }}
                />
                {id === "home" && notifCount > 0 && (
                  <span className="notif-dot" />
                )}
              </div>
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--green-700)" : "var(--text-muted)",
                transition: "all 0.15s",
                letterSpacing: "0.02em"
              }}>
                {label}
              </span>
              {isActive && (
                <div style={{
                  position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                  width: 20, height: 3, borderRadius: 9999,
                  background: "var(--green-700)"
                }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
