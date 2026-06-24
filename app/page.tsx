"use client";
import { useState } from "react";
import OTPAuth from "./components/OTPAuth";
import BottomNav from "./components/BottomNav";
import AppHeader from "./components/AppHeader";
import HomeTab from "./components/HomeTab";
import PaymentsTab from "./components/PaymentsTab";
import SettlementTab from "./components/SettlementTab";
import DocumentsTab from "./components/DocumentsTab";
import SupportTab from "./components/SupportTab";
import ProfileTab from "./components/ProfileTab";
import { mockNotifications } from "./lib/mockData";

const DEMO_PHONE = "+2348012345678";

export default function PortalPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const unread = mockNotifications.filter(n => !n.read).length;

  if (!authenticated) {
    return <OTPAuth phone={DEMO_PHONE} onSuccess={() => setAuthenticated(true)} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case "home": return <HomeTab onNavigate={setActiveTab} />;
      case "payments": return <PaymentsTab onNavigate={setActiveTab} />;
      case "settlement": return <SettlementTab />;
      case "documents": return <DocumentsTab />;
      case "support": return <SupportTab />;
      case "profile": return <ProfileTab />;
      default: return <HomeTab onNavigate={setActiveTab} />;
    }
  };

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", position: "relative", background: "var(--surface-2)" }}>
      <AppHeader activeTab={activeTab} onNavigate={setActiveTab} onNotifClick={() => setActiveTab("profile")} />
      <main className="pb-nav" style={{ paddingTop: 16 }}>
        {renderTab()}
      </main>
      <BottomNav active={activeTab === "settlement" ? "home" : activeTab} onNavigate={setActiveTab} notifCount={unread} />
    </div>
  );
}
