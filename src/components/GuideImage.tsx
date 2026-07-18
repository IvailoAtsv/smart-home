type GuideImageData = {
  src: string;
  alt: string;
  caption?: string;
};

type GuideImageProps = {
  image: GuideImageData;
  className?: string;
};

export function GuideImage({ image, className = "" }: GuideImageProps) {
  return (
    <figure
      className={[
        "overflow-hidden rounded-[16px] border border-border/60 bg-[#FFF8EC]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        className="block h-auto w-full"
        decoding="async"
        loading="lazy"
      />
      {image.caption ? (
        <figcaption className="border-t border-border/40 bg-background px-3 py-2.5 text-[13px] leading-snug text-muted-foreground">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
