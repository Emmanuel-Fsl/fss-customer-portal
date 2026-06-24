"use client";
import { useState, useRef, useEffect } from "react";
import { RiShieldLine, RiArrowRightLine, RiRefreshLine, RiPhoneLine } from "react-icons/ri";

interface OTPAuthProps {
  phone: string;
  onSuccess: () => void;
}

export default function OTPAuth({ phone, onSuccess }: OTPAuthProps) {
  const [step, setStep] = useState<"send" | "verify">("send");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const maskedPhone = phone.replace(/(\+?\d{3})\d+(\d{4})/, "$1 •••• $2");

  const sendOTP = async () => {
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep("verify");
    setCountdown(60);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newOtp.every(d => d) && value) {
      setTimeout(() => verifyOTP(newOtp), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      setTimeout(() => verifyOTP(newOtp), 100);
    }
  };

  const verifyOTP = async (digits: string[]) => {
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 1200));
    if (digits.join("") === "123456" || digits.join("") === "000000") {
      onSuccess();
    } else {
      setError("Incorrect code. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--surface-2)" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #1B5E20 0%, #2E7D32 60%, #388E3C 100%)",
        padding: "60px 24px 80px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: 20, left: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

        <div className="animate-fade-up" style={{ position: "relative" }}>
          <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.12)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>FSS</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            FSS Recoveries
          </p>
          <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
            {step === "send" ? "Access your\nloan portal" : "Verify your\nidentity"}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.5 }}>
            {step === "send"
              ? "We'll send a one-time code to confirm it's you."
              : `Enter the 6-digit code sent to ${maskedPhone}`}
          </p>
        </div>
      </div>

      {/* Card */}
      <div style={{ flex: 1, padding: "0 20px 40px", marginTop: -32, position: "relative" }}>
        <div className="card animate-fade-up stagger-1" style={{ padding: "28px 24px" }}>
          {step === "send" ? (
            <>
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 16px", background: "var(--green-50)",
                border: "1.5px solid var(--green-200)", borderRadius: "var(--radius-md)", marginBottom: 24
              }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--green-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <RiPhoneLine size={16} style={{ color: "var(--green-700)" }} />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Registered number</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{maskedPhone}</p>
                </div>
              </div>

              <button className="btn-primary" onClick={sendOTP} disabled={loading}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <RiRefreshLine size={16} style={{ animation: "spin 1s linear infinite" }} />
                    Sending code…
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    Send OTP <RiArrowRightLine size={16} />
                  </span>
                )}
              </button>

              <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 16, lineHeight: 1.6 }}>
                This code expires after <strong>24 hours</strong>. You'll need a new code each time you log in.
              </p>
            </>
          ) : (
            <>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }} onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { inputRefs.current[i] = el; }}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className={`otp-input ${digit ? "filled" : ""}`}
                    disabled={loading}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && (
                <p style={{ textAlign: "center", fontSize: 13, color: "#dc2626", fontWeight: 600, marginBottom: 12 }}>
                  {error}
                </p>
              )}

              {loading && (
                <p style={{ textAlign: "center", fontSize: 13, color: "var(--green-700)", fontWeight: 600, marginBottom: 12 }}>
                  Verifying…
                </p>
              )}

              <div style={{ height: 16 }} />

              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => { setStep("send"); setOtp(["","","","","",""]); setError(""); }}
                  style={{ fontSize: 13, color: "var(--green-700)", fontWeight: 700, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  Change number
                </button>
                <span style={{ color: "var(--text-muted)", margin: "0 8px" }}>·</span>
                {countdown > 0 ? (
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Resend in {countdown}s</span>
                ) : (
                  <button
                    onClick={sendOTP}
                    style={{ fontSize: 13, color: "var(--green-700)", fontWeight: 700, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Resend code
                  </button>
                )}
              </div>

              <div style={{ marginTop: 20, padding: "12px 14px", background: "var(--green-50)", borderRadius: "var(--radius-sm)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <RiShieldLine size={14} style={{ color: "var(--green-700)", flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <strong>Demo:</strong> Enter <strong>123456</strong> to sign in.
                </p>
              </div>
            </>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <RiShieldLine size={12} style={{ color: "var(--text-muted)" }} />
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Secured by FSS Recoveries · Licensed operator
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
