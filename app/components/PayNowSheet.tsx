"use client";
import { useState, useEffect } from "react";
import { RiCloseLine, RiBankCardLine, RiBuildingLine, RiHashtag, RiLoaderLine } from "react-icons/ri";
import { mockCustomer, mockLoan, formatCurrency } from "../lib/mockData";

type Channel = "card" | "bank_transfer" | "ussd";

interface Props {
  onClose: () => void;
  onSuccess: (reference: string, amount: number, channel: Channel) => void;
  defaultAmount?: number;
}

const CHANNELS: { id: Channel; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "card", label: "Card", icon: <RiBankCardLine size={18} />, desc: "Debit or credit card" },
  { id: "bank_transfer", label: "Transfer", icon: <RiBuildingLine size={18} />, desc: "Bank account" },
  { id: "ussd", label: "USSD", icon: <RiHashtag size={18} />, desc: "Dial from any phone" },
];

export default function PayNowSheet({ onClose, onSuccess, defaultAmount }: Props) {
  const [amount, setAmount] = useState(String(defaultAmount ?? mockLoan.outstandingBalance));
  const [channel, setChannel] = useState<Channel>("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const handlePay = async () => {
    const numAmount = parseFloat(amount.replace(/,/g, ""));
    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          email: mockCustomer.email,
          phone: mockCustomer.phone,
          channel,
          metadata: { customerId: mockCustomer.id },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initialize payment");

      const popup = (window as any).PaystackPop;
      if (!popup) throw new Error("Payment provider not loaded. Please try again.");

      const handler = popup.setup({
        key: data.publicKey,
        email: mockCustomer.email,
        amount: Math.round(numAmount * 100),
        currency: "NGN",
        ref: data.reference,
        channels: [channel],
        callback: (response: { reference: string }) => {
          setLoading(false);
          onSuccess(response.reference, numAmount, channel);
        },
        onClose: () => setLoading(false),
      });
      handler.openIframe();
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const numAmt = parseFloat(amount.replace(/,/g, "")) || 0;

  return (
    <>
      <div className="sheet-overlay" onClick={onClose} />
      <div className="sheet animate-slide-up">
        <div className="sheet-handle" />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800 }}>Make a Payment</h3>
          <button
            onClick={onClose}
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 7px", cursor: "pointer" }}
          >
            <RiCloseLine size={15} style={{ color: "var(--text-muted)" }} />
          </button>
        </div>

        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.5 }}>
          Pay securely via card, bank transfer, or USSD — powered by Paystack.
        </p>

        {/* Amount */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
            Amount (₦)
          </label>
          <input
            type="number"
            className="input-field"
            value={amount}
            onChange={e => { setAmount(e.target.value); setError(""); }}
            placeholder="Enter amount"
            min="1"
          />
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            Outstanding: {formatCurrency(mockLoan.outstandingBalance)}
          </p>
        </div>

        {/* Channel */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>
            Payment Method
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {CHANNELS.map(ch => {
              const active = channel === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setChannel(ch.id)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    padding: "14px 8px", borderRadius: 12, cursor: "pointer",
                    border: `2px solid ${active ? "var(--green-600)" : "var(--border)"}`,
                    background: active ? "var(--green-50)" : "var(--surface)",
                    color: active ? "var(--green-700)" : "var(--text-secondary)",
                    transition: "all 0.15s",
                  }}
                >
                  {ch.icon}
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{ch.label}</span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.3 }}>{ch.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div style={{ padding: "10px 12px", background: "#FEF2F2", borderRadius: 10, marginBottom: 16, border: "1px solid #FCA5A5" }}>
            <p style={{ fontSize: 12, color: "#DC2626" }}>{error}</p>
          </div>
        )}

        <button
          className="btn-primary"
          onClick={handlePay}
          disabled={loading || numAmt <= 0}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          {loading && <RiLoaderLine size={16} style={{ animation: "spin 1s linear infinite" }} />}
          {loading ? "Opening payment..." : `Pay ${numAmt > 0 ? formatCurrency(numAmt) : "Now"}`}
        </button>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}
