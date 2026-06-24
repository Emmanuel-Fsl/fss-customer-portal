"use client";
import { useState, useMemo } from "react";
import {
  RiDownloadLine, RiAlertLine, RiCheckboxCircleLine,
  RiBankCardLine, RiUserLine, RiBuildingLine, RiAddLine,
  RiLockLine, RiRefreshLine, RiSecurePaymentLine
} from "react-icons/ri";
import {
  mockPayments, mockPTP, mockLoan,
  formatCurrency, formatDate
} from "../lib/mockData";
import PayNowSheet from "./PayNowSheet";
import RestructureSheet from "./RestructureSheet";

const PTP_MAX_DAYS = 28;   // 4 weeks cap
const PTP_LOCKOUT_DAYS = 21;

type PtpStatus = "idle" | "active" | "locked";

interface PtpState {
  active: boolean;
  date: string;
  amount: number;
  channel: string;
  filledAt: string;
  brokenAt: string | null;
}

function getPtpStatus(ptp: PtpState): PtpStatus {
  if (ptp.active && ptp.date) return "active";
  if (ptp.brokenAt) {
    const lockoutEnds = new Date(ptp.brokenAt);
    lockoutEnds.setDate(lockoutEnds.getDate() + PTP_LOCKOUT_DAYS);
    if (new Date() < lockoutEnds) return "locked";
  }
  return "idle";
}

function getLockoutDaysLeft(brokenAt: string): number {
  const lockoutEnds = new Date(brokenAt);
  lockoutEnds.setDate(lockoutEnds.getDate() + PTP_LOCKOUT_DAYS);
  return Math.max(0, Math.ceil((lockoutEnds.getTime() - Date.now()) / 86_400_000));
}

