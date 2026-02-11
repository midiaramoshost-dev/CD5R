import { PaymentProviderConfig } from '@/lib/payments/types';
import { paymentProviders } from '@/lib/payments/providers';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProviderSelectorProps {
  selectedProvider: PaymentProviderConfig | null;
  onSelect: (provider: PaymentProviderConfig) => void;
  disabled?: boolean;
}

export function ProviderSelector({
  selectedProvider,
  onSelect,
  disabled = false,
}: ProviderSelectorProps) {
  const activeProviders = paymentProviders.filter(p => p.isActive);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">
        Provedor de Pagamento
      </h4>
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-3", disabled && "opacity-60")}
      >
        {activeProviders.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => onSelect(provider)}
            disabled={disabled}
            className={cn(
              "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
              disabled
                ? "cursor-not-allowed"
                : "hover:border-primary/50 hover:bg-primary/5",
              selectedProvider?.id === provider.id
                ? "border-primary bg-primary/10"
                : "border-border"
            )}
          >
            {selectedProvider?.id === provider.id && (
              <div className="absolute top-2 right-2">
                <Check className="h-4 w-4 text-primary" />
              </div>
            )}
            <span className="text-3xl">{provider.logo}</span>
            <span className="font-medium text-sm">{provider.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
