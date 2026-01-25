import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProviderSelector } from './ProviderSelector';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PixPayment } from './PixPayment';
import { BoletoPayment } from './BoletoPayment';
import { PaymentProviderConfig, PaymentMethod, PaymentResult } from '@/lib/payments/types';
import { mockPaymentService } from '@/lib/payments/mock-service';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  description: string;
  onSuccess?: (result: PaymentResult) => void;
}

type PaymentStep = 'select' | 'details' | 'processing' | 'result';

export function PaymentDialog({
  open,
  onOpenChange,
  amount,
  description,
  onSuccess,
}: PaymentDialogProps) {
  const [step, setStep] = useState<PaymentStep>('select');
  const [selectedProvider, setSelectedProvider] = useState<PaymentProviderConfig | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSelectProvider = (provider: PaymentProviderConfig) => {
    setSelectedProvider(provider);
    setSelectedMethod(null);
  };

  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    if (selectedProvider && selectedMethod) {
      if (selectedMethod === 'pix' || selectedMethod === 'boleto') {
        processPayment();
      } else {
        setStep('details');
      }
    }
  };

  const processPayment = async () => {
    if (!selectedProvider || !selectedMethod) return;

    setStep('processing');

    try {
      const paymentResult = await mockPaymentService.processPayment(
        selectedProvider.id,
        selectedMethod,
        amount,
        description
      );

      setResult(paymentResult);
      setStep('result');

      if (paymentResult.success) {
        onSuccess?.(paymentResult);
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Erro ao processar pagamento. Tente novamente.',
      });
      setStep('result');
    }
  };

  const handleReset = () => {
    setStep('select');
    setSelectedProvider(null);
    setSelectedMethod(null);
    setResult(null);
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCvv('');
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const renderStep = () => {
    switch (step) {
      case 'select':
        return (
          <div className="space-y-6">
            <ProviderSelector
              selectedProvider={selectedProvider}
              onSelect={handleSelectProvider}
            />

            {selectedProvider && (
              <PaymentMethodSelector
                provider={selectedProvider}
                selectedMethod={selectedMethod}
                onSelect={handleSelectMethod}
              />
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!selectedProvider || !selectedMethod}
              >
                Continuar
              </Button>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Valor a pagar</p>
              <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Número do Cartão</Label>
                <Input
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Nome no Cartão</Label>
                <Input
                  placeholder="Nome como está no cartão"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Validade</Label>
                  <Input
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input
                    placeholder="123"
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep('select')}>
                Voltar
              </Button>
              <Button onClick={processPayment}>
                Pagar {formatCurrency(amount)}
              </Button>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">Processando pagamento...</p>
            <p className="text-sm text-muted-foreground">
              Por favor, aguarde. Não feche esta janela.
            </p>
          </div>
        );

      case 'result':
        if (!result) return null;

        if (result.pixCode) {
          return (
            <div className="space-y-4">
              <PixPayment pixCode={result.pixCode} amount={amount} />
              <Button variant="outline" className="w-full" onClick={handleClose}>
                Fechar
              </Button>
            </div>
          );
        }

        if (result.boletoUrl) {
          return (
            <div className="space-y-4">
              <BoletoPayment
                boletoUrl={result.boletoUrl}
                barcode="23793.38128 60000.000003 00000.000400 1 84340000012345"
                amount={amount}
                dueDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
              />
              <Button variant="outline" className="w-full" onClick={handleClose}>
                Fechar
              </Button>
            </div>
          );
        }

        return (
          <div className="py-8 text-center space-y-4">
            {result.success ? (
              <>
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-semibold text-green-600">
                  Pagamento Aprovado!
                </h3>
                <p className="text-muted-foreground">
                  Seu pagamento foi processado com sucesso.
                </p>
                <p className="text-sm text-muted-foreground">
                  ID: {result.paymentId}
                </p>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-destructive mx-auto" />
                <h3 className="text-xl font-semibold text-destructive">
                  Pagamento Recusado
                </h3>
                <p className="text-muted-foreground">{result.error}</p>
              </>
            )}

            <div className="flex gap-3 pt-4">
              {!result.success && (
                <Button variant="outline" className="flex-1" onClick={handleReset}>
                  Tentar Novamente
                </Button>
              )}
              <Button className="flex-1" onClick={handleClose}>
                Fechar
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' && 'Realizar Pagamento'}
            {step === 'details' && 'Dados do Cartão'}
            {step === 'processing' && 'Processando'}
            {step === 'result' && (result?.success ? 'Sucesso' : 'Resultado')}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' && description}
            {step === 'details' && 'Insira os dados do seu cartão para continuar.'}
          </DialogDescription>
        </DialogHeader>

        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
