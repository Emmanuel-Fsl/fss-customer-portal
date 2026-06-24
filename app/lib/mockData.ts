// ─── TEMPLATE DATA — wire Firestore/BigQuery here later ───────────────────

export const mockCustomer = {
  id: "cust_001",
  phone: "+2348012345678",
  name: "Adaeze Okonkwo",
  institution: "Grooming MFB",
  loanType: "Business Loan",
  currency: "₦", // Switch to "KSh" for Kenyan customers
  country: "NG" as "NG" | "KE",
  preferredContact: "WhatsApp" as "Call" | "WhatsApp" | "SMS",
  language: "English" as "English" | "Pidgin",
  email: "adaeze@example.com",
};

export const mockLoan = {
  outstandingBalance: 485_000,
  originalAmount: 600_000,
  disbursementDate: "2023-09-15",
  firstDefaultDate: "2024-01-10",
  daysInArrears: 99,
  nextPaymentDue: "2024-04-30",
  totalPaid: 115_000,
  status: "In Recovery" as "Active" | "In Recovery" | "Settled" | "Legal",
  discountAvailable: true,
  discountPercent: 15,
  discountExpiry: "2024-05-15",
  discountAmount: 72_750,
  settlementAmount: 412_250,
  hasInstalmentPlan: true,
  instalmentMonths: 3,
  bvnBlacklisted: false,
};

export const mockPayments = [
  { id: "pmt_001", date: "2024-03-15", amount: 25_000, method: "Bank Transfer", reference: "TRF24031500001", runningBalance: 485_000 },
  { id: "pmt_002", date: "2024-02-10", amount: 40_000, method: "Officer Collection", reference: "OFC24021000002", runningBalance: 510_000 },
  { id: "pmt_003", date: "2024-01-20", amount: 50_000, method: "Bank Transfer", reference: "TRF24012000003", runningBalance: 550_000 },
  { id: "pmt_004", date: "2023-12-05", amount: 0, method: "—", reference: "—", runningBalance: 600_000, missed: true, expectedDate: "2023-12-01" },
  { id: "pmt_005", date: "2023-11-01", amount: 0, method: "—", reference: "—", runningBalance: 600_000, missed: true, expectedDate: "2023-11-01" },
];

export const mockNotifications = [
  { id: "n1", title: "Payment Confirmed", body: "Your ₦40,000 payment on 10 Feb has been confirmed.", time: "2h ago", read: false, type: "success" },
  { id: "n2", title: "PTP Reminder", body: "Your promise-to-pay date is tomorrow, 30 Apr.", time: "1d ago", read: false, type: "reminder" },
  { id: "n3", title: "Settlement Offer Active", body: "You qualify for a 15% discount. Offer expires 15 May.", time: "3d ago", read: true, type: "offer" },
  { id: "n4", title: "Balance Updated", body: "Your outstanding balance is now ₦485,000.", time: "5d ago", read: true, type: "info" },
];

export const mockPTP = {
  active: false,
  date: "",
  amount: 0,
  channel: "Bank Transfer",
  filledAt: "",
  // Set brokenAt to a past date within 21 days to demo the lockout state.
  // Set to null (or empty string) to start with a clean "make a promise" state.
  brokenAt: null as string | null,
};

export const mockDocuments = [
  { id: "doc1", type: "Letter of Indebtedness", status: "available", requestedDate: null, readyDate: null, note: "Takes 3–7 business days after request" },
  { id: "doc2", type: "Settlement Letter", status: "pending_payment", requestedDate: null, readyDate: null, note: "Generated once offer accepted & payment confirmed" },
  { id: "doc3", type: "Clearance Certificate", status: "locked", requestedDate: null, readyDate: null, note: "Available when loan is fully paid" },
];

export const mockFAQs = [
  {
    q: "How do I make a payment?",
    a: `Pay directly to Grooming MFB's collection account:\n\n**Account Name:** FSS Recoveries / Grooming MFB\n**Account Number:** 0123456789\n**Bank:** Zenith Bank\n\nUse your phone number as the payment reference. After payment, WhatsApp your receipt to +2349133498462.`,
  },
  {
    q: "What happens if I miss my PTP?",
    a: "If you miss your promise-to-pay date, our team will reach out to you within 24 hours. Missing a PTP may affect your eligibility for the current discount offer.",
  },
  {
    q: "How long does my balance update after payment?",
    a: "Bank transfers typically reflect within 24–48 hours. If you've paid and your balance hasn't updated after 48 hours, please contact us with your receipt.",
  },
  {
    q: "How do I speak to a human agent?",
    a: "You can WhatsApp us directly at +2349133498462 or use the chat button below. We're available Monday–Friday, 8am–6pm.",
  },
  {
    q: "What is FSS Recoveries?",
    a: "FSS Recoveries (Fintech Solutions Limited) is a licensed debt recovery company working on behalf of financial institutions to help borrowers resolve outstanding loans. We are authorised by the lending institution and work within Nigerian and Kenyan financial regulations. Our goal is to help you settle comfortably.",
  },
];

export const formatCurrency = (amount: number, currency = "₦") => {
  return `${currency}${amount.toLocaleString("en-NG")}`;
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export const daysUntil = (dateStr: string) => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};
