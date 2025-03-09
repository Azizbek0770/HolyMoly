import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "primary" | "secondary" | "white";
}

export function Spinner({
  size = "md",
  className,
  color = "primary",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4",
  };

  const colorClasses = {
    primary: "border-primary",
    secondary: "border-secondary",
    white: "border-white",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-t-transparent",
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
    />
  );
}

export function SpinnerOverlay({
  children,
  loading,
  className,
}: {
  children: React.ReactNode;
  loading: boolean;
  className?: string;
}) {
  if (!loading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm",
          className,
        )}
      >
        <Spinner size="lg" />
      </div>
    </div>
  );
}
