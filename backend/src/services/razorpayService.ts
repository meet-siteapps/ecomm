import Razorpay from 'razorpay';
import crypto from 'crypto';
import { AppError } from '../middleware/errorHandler.js';

let _razorpayClient: Razorpay | null = null;

/**
 * Returns a singleton Razorpay client initialized with server-only credentials.
 */
export function getRazorpayClient(): Razorpay {
  if (_razorpayClient) return _razorpayClient;

  const key_id = process.env['RAZORPAY_KEY_ID'];
  const key_secret = process.env['RAZORPAY_KEY_SECRET'];

  if (!key_id || !key_secret) {
    throw new AppError(
      'Razorpay configuration is missing. Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in environment variables.',
      500,
      'RAZORPAY_CONFIG_ERROR',
    );
  }

  _razorpayClient = new Razorpay({
    key_id,
    key_secret,
  });

  return _razorpayClient;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
}

/**
 * Creates a Razorpay order for the specified amount.
 *
 * @param amount - Amount in INR (will be converted to paise: amount * 100)
 * @param receiptId - Internal order identifier / receipt string
 * @returns Object containing Razorpay order ID, amount in paise, and currency
 */
export async function createRazorpayOrder(
  amount: number,
  receiptId: string,
): Promise<RazorpayOrderResult> {
  const razorpay = getRazorpayClient();

  // Razorpay amounts are in smallest currency sub-unit (paise for INR)
  const amountInPaise = Math.round(amount * 100);

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId.slice(0, 40), // Razorpay receipt max 40 characters
    });

    return {
      id: razorpayOrder.id,
      amount: Number(razorpayOrder.amount),
      currency: razorpayOrder.currency,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown Razorpay error';
    throw new AppError(
      `Failed to create Razorpay order: ${message}`,
      500,
      'RAZORPAY_ORDER_FAILED',
    );
  }
}

/**
 * Verifies the cryptographic HMAC SHA-256 signature returned by Razorpay Checkout.
 *
 * Formula: HMAC_SHA256(orderId + "|" + paymentId, secret) === signature
 *
 * @param orderId - Razorpay order ID (e.g. order_DBJOWzybf0sJbb)
 * @param paymentId - Razorpay payment ID (e.g. pay_29QQoUBcxNqkPk)
 * @param signature - Cryptographic signature provided by Razorpay frontend callback
 * @returns Boolean indicating whether the signature is cryptographically valid
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const secret = process.env['RAZORPAY_KEY_SECRET'];
  if (!secret) {
    throw new AppError(
      'Razorpay secret key is not configured on the server.',
      500,
      'RAZORPAY_CONFIG_ERROR',
    );
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  // Use timing-safe buffer comparison to prevent timing attacks
  const signatureBuffer = Buffer.from(signature, 'utf-8');
  const generatedBuffer = Buffer.from(generatedSignature, 'utf-8');

  if (signatureBuffer.length !== generatedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, generatedBuffer);
}
