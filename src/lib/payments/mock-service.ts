import { PaymentProvider, PaymentMethod, PaymentResult, PaymentIntent, Invoice } from './types';

// Simulated payment processing - replace with real API calls when backend is available
export const mockPaymentService = {
  // Process a one-time payment
  async processPayment(
    provider: PaymentProvider,
    method: PaymentMethod,
    amount: number,
    description: string
  ): Promise<PaymentResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate success (90% success rate for demo)
    const success = Math.random() > 0.1;

    if (!success) {
      return {
        success: false,
        error: 'Pagamento recusado. Verifique os dados e tente novamente.',
      };
    }

    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (method === 'pix') {
      return {
        success: true,
        paymentId,
        pixCode: generateMockPixCode(),
      };
    }

    if (method === 'boleto') {
      return {
        success: true,
        paymentId,
        boletoUrl: `https://boleto.example.com/${paymentId}`,
      };
    }

    return {
      success: true,
      paymentId,
    };
  },

  // Create a subscription
  async createSubscription(
    provider: PaymentProvider,
    method: PaymentMethod,
    studentId: string,
    planId: string
  ): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const subscriptionId = `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      paymentId: subscriptionId,
    };
  },

  // Generate invoice for payment
  async generateInvoice(
    subscriptionId: string,
    method: PaymentMethod
  ): Promise<Invoice> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const invoice: Invoice = {
      id: `INV-${Date.now()}`,
      subscriptionId,
      amount: 450.00,
      currency: 'BRL',
      status: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      description: 'Mensalidade Escolar',
    };

    if (method === 'pix') {
      invoice.pixCode = generateMockPixCode();
    }

    if (method === 'boleto') {
      invoice.boletoUrl = `https://boleto.example.com/${invoice.id}`;
      invoice.boletoBarcode = '23793.38128 60000.000003 00000.000400 1 84340000012345';
    }

    return invoice;
  },

  // Get payment history
  async getPaymentHistory(studentId: string): Promise<PaymentIntent[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock payment history
    return [
      {
        id: 'PAY-001',
        amount: 450.00,
        currency: 'BRL',
        status: 'approved',
        provider: 'mercadopago',
        method: 'pix',
        description: 'Mensalidade Janeiro/2026',
        createdAt: new Date('2026-01-05'),
        paidAt: new Date('2026-01-05'),
      },
      {
        id: 'PAY-002',
        amount: 450.00,
        currency: 'BRL',
        status: 'approved',
        provider: 'asaas',
        method: 'boleto',
        description: 'Mensalidade Dezembro/2025',
        createdAt: new Date('2025-12-03'),
        paidAt: new Date('2025-12-10'),
      },
    ];
  },
};

function generateMockPixCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '00020126580014br.gov.bcb.pix0136';
  for (let i = 0; i < 36; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
