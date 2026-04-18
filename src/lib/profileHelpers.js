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

// Badge display copy fallback in case the catalog row is missing.
export const BADGE_TYPE_LABEL = {
  course_complete:  'Course Complete',
  tenure_1_month:   '1 Month Strong',
  tenure_6_months:  '6 Months Strong',
  tenure_1_year:    '1 Year Strong',
  coach_spotlight:  'Coach Spotlight',
};
