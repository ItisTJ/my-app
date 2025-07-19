const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export async function createStripeCheckoutSession(items: { name: string; price: number; quantity: number }[]) {
  const response = await fetch(`${BACKEND_URL}/api/payments/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Checkout session creation failed: ${message}`);
  }

  const data = await response.json();
  return data; // { id, url }
}

