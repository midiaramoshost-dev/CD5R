import { PaymentProviderConfig } from './types';

export const paymentProviders: PaymentProviderConfig[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    logo: '💳',
    supportedMethods: ['credit_card', 'debit_card'],
    isActive: true,
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    logo: '🟡',
    supportedMethods: ['credit_card', 'debit_card', 'pix', 'boleto'],
    isActive: true,
  },
  {
    id: 'asaas',
    name: 'Asaas',
    logo: '🔵',
    supportedMethods: ['credit_card', 'pix', 'boleto'],
    isActive: true,
  },
  {
    id: 'pagseguro',
    name: 'PagSeguro',
    logo: '🟢',
    supportedMethods: ['credit_card', 'debit_card', 'pix', 'boleto'],
    isActive: true,
  },
];

export const getProviderById = (id: string): PaymentProviderConfig | undefined => {
  return paymentProviders.find(p => p.id === id);
};

export const getMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    pix: 'Pix',
    boleto: 'Boleto Bancário',
  };
  return labels[method] || method;
};

export const getMethodIcon = (method: string): string => {
  const icons: Record<string, string> = {
    credit_card: '💳',
    debit_card: '💳',
    pix: '📱',
    boleto: '📄',
  };
  return icons[method] || '💰';
};
