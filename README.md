# FSS Customer Self-Service Portal

A mobile-first loan management portal for FSS Recoveries (Nigeria & Kenya).

## Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + custom design system
- Nunito Sans + DM Sans (Google Fonts)
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login:** Enter OTP `123456` to sign in.

## Project Structure

```
app/
├── globals.css              # Design tokens, animations, shared styles
├── layout.tsx               # Mobile meta, theme color
├── page.tsx                 # Auth gate + tab router
├── lib/
│   └── mockData.ts          # ← WIRE-UP: Replace with Firestore/BigQuery calls
└── components/
    ├── OTPAuth.tsx           # OTP send + verify flow
    ├── AppHeader.tsx         # Sticky header + notification bell
    ├── BottomNav.tsx         # 5-tab bottom navigation
    ├── HomeTab.tsx           # Balance card, discount banner, stats grid, credit health
    ├── PaymentsTab.tsx       # Payment timeline, PTP form, receipts
    ├── SettlementTab.tsx     # Offer countdown, accept flow, instalment plan
    ├── DocumentsTab.tsx      # Document requests with status tracking
    ├── SupportTab.tsx        # ElevenLabs embed slot, FAQ accordion, WhatsApp CTA
    └── ProfileTab.tsx        # Preferences, toggles, notification history
```

## Wire-Up Checklist

### 1. Phone from URL
In `app/page.tsx`, read the phone param:
```tsx
// Replace DEMO_PHONE with:
const searchParams = useSearchParams();
const phone = searchParams.get("phone") || "";
```

### 2. OTP Integration
In `OTPAuth.tsx`, replace the `sendOTP()` and `verifyOTP()` functions with your SMS provider (Termii, Twilio, etc.) and backend verification.

### 3. Data Layer
Replace all exports in `app/lib/mockData.ts` with real Firestore/BigQuery queries:
- `mockCustomer` → Firestore customer document
- `mockLoan` → BigQuery loan summary query (`fssspark.recovery_methods_data.leads_active`)
- `mockPayments` → Firestore payment history collection
- `mockNotifications` → Firestore notifications collection
- `mockPTP` → Firestore PTP collection
- `mockDocuments` → Firestore document request collection

### 4. ElevenLabs Widget
In `SupportTab.tsx`, find the marked comment block and replace with:
```html
<elevenlabs-convai agent-id="YOUR_AGENT_ID"></elevenlabs-convai>
<script src="https://elevenlabs.io/convai-widget/index.js" async></script>
```

### 5. WhatsApp Number
Already set to `+2349133498462` in `SupportTab.tsx`. Update if needed.

### 6. Currency / Country
In `mockData.ts`, set `currency: "KSh"` and `country: "KE"` for Kenyan customers.

## Deployment
Deploy to Vercel — same setup as your existing FSS apps. Add environment variables for your Firestore/BigQuery credentials.

```bash
vercel --prod
```
