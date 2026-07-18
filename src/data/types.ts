export type BuyItem = {
  /** Stable id for checklist persistence */
  id: string;
  label: string;
  store: string;
  approxPrice?: string;
  url: string;
  notes?: string;
};

export type BuyGroup = {
  id: string;
  title: string;
  /** Short tip under the group heading */
  description?: string;
  /** User only needs to pick one option from this group */
  pickOne?: boolean;
  items: BuyItem[];
};

export type HelpLink = {
  href: string;
  label: string;
  description?: string;
};

/** Plain text, or a clickable link to another roadmap step. */
export type SetupSegment = string | { stepId: string; label: string };

/**
 * One setup instruction line.
 * - `string` — plain paragraph
 * - `SetupSegment[]` — mixed text + step links
 */
export type SetupLine = string | SetupSegment[];

export type StepImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type RoadmapStep = {
  id: string;
  step: number;
  title: string;
  summary: string;
  power?: { label: string; detail: string };
  /** Grouped shopping list (preferred) */
  buyGroups?: BuyGroup[];
  setup: SetupLine[];
  warnings?: string[];
  code?: { title: string; language: "yaml" | "text"; content: string }[];
  /** In-app help articles for dense topics */
  help?: HelpLink[];
  images?: StepImage[];
};

/** Build a setup line that mixes text and step links. */
export function line(...segments: SetupSegment[]): SetupLine {
  return segments;
}

/** Clickable reference to another step in the same plan. */
export function stepRef(id: string, label: string): SetupSegment {
  return { stepId: id, label };
}
