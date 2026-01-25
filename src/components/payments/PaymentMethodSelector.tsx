import { PaymentMethod, PaymentProviderConfig } from '@/lib/payments/types';
import { getMethodLabel, getMethodIcon } from '@/lib/payments/providers';
import { cn } from '@/lib/utils';

interface PaymentMethodSelectorProps {
  provider: PaymentProviderConfig;
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({
  provider,
  selectedMethod,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">
        Forma de Pagamento
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {provider.supportedMethods.map((method) => (
          <button
            key={method}
            onClick={() => onSelect(method)}
            className={cn(
              "flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              selectedMethod === method
                ? "border-primary bg-primary/10"
                : "border-border"
            )}
          >
            <span className="text-2xl">{getMethodIcon(method)}</span>
            <span className="font-medium text-sm">{getMethodLabel(method)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
