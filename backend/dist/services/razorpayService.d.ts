import Razorpay from 'razorpay';
export declare function getRazorpayClient(): Razorpay;
export interface RazorpayOrderResult {
    id: string;
    amount: number;
    currency: string;
}
export declare function createRazorpayOrder(amount: number, receiptId: string): Promise<RazorpayOrderResult>;
export declare function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean;
//# sourceMappingURL=razorpayService.d.ts.map