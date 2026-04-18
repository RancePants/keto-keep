import {
  DIETARY_APPROACHES,
  JOURNEY_DURATIONS,
  US_STATES,
} from '../../lib/profileHelpers.js';
import { MEMBER_STATUSES, safeTagColor } from '../../lib/memberHelpers.js';

export default function MemberFilters({
  filters,
  setFilters,
  allTags,
  allAdminTags,
  isAdmin,
}) {
  const update = (patch) => setFilters({ ...filters, ...patch });

  const selectedInterests = new Set(filters.interestTagIds || []);
  const toggleInterest = (tagId) => {
    const next = new Set(selectedInterests);
    if (next.has(tagId)) next.delete(tagId);
    else next.add(tagId);
    update({ interestTagIds: [...next] });
  };

  const clearAll = () => {
    setFilters({
      search: '',
      dietary: '',
      journey: '',
      state: '',
      status: '',
      adminTagId: '',
      interestTagIds: [],
    });
  };

  const hasActive =
    filters.search ||
    filters.dietary ||
    filters.journey ||
    filters.state ||
    filters.status ||
    filters.adminTagId ||
    (filters.interestTagIds && filters.interestTagIds.length > 0);

  return (
    <div className="member-filters">
      <div className="member-filters-row">
        <label className="member-filter-field member-filter-search">
          <span className="field-label">Search</span>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search by name"
          />
        </label>
        <label className="member-filter-field">
          <span className="field-label">Dietary approach</span>
          <select
            value={filters.dietary}
            onChange={(e) => update({ dietary: e.target.value })}
          >
            <option value="">Any</option>
            {DIETARY_APPROACHES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <label className="member-filter-field">
          <span className="field-label">Journey</span>
          <select
            value={filters.journey}
            onChange={(e) => update({ journey: e.target.value })}
          >
            <option value="">Any</option>
            {JOURNEY_DURATIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <label className="member-filter-field">
          <span className="field-label">State</span>
          <select
            value={filters.state}
            onChange={(e) => update({ state: e.target.value })}
          >
            <option value="">Any</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </label>
        {isAdmin && (
          <>
            <label className="member-filter-field">
              <span className="field-label">Status</span>
              <select
                value={filters.status}
                onChange={(e) => update({ status: e.target.value })}
              >
                <option value="">Any</option>
                {MEMBER_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="member-filter-field">
              <span className="field-label">Internal tag</span>
              <select
                value={filters.adminTagId}
                onChange={(e) => update({ adminTagId: e.target.value })}
              >
                <option value="">Any</option>
                {(allAdminTags || []).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
      </div>

      {(allTags || []).length > 0 && (
        <div className="member-filters-tag-row">
          <span className="member-filters-tag-label">Interests:</span>
          <div className="member-filters-tag-chips">
            {allTags.map((t) => {
              const on = selectedInterests.has(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`filter-tag-chip ${on ? 'filter-tag-chip-on' : ''}`}
                  onClick={() => toggleInterest(t.id)}
                  aria-pressed={on}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isAdmin && filters.adminTagId && (
        <AdminTagHint allAdminTags={allAdminTags} id={filters.adminTagId} />
      )}

      {hasActive && (
        <div className="member-filters-clear">
          <button type="button" className="icon-btn" onClick={clearAll}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function AdminTagHint({ allAdminTags, id }) {
  const tag = (allAdminTags || []).find((t) => t.id === id);
  if (!tag) return null;
  return (
    <div className="member-filters-admin-hint">
      <span
        className="admin-tag-chip-dot"
        style={{ background: safeTagColor(tag.color) }}
      />
      Showing members tagged <strong>{tag.name}</strong>
      {tag.description ? ` — ${tag.description}` : ''}
    </div>
  );
}
