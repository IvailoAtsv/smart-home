import type { ReactNode } from "react";

const URL_PATTERN = /https?:\/\/[^\s<]+/g;
const TRAILING_PUNCTUATION = /[.,!?;:)\]}]+$/;

type LinkifiedTextProps = {
  children: string;
};

export function LinkifiedText({ children }: LinkifiedTextProps) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of children.matchAll(URL_PATTERN)) {
    const rawUrl = match[0];
    const start = match.index ?? 0;
    const trailing = rawUrl.match(TRAILING_PUNCTUATION)?.[0] ?? "";
    const url = trailing ? rawUrl.slice(0, -trailing.length) : rawUrl;

    if (start > lastIndex) {
      parts.push(children.slice(lastIndex, start));
    }

    parts.push(
      <a
        key={`${url}-${start}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-primary underline decoration-secondary/60 underline-offset-2 hover:decoration-secondary"
      >
        {url}
      </a>,
    );

    if (trailing) parts.push(trailing);
    lastIndex = start + rawUrl.length;
  }

  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  return <>{parts}</>;
}
