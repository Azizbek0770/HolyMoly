import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive";
  showZero?: boolean;
  max?: number;
  pulse?: boolean;
}

export function NotificationBadge({
  count,
  className,
  variant = "default",
  showZero = false,
  max = 99,
  pulse = false,
}: NotificationBadgeProps) {
  const [animate, setAnimate] = useState(false);
  const displayCount = count > max ? `${max}+` : count;

  useEffect(() => {
    if (count > 0 && pulse) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [count, pulse]);

  if (count === 0 && !showZero) return null;

  return (
    <Badge
      variant={variant}
      className={cn(
        "rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs",
        animate && "animate-pulse",
        className,
      )}
    >
      {displayCount}
    </Badge>
  );
}
