import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Copy, QrCode, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PixPaymentProps {
  pixCode: string;
  amount: number;
  expiresIn?: number; // minutes
}

export function PixPayment({ pixCode, amount, expiresIn = 30 }: PixPaymentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "Cole o código no app do seu banco.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast({
        title: "Erro ao copiar",
        description: "Tente selecionar e copiar manualmente.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Pagamento via Pix</h3>
          <p className="text-3xl font-bold text-primary">{formatCurrency(amount)}</p>
        </div>

        {/* Simulated QR Code */}
        <div className="flex justify-center">
          <div className="w-48 h-48 bg-white rounded-lg border-2 border-border flex items-center justify-center">
            <div className="grid grid-cols-8 gap-1 p-4">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 ${Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            Ou copie o código Pix abaixo:
          </p>
          <div className="relative">
            <div className="p-3 bg-muted rounded-lg text-xs font-mono break-all">
              {pixCode}
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-1/2 right-2 -translate-y-1/2"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Expira em {expiresIn} minutos</span>
        </div>
      </CardContent>
    </Card>
  );
}
