import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';
import { useToast } from '../components/ui/toastContext.js';
import { supabase } from '../lib/supabase.js';
import {
  ABOUT_SOFT_LIMIT,
  DIETARY_APPROACHES,
  JOURNEY_DURATIONS,
  US_STATES,
  dietaryLabel,
  formatLocation,
  journeyLabel,
  stateName,
} from '../lib/profileHelpers.js';
import { safeTagColor, statusColorClass, statusLabel } from '../lib/memberHelpers.js';
import DietaryApproachTag from '../components/profile/DietaryApproachTag.jsx';
import BadgeIcon from '../components/profile/BadgeIcon.jsx';
import InterestTagChip from '../components/profile/InterestTagChip.jsx';
import AwardBadgeModal from '../components/profile/AwardBadgeModal.jsx';
import AssignAdminTagModal from '../components/members/AssignAdminTagModal.jsx';
import ManageMemberModal from '../components/members/ManageMemberModal.jsx';
import Modal from '../components/ui/Modal.jsx';
import StreakBadge from '../components/ui/StreakBadge.jsx';
import ProfileFrame from '../components/ui/ProfileFrame.jsx';
import VacationModeSection from '../components/profile/VacationModeSection.jsx';
import FrameSelector from '../components/profile/FrameSelector.jsx';
import { progressToNext } from '../lib/streakHelpers.js';
import usePageTitle from '../lib/usePageTitle.js';

// ---------------- Avatar ----------------
function Avatar({ path, displayName, size = 128, frameType = 'none' }) {
  const { getAvatarUrl } = useAuth();
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!path) return undefined;
    let cancelled = false;
    getAvatarUrl(path).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [path, getAvatarUrl]);

  const initial = (displayName || '?').trim().charAt(0).toUpperCase();
  const dimStyle = { width: size, height: size };

  const inner = path && url ? (
    <img
      src={url}
      alt={displayName || 'Avatar'}
      className="avatar-img"
      style={frameType === 'none' ? dimStyle : { width: '100%', height: '100%', objectFit: 'cover' }}
    />
  ) : (
    <div
      className="avatar-fallback"
      style={frameType === 'none' ? dimStyle : { width: '100%', height: '100%' }}
      aria-label={displayName || 'Avatar'}
    >
      <span>{initial}</span>
    </div>
  );

  if (!frameType || frameType === 'none') return inner;
  return (
    <ProfileFrame frameType={frameType} size={size}>
      {inner}
    </ProfileFrame>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

// ---------------- data helpers ----------------

async function loadAllTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('id, name')
    .order('name', { ascending: true });
  if (error) {
    console.error('loadAllTags:', error.message);
    return [];
  }
  return data || [];
}

async function loadMemberTags(userId) {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('member_tags')
    .select('tag_id')
    .eq('user_id', userId);
  if (error) {
    console.error('loadMemberTags:', error.message);
    return [];
  }
  return (data || []).map((r) => r.tag_id);
}

async function loadMemberBadges(userId) {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('member_badges')
    .select('awarded_at, badges!inner(badge_type, name, description, icon_url)')
    .eq('user_id', userId)
    .order('awarded_at', { ascending: false });
  if (error) {
    console.error('loadMemberBadges:', error.message);
    return [];
  }
  return (data || []).map((r) => ({
    awarded_at: r.awarded_at,
    badge_type: r.badges?.badge_type,
    name: r.badges?.name,
    description: r.badges?.description,
    icon_url: r.badges?.icon_url,
  }));
}

async function loadMemberAdminTags(userId) {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('member_admin_tags')
    .select('tag_id, note, admin_tags!inner(id, name, description, color)')
    .eq('user_id', userId);
  if (error) {
    // Non-admins get RLS-denied; treat as empty.
    return [];
  }
  return (data || [])
    .filter((r) => r.admin_tags)
    .map((r) => ({ ...r.admin_tags, note: r.note }));
}

