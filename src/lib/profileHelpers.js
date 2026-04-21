// Profile enums, labels, US-state list, and dietary palette.
// All lookups are pure data so components can render consistently.

export const DIETARY_APPROACHES = [
  { value: 'keto',                 label: 'Keto' },
  { value: 'carnivore',            label: 'Carnivore' },
  { value: 'paleo',                label: 'Paleo' },
  { value: 'low_carb',             label: 'Low-Carb' },
  { value: 'ancestral_whole_food', label: 'Ancestral / Whole Food' },
  { value: 'exploring',            label: 'Exploring' },
];

const DIETARY_LABEL = Object.fromEntries(
  DIETARY_APPROACHES.map((d) => [d.value, d.label])
);

export function dietaryLabel(value) {
  return DIETARY_LABEL[value] || null;
}

export const JOURNEY_DURATIONS = [
  { value: 'just_starting',        label: 'Just Getting Started' },
  { value: 'less_than_6_months',   label: 'Less than 6 Months' },
  { value: 'six_months_to_1_year', label: '6 Months – 1 Year' },
  { value: 'one_to_3_years',       label: '1 – 3 Years' },
  { value: 'three_plus_years',     label: '3+ Years' },
];

const JOURNEY_LABEL = Object.fromEntries(
  JOURNEY_DURATIONS.map((d) => [d.value, d.label])
);

export function journeyLabel(value) {
  return JOURNEY_LABEL[value] || null;
}

// Map a dietary_approach enum to a palette slot. CSS reads from the
// resulting className (e.g. `dietary-tag-keto`) so colors live in CSS,
// not inline styles.
export function dietaryPaletteClass(value) {
  if (!value) return '';
  return `dietary-tag-${value.replace(/_/g, '-')}`;
}

// Canonical US states / territories — 2-letter codes stored in DB,
// full names shown in the dropdown. Order: 50 states then DC + territories.
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'VI', name: 'U.S. Virgin Islands' },
  { code: 'GU', name: 'Guam' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'MP', name: 'Northern Mariana Islands' },
];

const STATE_NAME = Object.fromEntries(US_STATES.map((s) => [s.code, s.name]));

export function stateName(code) {
  return STATE_NAME[code] || null;
}

export function formatLocation({ city, state }) {
  const parts = [];
  if (city && city.trim()) parts.push(city.trim());
  if (state) parts.push(state);
  return parts.join(', ');
}

// Soft guidance, not enforced. UI shows a character count that turns
// a warmer color past this threshold but still allows saving.
export const ABOUT_SOFT_LIMIT = 500;

// Honor (badge) display copy fallback in case the catalog row is missing.
// Covers all 28 honor types from the Phase 5H schema.
export const BADGE_TYPE_LABEL = {
  // Existing (5)
  course_complete:      'Sage',
  tenure_1_month:       '1 Month Strong',
  tenure_6_months:      '6 Months Strong',
  tenure_1_year:        '1 Year Strong',
  coach_spotlight:      'Coach Spotlight',
  // Community (9)
  town_crier:           'Town Crier',
  bard_bronze:          'Bard (Bronze)',
  bard_silver:          'Bard (Silver)',
  bard_gold:            'Bard (Gold)',
  scribe:               'Scribe',
  herald:               'Herald',
  good_neighbor_bronze: 'Good Neighbor (Bronze)',
  good_neighbor_silver: 'Good Neighbor (Silver)',
  good_neighbor_gold:   'Good Neighbor (Gold)',
  // Growth (additional 8: 6 loyal_knight + scholar + pilgrim)
  loyal_knight_7:       'Loyal Knight (7 Days)',
  loyal_knight_30:      'Loyal Knight (30 Days)',
  loyal_knight_90:      'Loyal Knight (90 Days)',
  loyal_knight_180:     'Loyal Knight (180 Days)',
  loyal_knight_270:     'Loyal Knight (270 Days)',
  loyal_knight_365:     'Loyal Knight (365 Days)',
  scholar:              'Scholar',
  pilgrim:              'Pilgrim',
  // Building (4)
  gatekeeper_1:         'Gatekeeper',
  gatekeeper_5:         'Gatekeeper (Silver)',
  gatekeeper_10:        'Gatekeeper (Gold)',
  standard_bearer:      'Standard Bearer',
  // Special (2 new)
  founding_member:      'Founding Member',
  champions_honor:      "Champion's Honor",
};

// Some badge_types have filenames that don't match the type slug directly.
const SLUG_OVERRIDES = { course_complete: 'sage' };

// Convert a badge_type enum to its hyphenated slug for image filenames
// (e.g. 'loyal_knight_30' → 'loyal-knight-30' → /honors/honor-loyal-knight-30.png).
export function badgeTypeSlug(badgeType) {
  if (!badgeType) return '';
  if (SLUG_OVERRIDES[badgeType]) return SLUG_OVERRIDES[badgeType];
  return String(badgeType).replace(/_/g, '-');
}

// Hall of Honors category ordering + display copy. Mirrors the
// badge_category enum values and drives the Hall of Honors render order.
export const HONOR_CATEGORIES = [
  { key: 'community', label: 'Community' },
  { key: 'growth',    label: 'Growth' },
  { key: 'building',  label: 'Building' },
  { key: 'special',   label: 'Special' },
];

export const HONOR_CATEGORY_LABEL = Object.fromEntries(
  HONOR_CATEGORIES.map((c) => [c.key, c.label])
);
