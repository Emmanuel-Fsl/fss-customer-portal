"use client";
import { useState } from "react";
import { RiBellLine, RiCheckboxCircleLine, RiAlertLine } from "react-icons/ri";
import { mockCustomer, mockNotifications } from "../lib/mockData";

export default function ProfileTab() {
  const [prefs, setPrefs] = useState({
    contactMethod: mockCustomer.preferredContact,
    language: mockCustomer.language,
    smsOptIn: true,
    remindBefore3: true,
    remindBefore1: false,
  });
  const [numberSheet, setNumberSheet] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [numberRequested, setNumberRequested] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unread = notifications.filter(n => !n.read).length;

  const toggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const notifTypeColors: Record<string, { bg: string; color: string; icon: string }> = {
    success: { bg: "#dcf5e0", color: "#1a7e2e", icon: "✅" },
    reminder: { bg: "#FFF3E0", color: "#E65100", icon: "⏰" },
    offer: { bg: "#FFF8E1", color: "#F57F17", icon: "🏷️" },
    info: { bg: "var(--green-50)", color: "var(--green-700)", icon: "ℹ️" },
  };

  return (
    <div style={{ padding: "0 16px 24px" }}>
      {/* Profile header */}
      <div className="animate-fade-up" style={{
        background: "linear-gradient(145deg, #1B5E20 0%, #2E7D32 100%)",
        borderRadius: 20, padding: "20px 20px",
        display: "flex", alignItems: "center", gap: 14, marginBottom: 16
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 800, color: "white", flexShrink: 0
        }}>
          {mockCustomer.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: "white", lineHeight: 1.1 }}>{mockCustomer.name}</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{mockCustomer.phone}</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{mockCustomer.institution}</p>
        </div>
        <button
          style={{ position: "relative", width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
          onClick={() => { setNotifOpen(true); markAllRead(); }}
        >
          <RiBellLine size={17} style={{ color: "white" }} />
          {unread > 0 && (
            <div style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#EF4444", border: "1.5px solid var(--green-700)" }} />
          )}
        </button>
      </div>

      {/* Contact preferences */}
      <p className="section-header animate-fade-up stagger-1">Communication Preferences</p>

      <div className="animate-fade-up stagger-2 card-padded" style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 12 }}>Preferred contact method</p>
        <div style={{ display: "flex", gap: 8 }}>
          {(["Call", "WhatsApp", "SMS"] as const).map(method => (
            <button
              key={method}
              onClick={() => setPrefs(p => ({ ...p, contactMethod: method }))}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 10,
                border: `1.5px solid ${prefs.contactMethod === method ? "var(--green-700)" : "var(--border)"}`,
                background: prefs.contactMethod === method ? "var(--green-50)" : "var(--surface)",
                fontSize: 11, fontWeight: 700,
                color: prefs.contactMethod === method ? "var(--green-700)" : "var(--text-muted)",
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s"
              }}
            >
              {method === "Call" ? "📞" : method === "WhatsApp" ? "💬" : "📱"} {method}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fade-up stagger-2 card-padded" style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 12 }}>Language preference</p>
        <div style={{ display: "flex", gap: 8 }}>
          {(["English", "Pidgin"] as const).map(lang => (
            <button
              key={lang}
              onClick={() => setPrefs(p => ({ ...p, language: lang }))}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 10,
                border: `1.5px solid ${prefs.language === lang ? "var(--green-700)" : "var(--border)"}`,
                background: prefs.language === lang ? "var(--green-50)" : "var(--surface)",
                fontSize: 11, fontWeight: 700,
                color: prefs.language === lang ? "var(--green-700)" : "var(--text-muted)",
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s"
              }}
            >
              {lang === "English" ? "🇬🇧 English" : "🇳🇬 Pidgin"}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 8 }}>Applies to AI chat and voice support</p>
      </div>

      {/* Notification toggles */}
      <p className="section-header animate-fade-up stagger-3">Notifications & Alerts</p>

      <div className="animate-fade-up stagger-4 card" style={{ marginBottom: 14, overflow: "hidden" }}>
        {[
          { key: "smsOptIn" as const, label: "SMS Reminders", desc: "Receive reminder texts from FSS" },
          { key: "remindBefore3" as const, label: "3-day PTP reminder", desc: "Alert 3 days before your PTP date" },
          { key: "remindBefore1" as const, label: "1-day PTP reminder", desc: "Alert the day before your PTP date" },
        ].map((item, i) => (
          <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{item.label}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.desc}</p>
            </div>
            <button className={`toggle ${prefs[item.key] ? "on" : ""}`} onClick={() => toggle(item.key)} />
          </div>
        ))}
      </div>

      {/* Account Details */}
      <p className="section-header animate-fade-up stagger-5">Account Details</p>

      <div className="animate-fade-up stagger-5 card" style={{ overflow: "hidden", marginBottom: 14 }}>
        {[
          { label: "Registered name", value: mockCustomer.name },
          { label: "Phone number", value: mockCustomer.phone, action: true },
          { label: "Institution", value: mockCustomer.institution },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 2 }}>{item.label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{item.value}</p>
            </div>
            {item.action && (
              <button
                onClick={() => setNumberSheet(true)}
                style={{ padding: "6px 12px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "inherit" }}
              >
                Update
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Notification history sheet */}
      {notifOpen && (
        <>
          <div className="sheet-overlay" onClick={() => setNotifOpen(false)} />
          <div className="sheet animate-slide-up">
            <div className="sheet-handle" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Notifications</h3>
              <button onClick={markAllRead} style={{ fontSize: 11, color: "var(--green-700)", fontWeight: 700, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Mark all read
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {notifications.map(notif => {
                const nc = notifTypeColors[notif.type];
                return (
                  <div key={notif.id} style={{
                    padding: "14px", borderRadius: 12,
                    background: notif.read ? "var(--surface-2)" : "var(--surface)",
                    border: `1px solid ${notif.read ? "var(--border)" : "var(--border-strong)"}`,
                    display: "flex", gap: 10, alignItems: "flex-start",
                    opacity: notif.read ? 0.75 : 1
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: nc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>
                      {nc.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{notif.title}</p>
                        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{notif.time}</span>
                      </div>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{notif.body}</p>
                    </div>
                    {!notif.read && (
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green-700)", flexShrink: 0, marginTop: 4 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Number update sheet */}
      {numberSheet && (
        <>
          <div className="sheet-overlay" onClick={() => setNumberSheet(false)} />
          <div className="sheet animate-slide-up">
            <div className="sheet-handle" />
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Request Number Update</h3>
            <div style={{ padding: "12px 14px", background: "#FFF8E1", borderRadius: 10, marginBottom: 20, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <RiAlertLine size={14} style={{ color: "#F57F17", flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: "#7B5800", lineHeight: 1.5 }}>
                For security, number changes require <strong>agent review</strong>. Your request will be processed within 1–2 business days.
              </p>
            </div>

            {numberRequested ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <RiCheckboxCircleLine size={36} style={{ color: "var(--green-700)", margin: "0 auto 12px", display: "block" }} />
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Request Submitted</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>An agent will contact you within 1–2 business days to verify and update your number.</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                    New phone number
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+234 800 000 0000"
                    value={newNumber}
                    onChange={e => setNewNumber(e.target.value)}
                  />
                </div>
                <button className="btn-primary" onClick={() => setNumberRequested(true)} disabled={!newNumber}>
                  Submit Request
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
