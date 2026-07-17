import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, BookOpenText } from "@phosphor-icons/react/dist/ssr";

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
  backLabel = "Всички ръководства",
  title,
  description,
}: HelpShellProps) {
  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="relative mx-auto w-full max-w-2xl px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] md:px-6 md:pt-8">
        <header className="mb-8 md:mb-10">
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-medium">
            <Link
              href={backHref}
              className="inline-flex min-h-10 items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft size={16} weight="bold" aria-hidden />
              {backLabel}
            </Link>
            <span className="hidden text-border sm:inline" aria-hidden>
              /
            </span>
            <Link
              href="/"
              className="min-h-10 text-muted-foreground transition-colors hover:text-primary"
            >
              План за монтаж
            </Link>
          </nav>

          {title ? (
            <div className="mt-6">
              <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-muted-foreground">
                <BookOpenText size={16} weight="duotone" aria-hidden />
                Ръководство
              </p>
              <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-extrabold leading-[1.15] tracking-tight text-primary">
                {title}
              </h1>
              {description ? (
                <p className="mt-4 max-w-[65ch] text-[17px] leading-[1.65] text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
          ) : null}
        </header>

        {children}
      </div>
    </div>
  );
}
