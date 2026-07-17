import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { HelpArticle } from "@/data/help/articles";

type HelpArticleBodyProps = {
  article: HelpArticle;
};

export function HelpArticleBody({ article }: HelpArticleBodyProps) {
  return (
    <>
      <div className="space-y-12">
        {article.sections.map((section, index) => (
          <section
            key={section.heading}
            className="scroll-mt-24 border-l-[3px] border-secondary/70 pl-5 md:pl-6"
          >
            <h2 className="text-[20px] font-bold leading-snug text-primary md:text-[22px]">
              <span className="mr-2 font-mono text-[14px] font-semibold text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.heading}
            </h2>

            {section.paragraphs?.map((p) => (
              <p
                key={p.slice(0, 48)}
                className="mt-4 max-w-[65ch] text-[16px] leading-[1.7] text-foreground/92 md:text-[17px]"
              >
                {p}
              </p>
            ))}

            {section.bullets && section.bullets.length > 0 ? (
              <ul className="mt-4 max-w-[65ch] space-y-3">
                {section.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex gap-3 text-[16px] leading-[1.65] text-foreground/92 md:text-[17px]"
                  >
                    <span
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary"
                      aria-hidden
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      {article.relatedSteps && article.relatedSteps.length > 0 ? (
        <aside className="mt-14 border-t border-border/50 pt-8">
          <h2 className="text-[17px] font-bold text-primary">
            Свързани стъпки от плана
          </h2>
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
            Върни се към монтажа и отвори съответната стъпка.
          </p>
          <ul className="mt-4 divide-y divide-border/40">
            {article.relatedSteps.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="group flex min-h-11 items-center justify-between gap-3 py-3 text-[15px] font-semibold text-primary"
                >
                  <span>{r.label}</span>
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </>
  );
}
