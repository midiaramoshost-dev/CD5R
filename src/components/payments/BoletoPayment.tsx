import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Copy, Download, FileText, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BoletoPaymentProps {
  boletoUrl: string;
  barcode?: string;
  amount: number;
  dueDate: Date;
}

export function BoletoPayment({ boletoUrl, barcode, amount, dueDate }: BoletoPaymentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!barcode) return;
    try {
      await navigator.clipboard.writeText(barcode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "Use o código de barras para pagar.",
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <Card className="border-2 border-amber-500/20 bg-amber-500/5">
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10">
            <FileText className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-semibold">Boleto Bancário</h3>
          <p className="text-3xl font-bold text-amber-600">{formatCurrency(amount)}</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Vencimento: <strong>{formatDate(dueDate)}</strong></span>
        </div>

        {barcode && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Código de barras:
            </p>
            <div className="relative">
              <div className="p-3 bg-muted rounded-lg text-xs font-mono text-center">
                {barcode}
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
        )}

        <div className="flex gap-3">
          <Button 
            className="flex-1" 
            variant="outline"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar Código
          </Button>
          <Button 
            className="flex-1 bg-amber-600 hover:bg-amber-700"
            onClick={() => window.open(boletoUrl, '_blank')}
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
