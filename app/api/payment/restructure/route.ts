import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { monoCode, months, monthlyAmount, customerId } = await request.json();

  if (!monoCode || !months || !monthlyAmount) {
    return Response.json({ error: "monoCode, months, and monthlyAmount are required" }, { status: 400 });
  }

  const monoSecretKey = process.env.MONO_SECRET_KEY;
  if (!monoSecretKey) {
    return Response.json({ error: "Restructure service is not configured yet." }, { status: 503 });
  }

  // Exchange Mono auth code for account ID
  const authRes = await fetch("https://api.withmono.com/account/auth", {
    method: "POST",
    headers: {
      "mono-sec-key": monoSecretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: monoCode }),
  });

  const authData = await authRes.json();
  if (!authRes.ok) {
    return Response.json({ error: authData.message || "Bank connection failed" }, { status: 400 });
  }

  const accountId = authData.id;

  // Create a direct debit mandate
  const mandateRes = await fetch("https://api.withmono.com/v2/payments/mandates", {
    method: "POST",
    headers: {
      "mono-sec-key": monoSecretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account: accountId,
      amount: monthlyAmount * 100, // kobo
      description: `FSS Recoveries — ${months}-month repayment plan`,
      type: "recurring",
      reference: `FSS_RESTR_${customerId}_${Date.now()}`,
    }),
  });

  const mandateData = await mandateRes.json();
  if (!mandateRes.ok) {
    return Response.json({ error: mandateData.message || "Failed to set up repayment mandate" }, { status: 400 });
  }

  return Response.json({
    success: true,
    mandateId: mandateData.id,
    accountId,
    months,
    monthlyAmount,
  });
}
