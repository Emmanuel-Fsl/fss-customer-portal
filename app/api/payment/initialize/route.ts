import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { amount, email, phone, channel, metadata } = await request.json();

  if (!amount || !email) {
    return Response.json({ error: "amount and email are required" }, { status: 400 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ error: "Payment service is not configured yet." }, { status: 503 });
  }

  const reference = `FSS_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      email,
      reference,
      currency: "NGN",
      channels: [channel],
      metadata: { ...metadata, phone },
    }),
  });

  const data = await res.json();
  if (!data.status) {
    return Response.json({ error: data.message || "Paystack initialization failed" }, { status: 400 });
  }

  return Response.json({
    reference: data.data.reference,
    accessCode: data.data.access_code,
    authorizationUrl: data.data.authorization_url,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  });
}