function getMaxPtpDate(): string {
  const max = new Date();
  max.setDate(max.getDate() + PTP_MAX_DAYS);
  return max.toISOString().split("T")[0];
}

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export default function PaymentsTab({ onNavigate: _onNavigate }: { onNavigate: (tab: string) => void }) {
  const [ptp, setPtp] = useState<PtpState>(mockPTP);
  const [ptpSheet, setPtpSheet] = useState(false);
  const [ptpForm, setPtpForm] = useState({ date: "", amount: "", channel: "Bank Transfer" });
  const [ptpError, setPtpError] = useState("");

  const [showPayNow, setShowPayNow] = useState(false);
  const [showRestructure, setShowRestructure] = useState(false);

  // Payment history (new payments prepended on success)
  const [payments, setPayments] = useState(mockPayments);

  const ptpStatus = useMemo(() => getPtpStatus(ptp), [ptp]);

  const methodIcon = (method: string) => {
    if (method.includes("Transfer")) return <RiBuildingLine size={13} />;
    if (method.includes("Officer")) return <RiUserLine size={13} />;
    return <RiBankCardLine size={13} />;
  };

  const methodColor = (method: string) => {
    if (method.includes("Transfer")) return { bg: "#EDE7F6", color: "#6A1B9A" };
    if (method.includes("Officer")) return { bg: "#E3F2FD", color: "#1565C0" };
    return { bg: "var(--green-50)", color: "var(--green-700)" };
  };

  const channelLabel = (ch: string) => {
    if (ch === "card") return "Card";
    if (ch === "bank_transfer") return "Bank Transfer";
    if (ch === "ussd") return "USSD";
    return ch;
  };

  const submitPtp = () => {
    const selectedDate = new Date(ptpForm.date);
    const today = new Date(getTodayStr());
    const maxDate = new Date(getMaxPtpDate());

    if (!ptpForm.date || !ptpForm.amount) {
      setPtpError("Please fill in all fields.");
      return;
    }
    if (selectedDate < today) {
      setPtpError("Date must be in the future.");
      return;
    }
    if (selectedDate > maxDate) {
      setPtpError(`Promise date cannot exceed ${PTP_MAX_DAYS} days from today.`);
      return;
    }

    setPtp({
      active: true,
      date: ptpForm.date,
      amount: parseFloat(ptpForm.amount),
      channel: ptpForm.channel,
      filledAt: getTodayStr(),
      brokenAt: null,
    });
    setPtpSheet(false);
    setPtpError("");
    setPtpForm({ date: "", amount: "", channel: "Bank Transfer" });
  };

  const cancelPtp = () => {
    // Cancelling resets to idle (no lockout — only a missed date triggers lockout)
    setPtp(prev => ({ ...prev, active: false, date: "", amount: 0, filledAt: "" }));
  };

  // Simulate broken PTP (demo button visible in active state)
  const simulateBrokenPtp = () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    setPtp(prev => ({
      ...prev,
      active: false,
      date: "",
      brokenAt: threeDaysAgo.toISOString().split("T")[0],
    }));
  };

  const handlePaySuccess = (reference: string, amount: number, channel: string) => {
    setShowPayNow(false);
    const newPayment = {
      id: `pmt_${Date.now()}`,
      date: getTodayStr(),
      amount,
      method: channelLabel(channel),
      reference,
      runningBalance: Math.max(0, mockLoan.outstandingBalance - amount),
    };
    setPayments(prev => [newPayment, ...prev]);
    // If there was an active PTP, mark it fulfilled
    if (ptp.active) {
      setPtp(prev => ({ ...prev, active: false, date: "", filledAt: "" }));
    }
  };

  const handleRestructureSuccess = () => {
    setShowRestructure(false);
  };

  return (
    <div style={{ padding: "0 16px 24px" }}>

      {/* Summary */}
      <div className="animate-fade-up" style={{
        background: "linear-gradient(135deg, var(--green-700) 0%, var(--green-600) 100%)",
        borderRadius: 16, padding: "18px 18px",
        display: "flex", gap: 16, marginBottom: 16
      }}>
        <div style={{ flex: 1, borderRight: "1px solid rgba(255,255,255,0.2)", paddingRight: 16 }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Total Paid</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{formatCurrency(mockLoan.totalPaid)}</p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Outstanding</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{formatCurrency(mockLoan.outstandingBalance)}</p>
        </div>
      </div>

      {/* Pay Now + Restructure CTAs */}
      <div className="animate-fade-up stagger-1" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 16 }}>
        <button
          className="btn-primary tap-scale"
          onClick={() => setShowPayNow(true)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 20px", fontSize: 14 }}
        >
          <RiSecurePaymentLine size={16} />
          Pay Now
        </button>
        <button
          onClick={() => setShowRestructure(true)}
          className="tap-scale"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "14px 16px", borderRadius: 12, cursor: "pointer",
            border: "1.5px solid var(--border)", background: "var(--surface)",
            fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", whiteSpace: "nowrap"
          }}
        >
          <RiRefreshLine size={14} />
          Restructure
        </button>
      </div>

      {/* PTP section */}
      {ptpStatus === "locked" && ptp.brokenAt && (
        <div className="animate-fade-up stagger-2 card" style={{ padding: "14px 16px", marginBottom: 16, borderColor: "#FCA5A5" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <RiLockLine size={15} style={{ color: "#DC2626" }} />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#DC2626" }}>Promise to Pay Unavailable</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5, marginTop: 2 }}>
                A previous promise was missed on {formatDate(ptp.brokenAt)}.
                PTP unlocks in <strong>{getLockoutDaysLeft(ptp.brokenAt)} days</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {ptpStatus === "active" && (
        <div className="animate-fade-up stagger-2 card" style={{ padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--green-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <RiCheckboxCircleLine size={16} style={{ color: "var(--green-700)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>Active Promise to Pay</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.5 }}>
                {formatCurrency(ptp.amount)} by {formatDate(ptp.date)} · {ptp.channel} · Communication paused
              </p>
            </div>
            <button
              onClick={cancelPtp}
              style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }}
            >
              Cancel
            </button>
          </div>
          {/* Demo helper */}
          <button
            onClick={simulateBrokenPtp}
            style={{ marginTop: 10, fontSize: 10, color: "var(--text-muted)", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}
          >
            Demo: simulate broken promise
          </button>
        </div>
      )}

      {ptpStatus === "idle" && (
        <button
          className="animate-fade-up stagger-2 tap-scale"
          onClick={() => setPtpSheet(true)}
          style={{
            width: "100%", marginBottom: 16,
            background: "var(--green-50)", border: "1.5px dashed var(--green-600)",
            borderRadius: 12, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 10, cursor: "pointer"
          }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--green-700)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <RiAddLine size={16} style={{ color: "white" }} />
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--green-700)" }}>Make a Promise to Pay</p>
            <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>We'll pause all communication until your set date</p>
          </div>
        </button>
      )}

      {/* Timeline */}
      <p className="section-header animate-fade-up stagger-3">Payment History</p>

      <div className="animate-fade-up stagger-4" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {payments.map((pmt, i) => (
          <div key={pmt.id} style={{ display: "flex", gap: 12, position: "relative", marginBottom: 16 }}>
            {i < payments.length - 1 && (
              <div style={{ position: "absolute", left: 15, top: 30, bottom: -16, width: 1, background: "var(--border)" }} />
            )}
            <div style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              background: (pmt as any).missed ? "#FEF2F2" : "var(--green-50)",
              border: `2px solid ${(pmt as any).missed ? "#FCA5A5" : "var(--green-200)"}`,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              {(pmt as any).missed
                ? <RiAlertLine size={12} style={{ color: "#DC2626" }} />
                : <RiCheckboxCircleLine size={12} style={{ color: "var(--green-700)" }} />
              }
            </div>
            <div className="card" style={{ flex: 1, padding: "14px 14px", overflow: "visible" }}>
              {(pmt as any).missed ? (
                <>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", background: "#FEF2F2", borderRadius: 9999, marginBottom: 4 }}>
                    <RiAlertLine size={10} style={{ color: "#DC2626" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#DC2626" }}>MISSED PAYMENT</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Expected {formatDate((pmt as any).expectedDate)}</p>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 800, color: "var(--green-700)" }}>+{formatCurrency(pmt.amount)}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{formatDate(pmt.date)}</p>
                    </div>
                    <button style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "5px 10px", borderRadius: 8,
                      background: "var(--surface-2)", border: "1px solid var(--border)",
                      cursor: "pointer", fontSize: 11, color: "var(--text-secondary)", fontWeight: 600
                    }}>
                      <RiDownloadLine size={11} />Receipt
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "3px 8px", borderRadius: 9999,
                      background: methodColor(pmt.method).bg,
                      color: methodColor(pmt.method).color
                    }}>
                      {methodIcon(pmt.method)}
                      <span style={{ fontSize: 10, fontWeight: 700 }}>{pmt.method}</span>
                    </div>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Ref: {pmt.reference}</span>
                  </div>
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Balance after payment</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)" }}>{formatCurrency(pmt.runningBalance)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PTP Sheet */}
      {ptpSheet && (
        <>
          <div className="sheet-overlay" onClick={() => { setPtpSheet(false); setPtpError(""); }} />
          <div className="sheet animate-slide-up">
            <div className="sheet-handle" />
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Promise to Pay</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.5 }}>
              Set a date you'll pay by — we'll pause all calls and messages until then. Max 4 weeks ahead.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                  Payment Date
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={ptpForm.date}
                  min={getTodayStr()}
                  max={getMaxPtpDate()}
                  onChange={e => { setPtpForm({ ...ptpForm, date: e.target.value }); setPtpError(""); }}
                />
                <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
                  Latest allowed: {formatDate(getMaxPtpDate())}
                </p>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                  Amount you plan to pay (₦)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder={`e.g. ${mockLoan.outstandingBalance.toLocaleString()}`}
                  value={ptpForm.amount}
                  onChange={e => { setPtpForm({ ...ptpForm, amount: e.target.value }); setPtpError(""); }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                  Payment channel
                </label>
                <select
                  className="input-field"
                  value={ptpForm.channel}
                  onChange={e => setPtpForm({ ...ptpForm, channel: e.target.value })}
                >
                  <option>Bank Transfer</option>
                  <option>Card</option>
                  <option>USSD</option>
                  <option>Cash (to officer)</option>
                </select>
              </div>

              {ptpError && (
                <div style={{ padding: "10px 12px", background: "#FEF2F2", borderRadius: 10, border: "1px solid #FCA5A5" }}>
                  <p style={{ fontSize: 12, color: "#DC2626" }}>{ptpError}</p>
                </div>
              )}

              <div style={{ padding: "12px 14px", background: "var(--green-50)", borderRadius: 10 }}>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  📌 <strong>Communication paused</strong> from now until your PTP date. If the promise is missed, PTP will be locked for <strong>21 days</strong>.
                </p>
              </div>

              <button
                className="btn-primary"
                onClick={submitPtp}
                disabled={!ptpForm.date || !ptpForm.amount}
              >
                Confirm Promise to Pay
              </button>
            </div>
          </div>
        </>
      )}

      {/* Pay Now Sheet */}
      {showPayNow && (
        <PayNowSheet
          onClose={() => setShowPayNow(false)}
          onSuccess={handlePaySuccess}
        />
      )}

      {/* Restructure Sheet */}
      {showRestructure && (
        <RestructureSheet
          onClose={() => setShowRestructure(false)}
          onSuccess={handleRestructureSuccess}
        />
      )}
    </div>
  );
}
