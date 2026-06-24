"use client";
import { useState, useEffect, useCallback } from "react";
import { RiCloseLine, RiMoneyDollarCircleLine, RiShieldLine, RiCheckboxCircleLine, RiLoaderLine, RiArrowRightSLine } from "react-icons/ri";
import { mockLoan, mockCustomer, formatCurrency } from "../lib/mockData";

const PLANS = [
  { months: 3, label: "3 months" },
  { months: 6, label: "6 months" },
  { months: 12, label: "12 months" },
];

type Step = "plan" | "connecting" | "success";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  defaultMonths?: number;
  locked?: boolean;
}

export default function RestructureSheet({ onClose, onSuccess, defaultMonths = 3, locked = false }: Props) {
  const [months, setMonths] = useState(defaultMonths);
  const [step, setStep] = useState<Step>("plan");
  const [error, setError] = useState("");

  const monthlyAmount = Math.ceil(mockLoan.outstandingBalance / months);

  const exchangeMonoCode = useCallback(async (code: string) => {
    try {
      const res = await fetch("/api/payment/restructure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monoCode: code,
          months,
          monthlyAmount,
          customerId: mockCustomer.id,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Restructure failed");
      }
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Failed to set up plan. Please try again.");
      setStep("plan");
    }
  }, [months, monthlyAmount]);

  const openMonoConnect = useCallback(() => {
    const monoKey = process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY;
    if (!monoKey) {
      // Demo: simulate successful Mono connection
      setTimeout(() => setStep("success"), 1800);
      return;
    }
    const connect = new (window as any).Connect({
      key: monoKey,
      onSuccess: ({ code }: { code: string }) => exchangeMonoCode(code),
      onClose: () => { setStep("plan"); },
    });
    connect.setup();
    connect.open();
  }, [exchangeMonoCode]);

  useEffect(() => {
    if (step !== "connecting") return;
    setError("");
    const script = document.createElement("script");
    script.src = "https://connect.mono.co/connect.js";
    script.async = true;
    script.onload = openMonoConnect;
    script.onerror = () => { setError("Failed to load Mono Connect. Please try again."); setStep("plan"); };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [step, openMonoConnect]);

  return (
    <>
      <div className="sheet-overlay" onClick={step !== "connecting" ? onClose : undefined} />
      <div className="sheet animate-slide-up">
        <div className="sheet-handle" />

        {step === "success" ? (
          <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "var(--green-50)", display: "flex",
              alignItems: "center", justifyContent: "center", margin: "0 auto 16px"
            }}>
              <RiCheckboxCircleLine size={32} style={{ color: "var(--green-600)" }} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Plan Set Up!</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.6 }}>
              Your new repayment plan of{" "}
              <strong>{formatCurrency(monthlyAmount)}/month</strong> over{" "}
              <strong>{months} months</strong> has been activated via direct debit.
            </p>
            <button className="btn-primary" onClick={onSuccess}>Done</button>
          </div>
        ) : step === "connecting" ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <RiLoaderLine size={36} style={{ color: "var(--green-600)", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Connecting to your bank…</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Secure connection via Mono. This only takes a moment.</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Restructure Payments</h3>
              <button
                onClick={onClose}
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 7px", cursor: "pointer" }}
              >
                <RiCloseLine size={15} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.5 }}>
              Spread your balance into manageable monthly installments via automatic bank debit.
            </p>

            {/* Balance summary */}
            <div style={{ padding: "14px 16px", background: "var(--surface-2)", borderRadius: 12, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Outstanding balance</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{formatCurrency(mockLoan.outstandingBalance)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Monthly installment</span>
                <span style={{ fontSize: 17, fontWeight: 800, color: "var(--green-700)" }}>{formatCurrency(monthlyAmount)}</span>
              </div>
            </div>

            {/* Plan selector */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>
                Repayment Period
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {PLANS.map(plan => {
                  const active = months === plan.months;
                  return (
                    <button
                      key={plan.months}
                      onClick={() => !locked && setMonths(plan.months)}
                      style={{
                        padding: "14px 8px", borderRadius: 12, cursor: locked ? "default" : "pointer", textAlign: "center",
                        border: `2px solid ${active ? "var(--green-600)" : "var(--border)"}`,
                        background: active ? "var(--green-50)" : "var(--surface)",
                        color: active ? "var(--green-700)" : "var(--text-secondary)",
                        opacity: locked && !active ? 0.4 : 1,
                        transition: "all 0.15s",
                      }}
                    >
                      <p style={{ fontSize: 16, fontWeight: 800 }}>{plan.months}</p>
                      <p style={{ fontSize: 11, marginTop: 2 }}>months</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust note */}
            <div style={{ padding: "10px 14px", background: "#EFF6FF", borderRadius: 10, marginBottom: 20, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <RiShieldLine size={14} style={{ color: "#3B82F6", flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 11, color: "#1E40AF", lineHeight: 1.5 }}>
                We connect your bank account via Mono to set up automatic monthly debits. Your login credentials are never seen or stored.
              </p>
            </div>

            {error && (
              <div style={{ padding: "10px 12px", background: "#FEF2F2", borderRadius: 10, marginBottom: 16, border: "1px solid #FCA5A5" }}>
                <p style={{ fontSize: 12, color: "#DC2626" }}>{error}</p>
              </div>
            )}

            <button
              className="btn-primary"
              onClick={() => setStep("connecting")}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <RiMoneyDollarCircleLine size={16} />
              Connect Bank & Activate Plan
              <RiArrowRightSLine size={14} style={{ marginLeft: "auto" }} />
            </button>
          </>
        )}
      </div>
    </>
  );
}
