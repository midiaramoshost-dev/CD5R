// Payment Provider Types
export type PaymentProvider = 'stripe' | 'mercadopago' | 'asaas' | 'pagseguro';

export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'boleto';

export type PaymentStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'cancelled' | 'refunded';

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'past_due';

export interface PaymentProviderConfig {
  id: PaymentProvider;
  name: string;
  logo: string;
  supportedMethods: PaymentMethod[];
  isActive: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  method: PaymentMethod;
  description: string;
  createdAt: Date;
  paidAt?: Date;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface Subscription {
  id: string;
  studentId: string;
  studentName: string;
  planName: string;
  amount: number;
  currency: string;
  status: SubscriptionStatus;
  provider: PaymentProvider;
  method: PaymentMethod;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  nextBillingDate: Date;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  dueDate: Date;
  paidAt?: Date;
  description: string;
  pixCode?: string;
  boletoUrl?: string;
  boletoBarcode?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
  redirectUrl?: string;
  pixCode?: string;
  boletoUrl?: string;
}
