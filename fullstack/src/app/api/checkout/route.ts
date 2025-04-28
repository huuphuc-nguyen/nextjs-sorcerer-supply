import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

if (!process.env.NEXT_STRIPE_SECRET_KEY) {
  throw new Error('NEXT_STRIPE_SECRET_KEY is not defined in the environment variables');
}
const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
    try {
      const body = await req.json(); // ✅ Read body in App Router
      const  total = body.total; // ✅ Use the body
      const orderId = body.orderId; // ✅ Use the body
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Your purchase with Sorcerer Supply Store' },
            unit_amount: Math.round(total * 100), // Convert to cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/success`,
        cancel_url: `${req.headers.get('origin')}/cancel?orderId=${orderId}`,
      });
  
      return NextResponse.json({ id: session.id });
    } catch (error: any) {
      console.error("Stripe error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }