import crypto from 'crypto';
import { createClient } from '@/frontend/lib/supabase/client';
import { PaymentStatus } from '@/frontend/types/order';

export interface RazorpayOrderOptions {
  amountInPaise: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayPaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Server-only verification of Razorpay HMAC SHA256 payment signature.
 * Securely uses RAZORPAY_KEY_SECRET on the server.
 */
export function verifyRazorpayPaymentSignature({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: RazorpayPaymentVerificationPayload): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.warn('RAZORPAY_KEY_SECRET is not configured in server environment.');
    return false;
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  return generatedSignature === razorpay_signature;
}

/**
 * Update payment and order status after online payment settlement
 */
export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
  paymentDetails?: {
    paymentId?: string;
    paymentMethod?: string;
  }
): Promise<boolean> {
  const supabase = createClient();
  const updates: any = {
    payment_status: paymentStatus,
    updated_at: new Date().toISOString(),
  };

  if (paymentStatus === 'paid') {
    updates.order_status = 'confirmed';
  }

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  if (error) {
    console.error('Failed to update order payment status:', error);
    return false;
  }

  return true;
}
