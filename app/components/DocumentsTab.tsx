"use client";
import { useState } from "react";
import { RiFileList3Line, RiTimeLine, RiLockLine, RiArrowRightSLine, RiCheckboxCircleLine } from "react-icons/ri";
import { mockDocuments, mockLoan } from "../lib/mockData";

interface Doc { id: string; type: string; status: string; requestedDate: string | null; readyDate: string | null; note: string; }

export default function DocumentsTab() {
  const [docs] = useState<Doc[]>(mockDocuments);
  const [requested, setRequested] = useState<string[]>([]);
  const [sheet, setSheet] = useState<Doc | null>(null);

  const requestDoc = (id: string) => {
    setRequested(prev => [...prev, id]);
    setSheet(null);
  };

  const docIcon = (status: string) => {
    if (status === "available") return <RiFileList3Line size={18} style={{ color: "var(--green-700)" }} />;
    if (status === "locked") return <RiLockLine size={18} style={{ color: "var(--text-muted)" }} />;
    return <RiTimeLine size={18} style={{ color: "#F59E0B" }} />;
  };

  const docBg = (status: string) => {
    if (status === "available") return "var(--green-50)";
    if (status === "locked") return "var(--surface-3)";
    return "#FFF8E1";
  };

  const loanSettled = mockLoan.status === "Settled";

  return (
    <div style={{ padding: "0 16px 24px" }}>
      <div className="animate-fade-up card-padded" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Documents you request are reviewed by our team. Most are ready within <strong>3–7 business days</strong>. You'll get an in-app notification when ready.
        </p>
      </div>

      <p className="section-header animate-fade-up stagger-1">Your Documents</p>

      <div className="animate-fade-up stagger-2" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {docs.map((doc) => {
          const isRequested = requested.includes(doc.id);
          const isLocked = doc.status === "locked" && !loanSettled;
          const isPendingPayment = doc.status === "pending_payment" && mockLoan.status !== "Settled";

          return (
            <div
              key={doc.id}
              className="card tap-scale"
              style={{ cursor: isLocked ? "default" : "pointer", opacity: isLocked ? 0.65 : 1 }}
              onClick={() => !isLocked && !isPendingPayment && setSheet(doc)}
            >
              <div style={{ padding: "16px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                  background: isLocked || isPendingPayment ? "var(--surface-3)" : docBg(doc.status),
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {isRequested
                    ? <RiTimeLine size={18} style={{ color: "#F59E0B" }} />
                    : docIcon(isLocked || isPendingPayment ? "locked" : doc.status)
                  }
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: isLocked ? "var(--text-muted)" : "var(--text-primary)" }}>
                      {doc.type}
                    </p>
                    {isLocked && <RiLockLine size={13} style={{ color: "var(--text-muted)" }} />}
                    {!isLocked && !isPendingPayment && !isRequested && (
                      <RiArrowRightSLine size={16} style={{ color: "var(--text-muted)" }} />
                    )}
                    {isRequested && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999, background: "#FFF8E1", color: "#B45309" }}>
                        PROCESSING
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>
                    {isLocked ? "Available once loan is fully paid"
                      : isPendingPayment ? "Available once settlement payment confirmed"
                      : isRequested ? "Request received · 3–7 business days"
                      : doc.note}
                  </p>
                </div>
              </div>

              {!isLocked && !isPendingPayment && (
                <div style={{ padding: "10px 16px", background: "var(--surface-2)", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
                  {isRequested ? (
                    <button style={{
                      flex: 1, padding: "8px", borderRadius: 8,
                      background: "var(--surface-3)", border: "1px solid var(--border)",
                      fontSize: 12, fontWeight: 600, color: "var(--text-muted)", cursor: "not-allowed", fontFamily: "inherit"
                    }}>
                      Awaiting Processing…
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSheet(doc); }}
                      style={{
                        flex: 1, padding: "8px", borderRadius: 8,
                        background: "var(--green-700)", border: "none",
                        fontSize: 12, fontWeight: 700, color: "white",
                        cursor: "pointer", fontFamily: "inherit"
                      }}
                    >
                      Request Document
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="animate-fade-up stagger-3" style={{ marginTop: 16, padding: "14px", background: "var(--green-50)", borderRadius: 12, border: "1px solid var(--green-100)" }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          💡 Documents can be submitted directly to your institution to update your loan records after settlement. All documents are issued on FSS Recoveries letterhead.
        </p>
      </div>

      {/* Sheet */}
      {sheet && (
        <>
          <div className="sheet-overlay" onClick={() => setSheet(null)} />
          <div className="sheet animate-slide-up">
            <div className="sheet-handle" />
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 13, background: "var(--green-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <RiFileList3Line size={22} style={{ color: "var(--green-700)" }} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>{sheet.type}</h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Official FSS document</p>
              </div>
            </div>

            <div style={{ padding: "14px", background: "var(--surface-2)", borderRadius: 12, marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{sheet.note}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {[
                "This document is issued on official FSS Recoveries letterhead",
                "It is legally recognised by Nigerian and Kenyan financial institutions",
                "You'll be notified by in-app alert when it's ready",
              ].map((point, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <RiCheckboxCircleLine size={13} style={{ color: "var(--green-700)", flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{point}</p>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={() => requestDoc(sheet.id)}>
              Request {sheet.type}
            </button>
            <button
              onClick={() => setSheet(null)}
              style={{ width: "100%", padding: "14px", background: "none", border: "none", fontSize: 14, color: "var(--text-muted)", cursor: "pointer", marginTop: 8, fontFamily: "inherit" }}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
