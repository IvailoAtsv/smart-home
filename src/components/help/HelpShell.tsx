import type { ReactNode } from "react";
import { HelpStickyHeader } from "./HelpStickyHeader";

type HelpShellProps = {
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  title?: string;
  description?: string;
};

export function HelpShell({
  children,
  backHref = "/help",
  backLabel = "Назад",
  title,
  description,
}: HelpShellProps) {
  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="mx-auto w-full max-w-2xl px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:px-6">
        <HelpStickyHeader
          backHref={backHref}
          backLabel={backLabel}
          title={title}
        />

        {description ? (
          <p className="mb-8 mt-6 max-w-[65ch] text-[17px] leading-[1.65] text-muted-foreground md:mb-10 md:mt-8">
            {description}
          </p>
        ) : null}

        {children}
      </div>
    </div>
  );
}
