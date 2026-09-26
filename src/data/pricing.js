// Prices and the feature matrix for the Pricing page. Plan names, features and labels
// are in the i18n files under "pricing"; everything here is the same in every language.

// In the same order as pricing.plans in the i18n files.
export const PLANS = [
  { tone: "basic", icon: "users", price: "₹99,000" },
  { tone: "pro", icon: "building", price: "₹2,49,000" },
  { tone: "prem", icon: "star", price: "₹4,99,000", highlight: true },
  { tone: "ent", icon: "crown", price: "₹9,99,000" },
  { tone: "state", icon: "flag", price: "₹25,00,000+" },
];

// One row per pricing.cmp_rows entry, one value per plan: true = included, false = not
// included, a string = the pricing.levels key to show.
export const COMPARISON = [
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
  ["basic", "basic", "adv", "adv", "adv"],
  [false, true, "adv", "adv", "adv"],
  [false, "basic", "adv", "adv", "adv"],
  ["basic", "adv", "adv", "adv", "adv"],
  [false, false, "basic", "adv", "adv"],
  ["web", "app1", "app2", "app3", "custom"],
  [false, false, false, true, "unlimited"],
  [true, true, true, true, true],
  ["email", "email", "priority", "priority", "sla"],
];

export const IMPLEMENTATION_FEES = ["₹25,000", "₹50,000", "₹1,00,000", "₹2,00,000", "₹5,00,000+"];
export const AMC_FEES = ["₹15,000", "₹35,000", "₹75,000", "₹1,50,000", "₹3,00,000+"];
