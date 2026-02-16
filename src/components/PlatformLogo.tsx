import { GraduationCap } from "lucide-react";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";
import { cn } from "@/lib/utils";

interface PlatformLogoProps {
  /** Show icon square */
  showIcon?: boolean;
  /** Icon element override (default: GraduationCap) */
  icon?: React.ReactNode;
  /** Icon container class override */
  iconClassName?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show text label */
  showText?: boolean;
  /** Subtitle text */
  subtitle?: string;
  /** Text color class override */
  textClassName?: string;
}

const sizeMap = {
  sm: { icon: "h-8 w-8", iconInner: "h-4 w-4", textI: "text-xs", textName: "text-[10px]", sub: "text-[9px]" },
  md: { icon: "h-10 w-10", iconInner: "h-5 w-5", textI: "text-lg", textName: "text-[15px]", sub: "text-[10px]" },
  lg: { icon: "h-12 w-12", iconInner: "h-6 w-6", textI: "text-[22px]", textName: "text-[18px]", sub: "text-xs" },
};

export function PlatformLogo({
  showIcon = true,
  icon,
  iconClassName,
  size = "md",
  showText = true,
  subtitle,
  textClassName,
}: PlatformLogoProps) {
  const { settings } = usePlatformSettings();
  const logoUrl = settings?.logo_url;
  const s = sizeMap[size];

  return (
    <div className="flex items-center gap-3">
      {showIcon && (
        logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo"
            className={cn(s.icon, "rounded-lg object-contain", iconClassName)}
          />
        ) : icon ? (
          <div className={cn(s.icon, "flex items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-violet-600 shadow-md ring-1 ring-primary/20", iconClassName)}>
            {icon}
          </div>
        ) : (
          <div className={cn(s.icon, "flex items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-violet-600 shadow-sm ring-1 ring-primary/20", iconClassName)}>
            <GraduationCap className={cn(s.iconInner, "text-white")} />
          </div>
        )
      )}
      {showText && (
        <div className="flex flex-col">
          {subtitle && (
            <span className={cn("font-semibold tracking-tight", s.sub === "text-[9px]" ? "text-[10px]" : "text-sm", textClassName)}>
              {subtitle}
            </span>
          )}
          <div className="flex items-baseline gap-[1px]">
            <span className={cn(s.textI, "font-light italic text-primary tracking-tight")}>i</span>
            <span className={cn(s.textName, "font-bold tracking-[0.12em] text-foreground", textClassName)}>
              ESCOLAS
            </span>
          </div>
          {subtitle && !subtitle && (
            <span className={cn(s.sub, "uppercase tracking-[0.2em] text-muted-foreground/50")}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
