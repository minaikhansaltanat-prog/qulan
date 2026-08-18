export function ModulePlaceholder({
  title,
  description,
  phase,
  siteBlocks,
}: {
  title: string;
  description: string;
  phase: string;
  /** Real block names as they appear on the live site (index.html), so the
   * client can see this module maps to the actual content, not a generic
   * placeholder. */
  siteBlocks?: string[];
}) {
  return (
    <div className="max-w-2xl">
      <span className="inline-flex items-center rounded-full bg-bgreen/10 px-3 py-1 text-[12px] font-semibold text-bgreen">
        {phase}
      </span>
      <h1 className="mt-4 font-display text-[26px] leading-tight tracking-[-0.01em] text-ink">{title}</h1>
      <p className="mt-3 text-[15px] leading-[1.7] text-muted">{description}</p>

      {siteBlocks && siteBlocks.length > 0 && (
        <div className="mt-6">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">
            Сайттағы нақты блоктар
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {siteBlocks.map((block) => (
              <li
                key={block}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-ink"
              >
                {block}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
