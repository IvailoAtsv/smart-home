"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";

type HelpStickyHeaderProps = {
  backHref: string;
  backLabel: string;
  title?: string;
};

export function HelpStickyHeader({
  backHref,
  backLabel,
  title,
}: HelpStickyHeaderProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full" aria-hidden />
      <header
        className={[
          "sticky top-0 z-40 -mx-4 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] transition-[background-color,box-shadow,border-color] duration-200 md:-mx-6 md:px-6 md:pb-4",
          isStuck
            ? "border-b border-border/40 bg-background/92 shadow-[0_4px_20px_-10px_rgba(61,79,48,0.18)] backdrop-blur-lg"
            : "border-b border-transparent bg-transparent shadow-none",
        ].join(" ")}
      >
        <div className="relative flex h-11 items-center">
          <Link
            href={backHref}
            aria-label={backLabel}
            className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:text-secondary active:scale-95"
          >
            <ArrowLeft size={22} weight="bold" aria-hidden />
          </Link>

          {title ? (
            <h1 className="w-full truncate px-12 text-center text-[17px] font-extrabold leading-tight tracking-tight text-primary md:px-14 md:text-[18px]">
              {title}
            </h1>
          ) : null}
        </div>
      </header>
    </>
  );
}
