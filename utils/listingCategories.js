const LISTING_CATEGORIES = [
  {
    slug: "all",
    label: "All",
    icon: "fa-solid fa-border-all",
    keywords: [],
  },
  {
    slug: "mountain",
    label: "Mountain",
    icon: "fa-solid fa-mountain",
    keywords: ["mountain", "alps", "rockies", "ski", "chalet", "banff", "aspen", "highlands"],
  },
  {
    slug: "arctic",
    label: "Arctic",
    icon: "fa-regular fa-snowflake",
    keywords: ["arctic", "snow", "ice", "glacier", "polar", "frozen", "northern lights", "winter"],
  },
  {
    slug: "beach",
    label: "Beach",
    icon: "fa-solid fa-umbrella-beach",
    keywords: ["beach", "ocean", "sea", "coast", "island", "maldives", "bali", "mykonos", "cancun", "fiji", "phuket"],
  },
  {
    slug: "city",
    label: "City",
    icon: "fa-solid fa-city",
    keywords: ["city", "downtown", "apartment", "loft", "penthouse", "urban", "tokyo", "new york", "miami", "boston", "amsterdam"],
  },
  {
    slug: "forest",
    label: "Forest",
    icon: "fa-solid fa-tree",
    keywords: ["forest", "treehouse", "lake", "cabin", "cottage", "retreat", "woods", "national park"],
  },
  {
    slug: "castle",
    label: "Castle",
    icon: "fa-solid fa-chess-rook",
    keywords: ["castle", "historic", "villa", "brownstone", "canal house", "heritage"],
  },
  {
    slug: "desert",
    label: "Desert",
    icon: "fa-solid fa-sun",
    keywords: ["desert", "dubai", "oasis", "serengeti", "safari", "dune"],
  },
];

const FORM_CATEGORIES = LISTING_CATEGORIES.filter((category) => category.slug !== "all");
const CATEGORY_SLUGS = FORM_CATEGORIES.map((category) => category.slug);

const normalizeCategory = (value) => {
  if (typeof value !== "string") return "all";
  const normalized = value.trim().toLowerCase();
  return LISTING_CATEGORIES.some((category) => category.slug === normalized) ? normalized : "all";
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSearchableText = (listing = {}) =>
  [listing.title, listing.description, listing.location, listing.country]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const getCategoryMeta = (slug = "all") =>
  LISTING_CATEGORIES.find((category) => category.slug === slug) || LISTING_CATEGORIES[0];

const resolveListingCategory = (listing = {}) => {
  if (typeof listing.category === "string" && CATEGORY_SLUGS.includes(listing.category.trim().toLowerCase())) {
    return listing.category.trim().toLowerCase();
  }

  const searchableText = buildSearchableText(listing);
  const matchedCategory = FORM_CATEGORIES.find((category) =>
    category.keywords.some((keyword) => searchableText.includes(keyword)),
  );

  return matchedCategory ? matchedCategory.slug : undefined;
};

const buildCategoryQuery = (category) => {
  const activeCategory = normalizeCategory(category);
  if (activeCategory === "all") return {};

  const categoryMeta = getCategoryMeta(activeCategory);
  const keywordPattern = categoryMeta.keywords.map(escapeRegex).join("|");

  if (!keywordPattern) {
    return { category: activeCategory };
  }

  const keywordRegex = new RegExp(keywordPattern, "i");

  return {
    $or: [
      { category: activeCategory },
      { title: keywordRegex },
      { description: keywordRegex },
      { location: keywordRegex },
      { country: keywordRegex },
    ],
  };
};

module.exports = {
  LISTING_CATEGORIES,
  FORM_CATEGORIES,
  CATEGORY_SLUGS,
  normalizeCategory,
  getCategoryMeta,
  resolveListingCategory,
  buildCategoryQuery,
};
