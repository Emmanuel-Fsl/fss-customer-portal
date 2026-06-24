import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { reference } = await request.json();
  if (!reference) {
    return Response.json({ error: "reference is required" }, { status: 400 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ error: "Payment service is not configured yet." }, { status: 503 });
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });

  const data = await res.json();

  if (!data.status || data.data.status !== "success") {
    return Response.json({ success: false, message: data.message || "Payment not confirmed" }, { status: 400 });
  }

  return Response.json({
    success: true,
    amount: data.data.amount / 100,
    reference: data.data.reference,
    channel: data.data.channel,
    paidAt: data.data.paid_at,
  });
}