// ---------------- Editor ----------------

function ProfileEditor({ profile, updateProfile, uploadAvatar, onSaved }) {
  const [form, setForm] = useState({
    display_name: profile.display_name || '',
    bio: profile.bio || '',
    dietary_approach: profile.dietary_approach || '',
    journey_duration: profile.journey_duration || '',
    city: profile.city || '',
    state: profile.state || '',
    about_me: profile.about_me || '',
    my_why: profile.my_why || '',
  });

  const [allTags, setAllTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState(new Set());
  const [initialTagIds, setInitialTagIds] = useState(new Set());
  const [tagsLoading, setTagsLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      const [catalog, owned] = await Promise.all([
        loadAllTags(),
        loadMemberTags(profile.id),
      ]);
      if (cancelled) return;
      setAllTags(catalog);
      const ownedSet = new Set(owned);
      setSelectedTagIds(ownedSet);
      setInitialTagIds(ownedSet);
      setTagsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [profile.id]);

  const onField = (k) => (e) => {
    const v = e.target.value;
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const toggleTag = (tag) => {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tag.id)) next.delete(tag.id);
      else next.add(tag.id);
      return next;
    });
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        display_name: form.display_name.trim(),
        bio: form.bio.trim() || null,
        dietary_approach: form.dietary_approach || null,
        journey_duration: form.journey_duration || null,
        city: form.city.trim() || null,
        state: form.state || null,
        about_me: form.about_me.trim() || null,
        my_why: form.my_why.trim() || null,
      };
      const { error } = await updateProfile(payload);
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Could not save.' });
        return;
      }

      // Diff tag selections and write deltas.
      const toAdd = [...selectedTagIds].filter((id) => !initialTagIds.has(id));
      const toRemove = [...initialTagIds].filter((id) => !selectedTagIds.has(id));

      if (toAdd.length) {
        const rows = toAdd.map((tag_id) => ({ user_id: profile.id, tag_id }));
        const { error: addErr } = await supabase.from('member_tags').insert(rows);
        if (addErr) {
          setMessage({ type: 'error', text: addErr.message });
          return;
        }
      }
      if (toRemove.length) {
        const { error: rmErr } = await supabase
          .from('member_tags')
          .delete()
          .eq('user_id', profile.id)
          .in('tag_id', toRemove);
        if (rmErr) {
          setMessage({ type: 'error', text: rmErr.message });
          return;
        }
      }

      setInitialTagIds(new Set(selectedTagIds));
      setMessage({ type: 'success', text: 'Saved.' });
      if (onSaved) onSaved();
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Could not save.' });
    } finally {
      setSaving(false);
    }
  };

  const onPickFile = () => fileInputRef.current?.click();

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please choose an image file.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be under 5MB.' });
      return;
    }
    setUploading(true);
    setMessage(null);
    try {
      const { error } = await uploadAvatar(file);
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Upload failed.' });
      } else {
        setMessage({ type: 'success', text: 'Avatar updated.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const aboutCount = form.about_me.length;
  const aboutOver = aboutCount > ABOUT_SOFT_LIMIT;

  return (
    <form onSubmit={onSave} className="profile-edit">
      {/* Avatar block */}
      <section className="profile-edit-section">
        <div className="profile-top">
          <div className="avatar-wrap avatar-editable">
            <Avatar
              key={profile.avatar_url || 'none'}
              path={profile.avatar_url}
              displayName={form.display_name || profile.display_name}
              size={140}
              frameType={profile.selected_frame}
            />
            <button
              type="button"
              className="avatar-overlay"
              onClick={onPickFile}
              disabled={uploading}
              aria-label="Upload new avatar"
            >
              {uploading ? 'Uploading…' : 'Change photo'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              hidden
            />
          </div>

          <div className="profile-meta">
            <div className="profile-badges">
              <span className={`role-badge role-${profile.role}`}>{profile.role}</span>
            </div>
            <label className="field profile-name-field">
              <span className="field-label">Display name</span>
              <input
                type="text"
                value={form.display_name}
                onChange={onField('display_name')}
                required
                maxLength={60}
              />
            </label>
            <div className="profile-email">{profile.email}</div>
            <div className="profile-since">
              Member since {formatDate(profile.created_at)}
            </div>
          </div>
        </div>
      </section>

      {/* Personal info */}
      <section className="profile-edit-section">
        <h2 className="section-title">Personal info</h2>
        <div className="grid-2">
          <label className="field">
            <span className="field-label">Dietary approach</span>
            <select value={form.dietary_approach} onChange={onField('dietary_approach')}>
              <option value="">Prefer not to say</option>
              {DIETARY_APPROACHES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Journey duration</span>
            <select value={form.journey_duration} onChange={onField('journey_duration')}>
              <option value="">Prefer not to say</option>
              {JOURNEY_DURATIONS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">City</span>
            <input
              type="text"
              value={form.city}
              onChange={onField('city')}
              placeholder="e.g. Austin"
              maxLength={80}
            />
          </label>
          <label className="field">
            <span className="field-label">State</span>
            <select value={form.state} onChange={onField('state')}>
              <option value="">—</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* About me */}
      <section className="profile-edit-section">
        <h2 className="section-title">About me</h2>
        <label className="field">
          <textarea
            rows={5}
            value={form.about_me}
            onChange={onField('about_me')}
            placeholder="Tell the community a little about yourself."
          />
          <span className={`char-hint ${aboutOver ? 'char-hint-over' : ''}`}>
            {aboutCount} / {ABOUT_SOFT_LIMIT}
          </span>
        </label>
      </section>

      {/* My why */}
      <section className="profile-edit-section my-why-section">
        <h2 className="section-title">My why</h2>
        <p className="section-sub">
          What brought you here matters. If you're comfortable sharing, this is a
          place that helps others feel less alone.
        </p>
        <label className="field">
          <textarea
            rows={6}
            value={form.my_why}
            onChange={onField('my_why')}
            placeholder="What brought you to metabolic health?"
          />
        </label>
      </section>

      {/* Bio (kept for backwards compat — brief headline) */}
      <section className="profile-edit-section">
        <h2 className="section-title">Short headline</h2>
        <p className="section-sub">One line that captures the gist.</p>
        <label className="field">
          <input
            type="text"
            value={form.bio}
            onChange={onField('bio')}
            placeholder='e.g. "Dad of three, 18 months keto, slow and steady."'
            maxLength={160}
          />
        </label>
      </section>

      {/* Interest tags */}
      <section className="profile-edit-section">
        <h2 className="section-title">Interests</h2>
        <p className="section-sub">
          Tap to choose the topics you want to see more of. You can change these anytime.
        </p>
        {tagsLoading ? (
          <div className="muted">Loading interests…</div>
        ) : allTags.length === 0 ? (
          <div className="muted">No interest tags available yet.</div>
        ) : (
          <div className="interest-chip-row">
            {allTags.map((t) => (
              <InterestTagChip
                key={t.id}
                tag={t}
                selected={selectedTagIds.has(t.id)}
                onToggle={toggleTag}
              />
            ))}
          </div>
        )}
      </section>

      {message && (
        <div
          className={message.type === 'error' ? 'form-error' : 'form-success'}
          role={message.type === 'error' ? 'alert' : 'status'}
        >
          {message.text}
        </div>
      )}

      <div className="profile-edit-actions">
        <button type="submit" className="btn btn-primary btn-large" disabled={saving}>
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </div>
    </form>
  );
}

// ProfileEditor owns the main form. The vacation + frame sections are
// self-contained and live outside the form — they save via their own RPCs /
// updateProfile calls.
function ProfileEditorExtras({ profile, onSaved }) {
  return (
    <>
      <VacationModeSection profile={profile} onChanged={onSaved} />
      <FrameSelector profile={profile} onChanged={onSaved} />
    </>
  );
}

// ---------------- Delete own account (danger zone) ----------------

function DeleteAccountSection({ isOwner }) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState('');
  const { deleteOwnAccount } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  if (isOwner) return null;

  const closeModal = () => {
    if (deleting) return;
    setOpen(false);
    setConfirmText('');
    setErr('');
  };

  const onConfirm = async () => {
    if (confirmText.trim().toUpperCase() !== 'DELETE') {
      setErr('Type DELETE to confirm.');
      return;
    }
    setDeleting(true);
    setErr('');
    const { ok, error } = await deleteOwnAccount();
    setDeleting(false);
    if (!ok) {
      setErr(error?.message || 'Could not delete your account.');
      return;
    }
    toast.success("Your account was deleted. Take care of yourself out there.");
    navigate('/', { replace: true });
  };

  return (
    <section className="profile-edit-section danger-zone">
      <h2 className="section-title danger-zone-title">Danger zone</h2>
      <p className="section-sub">
        Permanently delete your account and all associated data. This cannot be undone.
      </p>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => setOpen(true)}
      >
        Delete my account
      </button>

      <Modal
        open={open}
        onClose={closeModal}
        title="Delete your account?"
        size="sm"
        variant="warning"
      >
        <div className="manage-member-body">
          <p className="manage-member-lead">
            This will permanently delete your account, profile, posts, replies,
            reactions, and everything else tied to it. <strong>This cannot be undone.</strong>
          </p>
          <label className="field">
            <span className="field-label">Type <strong>DELETE</strong> to confirm</span>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              disabled={deleting}
            />
          </label>
          {err && <div className="form-error" role="alert">{err}</div>}
          <div className="manage-member-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeModal}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={deleting || confirmText.trim().toUpperCase() !== 'DELETE'}
            >
              {deleting ? 'Deleting…' : 'Delete my account'}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

// ---------------- Viewer ----------------

function ProfileView({
  profile,
  isOwnProfile,
  isAdmin,
  isOwner,
  onAwardBadge,
  onManageAdminTags,
  onManageMember,
  onChangeRole,
  adminTagsVersion,
}) {
  const [badges, setBadges] = useState([]);
  const [memberTags, setMemberTags] = useState([]);
  const [adminTags, setAdminTags] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const load = useCallback(async () => {
    await Promise.resolve();
    const [b, tagRows, aTags] = await Promise.all([
      loadMemberBadges(profile.id),
      supabase
        .from('member_tags')
        .select('tag_id, tags!inner(id, name)')
        .eq('user_id', profile.id),
      isAdmin ? loadMemberAdminTags(profile.id) : Promise.resolve([]),
    ]);
    setBadges(b);
    if (tagRows.error) {
      console.error('member_tags load failed:', tagRows.error.message);
      setMemberTags([]);
    } else {
      setMemberTags((tagRows.data || []).map((r) => r.tags).filter(Boolean));
    }
    setAdminTags(aTags);
    setLoadingMeta(false);
  }, [profile.id, isAdmin]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await load();
    })();
    return () => {
      cancelled = true;
    };
  }, [load, adminTagsVersion]);

  const location = formatLocation({ city: profile.city, state: profile.state });
  const isTargetAdmin = profile.role === 'admin';
  const isTargetOwner = profile.role === 'owner';
  // Admins cannot take manage actions on other admins or the owner. The owner
  // can take manage actions on admins (but never on themselves or the owner).
  const showManageSection =
    !isOwnProfile && !isTargetOwner && (isOwner || (isAdmin && !isTargetAdmin));
  // Role-management UI is owner-only and never targets self or another owner.
  const showRoleSection = isOwner && !isOwnProfile && !isTargetOwner;

  return (
    <>
      <div className="profile-top">
        <div className="avatar-wrap">
          <Avatar
            key={profile.avatar_url || 'none'}
            path={profile.avatar_url}
            displayName={profile.display_name}
            size={140}
            frameType={profile.selected_frame}
          />
        </div>
        <div className="profile-meta">
          <h2 className="profile-name">{profile.display_name}</h2>
          <div className="profile-badges">
            <span className={`role-badge role-${profile.role}`}>{profile.role}</span>
            {profile.dietary_approach && (
              <DietaryApproachTag value={profile.dietary_approach} size="md" />
            )}
            {isAdmin && profile.status && profile.status !== 'active' && (
              <span className={`status-pill ${statusColorClass(profile.status)}`}>
                {statusLabel(profile.status)}
              </span>
            )}
          </div>
          {profile.journey_duration && (
            <div className="profile-sub">
              {journeyLabel(profile.journey_duration)} on this path
            </div>
          )}
          {location && <div className="profile-sub">{location}</div>}
          <div className="profile-since">
            Member since {formatDate(profile.created_at)}
          </div>
          {profile.bio && <div className="profile-headline">{profile.bio}</div>}
          {isOwnProfile ? (
            <div className="profile-actions">
              <Link to="/profile/edit" className="btn btn-primary">Edit profile</Link>
            </div>
          ) : (
            isAdmin && (
              <div className="profile-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onAwardBadge}
                >
                  Manage badges
                </button>
              </div>
            )
          )}
        </div>
      </div>

      <ProfileStreakBlock profile={profile} />

      {profile.about_me && (
        <section className="profile-block">
          <h3 className="profile-block-title">About</h3>
          <p className="profile-block-body">{profile.about_me}</p>
        </section>
      )}

      {profile.my_why && (
        <section className="profile-block profile-why">
          <h3 className="profile-block-title">My why</h3>
          <p className="profile-block-body">{profile.my_why}</p>
        </section>
      )}

      <section className="profile-block">
        <h3 className="profile-block-title">Badges</h3>
        {loadingMeta ? (
          <div className="muted">Loading badges…</div>
        ) : badges.length === 0 ? (
          <p className="muted">No badges yet.</p>
        ) : (
          <div className="badge-showcase">
            {badges.map((b) => (
              <div key={b.badge_type} className="badge-showcase-item">
                <BadgeIcon badgeType={b.badge_type} size={40} />
                <div className="badge-showcase-meta">
                  <div className="badge-showcase-name">{b.name}</div>
                  {b.description && (
                    <div className="badge-showcase-desc">{b.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="profile-block">
        <h3 className="profile-block-title">Interests</h3>
        {loadingMeta ? (
          <div className="muted">Loading interests…</div>
        ) : memberTags.length === 0 ? (
          <p className="muted">No interests selected.</p>
        ) : (
          <div className="interest-chip-row">
            {memberTags.map((t) => (
              <InterestTagChip key={t.id} tag={t} readOnly />
            ))}
          </div>
        )}
      </section>

      {isAdmin && !isOwnProfile && (
        <section className="profile-block profile-admin-block">
          <div className="profile-block-title-row">
            <h3 className="profile-block-title">Internal tags</h3>
            <button
              type="button"
              className="btn btn-ghost btn-small"
              onClick={onManageAdminTags}
            >
              Manage tags
            </button>
          </div>
          {loadingMeta ? (
            <div className="muted">Loading tags…</div>
          ) : adminTags.length === 0 ? (
            <p className="muted">No internal tags assigned.</p>
          ) : (
            <ul className="admin-tag-chip-row">
              {adminTags.map((t) => (
                <li key={t.id} className="admin-tag-chip-wrap">
                  <span
                    className="admin-tag-chip"
                    style={{ background: safeTagColor(t.color) }}
                  >
                    {t.name}
                  </span>
                  {t.note && (
                    <span className="admin-tag-chip-note muted">— {t.note}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {showRoleSection && (
        <section className="profile-block profile-admin-block">
          <h3 className="profile-block-title">Role</h3>
          <p className="muted profile-block-sub">
            Only the owner can change another member's role.
          </p>
          <div className="manage-member-actions">
            {isTargetAdmin ? (
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => onChangeRole?.('demote')}
              >
                Demote to Member
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onChangeRole?.('promote')}
              >
                Promote to Admin
              </button>
            )}
          </div>
        </section>
      )}

      {showManageSection && (
        <section className="profile-block profile-admin-block">
          <h3 className="profile-block-title">Manage member</h3>
          <p className="muted profile-block-sub">
            Admin-only actions. Use with care.
          </p>
          <div className="manage-member-actions">
            {profile.status === 'suspended' ? (
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => onManageMember('unsuspend')}
              >
                Unsuspend
              </button>
            ) : profile.status === 'active' ? (
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => onManageMember('suspend')}
              >
                Suspend
              </button>
            ) : null}
            {profile.status === 'banned' ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => onManageMember('unban')}
              >
                Unban
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => onManageMember('ban')}
              >
                Ban
              </button>
            )}
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onManageMember('delete')}
            >
              Delete member
            </button>
          </div>
        </section>
      )}
    </>
  );
}

// ---------------- Page container ----------------

function useFetchedProfile(id, skip) {
  const [state, setState] = useState({
    loading: !skip && !!id,
    data: null,
    error: null,
    version: 0,
  });

  const refresh = useCallback(() => {
    setState((prev) => ({ ...prev, version: prev.version + 1 }));
  }, []);

  useEffect(() => {
    if (skip || !id) return undefined;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setState((prev) => ({ ...prev, loading: true }));
      const res = await supabase.from('profiles').select('*').eq('id', id).single();
      if (cancelled) return;
      if (res.error) {
        setState((prev) => ({ ...prev, loading: false, data: null, error: res.error.message }));
      } else {
        setState((prev) => ({ ...prev, loading: false, data: res.data, error: null }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, skip, state.version]);

  return { ...state, refresh };
}

export default function Profile() {
  usePageTitle('Profile');
  const { id } = useParams();
  const location = useLocation();
  const {
    user,
    profile: ownProfile,
    updateProfile,
    uploadAvatar,
    refreshProfile,
    isSuspended,
    isAdmin,
    isOwner,
  } = useAuth();
  const isEditRoute = location.pathname.replace(/\/+$/, '').endsWith('/profile/edit');

  const isOwn = !id || id === user?.id;

  if (isEditRoute && !ownProfile) {
    return (
      <div className="page-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  // /profile → own view; /profile/edit → own editor; /profile/:id → view
  if (isEditRoute) {
    if (isSuspended) {
      return (
        <div className="page page-narrow">
          <header className="page-header">
            <h1 className="page-title">Edit your profile</h1>
          </header>
          <section className="panel">
            <p className="muted">
              Profile edits are disabled while your account is suspended.
              Contact a host if you think this is a mistake.
            </p>
            <p>
              <Link to="/profile" className="btn btn-ghost">Back to profile</Link>
            </p>
          </section>
        </div>
      );
    }
    return (
      <div className="page page-narrow">
        <header className="page-header">
          <h1 className="page-title">Edit your profile</h1>
          <p className="page-sub">
            This is your space in The Keep. Take your time.
          </p>
        </header>
        <section className="panel profile-panel">
          <ProfileEditor
            key={ownProfile.id}
            profile={ownProfile}
            updateProfile={updateProfile}
            uploadAvatar={uploadAvatar}
            onSaved={refreshProfile}
          />
          <ProfileEditorExtras profile={ownProfile} onSaved={refreshProfile} />
          <DeleteAccountSection isOwner={isOwner} />
        </section>
      </div>
    );
  }

  if (isOwn) {
    if (!ownProfile) {
      return (
        <div className="page-center">
          <div className="spinner" aria-label="Loading" />
        </div>
      );
    }
    return <ProfilePage profile={ownProfile} isOwnProfile isAdmin={isAdmin} isOwner={isOwner} refresh={refreshProfile} />;
  }

  return <OtherProfile key={id} id={id} isAdmin={isAdmin} isOwner={isOwner} />;
}

function ProfilePage({ profile, isOwnProfile, isAdmin, isOwner, refresh }) {
  const [awardOpen, setAwardOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [manageAction, setManageAction] = useState(null);
  const [roleAction, setRoleAction] = useState(null);
  const [adminTagsVersion, setAdminTagsVersion] = useState(0);

  const bumpAdminTags = () => setAdminTagsVersion((v) => v + 1);

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <h1 className="page-title">{isOwnProfile ? 'Your profile' : profile.display_name}</h1>
      </header>
      <section className="panel profile-panel">
        <ProfileView
          profile={profile}
          isOwnProfile={isOwnProfile}
          isAdmin={isAdmin}
          isOwner={isOwner}
          onAwardBadge={() => setAwardOpen(true)}
          onManageAdminTags={() => setTagModalOpen(true)}
          onManageMember={(action) => setManageAction(action)}
          onChangeRole={(action) => setRoleAction(action)}
          adminTagsVersion={adminTagsVersion}
        />
      </section>
      <AwardBadgeModal
        open={awardOpen}
        onClose={() => setAwardOpen(false)}
        targetUserId={profile.id}
        targetName={profile.display_name}
        onChanged={refresh}
      />
      <AssignAdminTagModal
        open={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        targetUserId={profile.id}
        targetName={profile.display_name}
        onChanged={bumpAdminTags}
      />
      <ManageMemberModal
        open={!!manageAction}
        onClose={() => setManageAction(null)}
        action={manageAction}
        targetUserId={profile.id}
        targetName={profile.display_name}
        onChanged={refresh}
      />
      <RoleChangeModal
        open={!!roleAction}
        onClose={() => setRoleAction(null)}
        action={roleAction}
        targetUserId={profile.id}
        targetName={profile.display_name}
        onChanged={refresh}
      />
    </div>
  );
}

function OtherProfile({ id, isAdmin, isOwner }) {
  const { data: fetched, error, loading, refresh } = useFetchedProfile(id, false);
  const [awardOpen, setAwardOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [manageAction, setManageAction] = useState(null);
  const [roleAction, setRoleAction] = useState(null);
  const [adminTagsVersion, setAdminTagsVersion] = useState(0);

  const bumpAdminTags = () => setAdminTagsVersion((v) => v + 1);

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (error || !fetched) {
    return (
      <div className="page page-narrow">
        <h1 className="page-title">Profile not found</h1>
        <p className="page-sub">{error || "This member's profile isn't available."}</p>
      </div>
    );
  }

  const subtitle = [
    dietaryLabel(fetched.dietary_approach),
    journeyLabel(fetched.journey_duration),
    formatLocation({ city: fetched.city, state: fetched.state }),
    stateName(fetched.state) && !fetched.city ? stateName(fetched.state) : null,
  ]
    .filter(Boolean)
    .slice(0, 1)
    .join(' · ');

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <h1 className="page-title">{fetched.display_name}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </header>
      <section className="panel profile-panel">
        <ProfileView
          profile={fetched}
          isOwnProfile={false}
          isAdmin={isAdmin}
          isOwner={isOwner}
          onAwardBadge={() => setAwardOpen(true)}
          onManageAdminTags={() => setTagModalOpen(true)}
          onManageMember={(action) => setManageAction(action)}
          onChangeRole={(action) => setRoleAction(action)}
          adminTagsVersion={adminTagsVersion}
        />
      </section>
      <AwardBadgeModal
        open={awardOpen}
        onClose={() => setAwardOpen(false)}
        targetUserId={fetched.id}
        targetName={fetched.display_name}
        onChanged={refresh}
      />
      <AssignAdminTagModal
        open={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        targetUserId={fetched.id}
        targetName={fetched.display_name}
        onChanged={bumpAdminTags}
      />
      <ManageMemberModal
        open={!!manageAction}
        onClose={() => setManageAction(null)}
        action={manageAction}
        targetUserId={fetched.id}
        targetName={fetched.display_name}
        onChanged={refresh}
      />
      <RoleChangeModal
        open={!!roleAction}
        onClose={() => setRoleAction(null)}
        action={roleAction}
        targetUserId={fetched.id}
        targetName={fetched.display_name}
        onChanged={refresh}
      />
    </div>
  );
}

// ---------------- Role change modal (owner only) ----------------

function RoleChangeModal({ open, onClose, action, targetUserId, targetName, onChanged }) {
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setSaving(false);
      setErr('');
    })();
    return () => {
      cancelled = true;
    };
  }, [open, action]);

  if (!action) return null;

  const isPromote = action === 'promote';
  const title = isPromote ? 'Promote to Admin' : 'Demote to Member';
  const lead = isPromote
    ? `Make ${targetName || 'this member'} an admin? Admins can moderate content and manage members.`
    : `Remove admin rights from ${targetName || 'this admin'}? They will become a regular member.`;

  const submit = async () => {
    if (saving || !targetUserId) return;
    setSaving(true);
    setErr('');
    try {
      const newRole = isPromote ? 'admin' : 'member';
      const { error } = await supabase.rpc('set_member_role', {
        target_id: targetUserId,
        new_role: newRole,
      });
      if (error) {
        setErr(error.message);
        return;
      }
      if (onChanged) await onChanged(action);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" variant={isPromote ? '' : 'warning'}>
      <div className="manage-member-body">
        <p className="manage-member-lead">{lead}</p>
        {err && (
          <div className="form-error" role="alert">
            {err}
          </div>
        )}
        <div className="manage-member-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn ${isPromote ? 'btn-primary' : 'btn-warning'}`}
            onClick={submit}
            disabled={saving}
          >
            {saving ? 'Working…' : isPromote ? 'Promote' : 'Demote'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ---------------- Streak view block ----------------

function ProfileStreakBlock({ profile }) {
  const current = Number(profile?.current_streak) || 0;
  const longest = Number(profile?.longest_streak) || 0;
  const hasAny = current > 0 || longest > 0;

  // If this member has never logged a streak day, skip the block entirely.
  if (!hasAny) return null;

  const frozen =
    profile?.streak_freeze_start &&
    profile?.streak_freeze_end &&
    isDateWithin(new Date(), profile.streak_freeze_start, profile.streak_freeze_end);

  const progress = progressToNext(current);

  return (
    <section className="profile-block profile-streak-block">
      <h3 className="profile-block-title">Streak</h3>
      <div className="profile-streak-row">
        <StreakBadge streak={current} size="lg" />
        <div className="profile-streak-text">
          <div className="profile-streak-current">🔥 {current} day{current === 1 ? '' : 's'}</div>
          <div className="profile-streak-longest muted">Longest: {longest} day{longest === 1 ? '' : 's'}</div>
          {frozen && (
            <div className="profile-streak-frozen" title={`Freeze ends ${profile.streak_freeze_end}`}>
              ❄️ Vacation — streak frozen until {formatDate(profile.streak_freeze_end)}
            </div>
          )}
        </div>
      </div>
      {progress.next && (
        <div className="profile-streak-progress">
          <div className="profile-streak-progress-label">
            {progress.remaining} day{progress.remaining === 1 ? '' : 's'} to {progress.next.name}
          </div>
          <div className="profile-streak-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.pct}>
            <span style={{ width: `${progress.pct}%` }} />
          </div>
        </div>
      )}
    </section>
  );
}

function isDateWithin(today, startStr, endStr) {
  try {
    const t = today;
    const start = new Date(startStr + 'T00:00:00');
    const end = new Date(endStr + 'T23:59:59');
    return t >= start && t <= end;
  } catch {
    return false;
  }
}
