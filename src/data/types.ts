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

export type RoadmapStep = {
  id: string;
  step: number;
  title: string;
  summary: string;
  power?: { label: string; detail: string };
  /** Grouped shopping list (preferred) */
  buyGroups?: BuyGroup[];
  setup: string[];
  warnings?: string[];
  code?: { title: string; language: "yaml" | "text"; content: string }[];
  /** In-app help articles for dense topics */
  help?: HelpLink[];
};
