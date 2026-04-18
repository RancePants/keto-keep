import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';
import { supabase } from '../lib/supabase.js';

function Avatar({ path, displayName, size = 128 }) {
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

  if (path && url) {
    return <img src={url} alt={displayName || 'Avatar'} className="avatar-img" style={dimStyle} />;
  }
  return (
    <div className="avatar-fallback" style={dimStyle} aria-label={displayName || 'Avatar'}>
      <span>{initial}</span>
    </div>
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

function useFetchedProfile(id, skip) {
  const [state, setState] = useState({
    loading: !skip && !!id,
    data: null,
    error: null,
  });

  useEffect(() => {
    if (skip || !id) return undefined;
    let cancelled = false;
    (async () => {
      const res = await supabase.from('profiles').select('*').eq('id', id).single();
      if (cancelled) return;
      if (res.error) {
        setState({ loading: false, data: null, error: res.error.message });
      } else {
        setState({ loading: false, data: res.data, error: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, skip]);

  return state;
}

function ProfileEditor({ profile, updateProfile, uploadAvatar }) {
  const [displayName, setDisplayName] = useState(profile.display_name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const { error } = await updateProfile({ display_name: displayName, bio });
    setSaving(false);
    if (error) {
      setMessage({ type: 'error', text: error.message || 'Could not save.' });
    } else {
      setMessage({ type: 'success', text: 'Saved.' });
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
    const { error } = await uploadAvatar(file);
    setUploading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message || 'Upload failed.' });
    } else {
      setMessage({ type: 'success', text: 'Avatar updated.' });
    }
  };

  return (
    <>
      <div className="profile-top">
        <div className="avatar-wrap avatar-editable">
          <Avatar
            key={profile.avatar_url || 'none'}
            path={profile.avatar_url}
            displayName={profile.display_name}
            size={140}
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
          <div className="profile-email">{profile.email}</div>
          <div className="profile-since">
            Member since {formatDate(profile.created_at)}
          </div>
        </div>
      </div>

      <form onSubmit={onSave} className="form profile-form">
        <label className="field">
          <span className="field-label">Display name</span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Bio</span>
          <textarea
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share a little about your journey, your goals, or your favorite meal."
          />
        </label>

        {message && (
          <div
            className={message.type === 'error' ? 'form-error' : 'form-success'}
            role={message.type === 'error' ? 'alert' : 'status'}
          >
            {message.text}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </>
  );
}

function ProfileView({ profile }) {
  return (
    <>
      <div className="profile-top">
        <div className="avatar-wrap">
          <Avatar
            key={profile.avatar_url || 'none'}
            path={profile.avatar_url}
            displayName={profile.display_name}
            size={140}
          />
        </div>
        <div className="profile-meta">
          <h2 className="profile-name">{profile.display_name}</h2>
          <div className="profile-badges">
            <span className={`role-badge role-${profile.role}`}>{profile.role}</span>
          </div>
          <div className="profile-since">
            Member since {formatDate(profile.created_at)}
          </div>
        </div>
      </div>

      <div className="profile-bio">
        {profile.bio ? <p>{profile.bio}</p> : <p className="muted">No bio yet.</p>}
      </div>
    </>
  );
}

export default function Profile() {
  const { id } = useParams();
  const { user, profile: ownProfile, updateProfile, uploadAvatar } = useAuth();

  const isOwn = !id || id === user?.id;

  if (isOwn) {
    if (!ownProfile) {
      return (
        <div className="page-center">
          <div className="spinner" aria-label="Loading" />
        </div>
      );
    }
    return (
      <div className="page page-narrow">
        <header className="page-header">
          <h1 className="page-title">Your profile</h1>
          <p className="page-sub">Tell the community a bit about yourself.</p>
        </header>
        <section className="panel profile-panel">
          <ProfileEditor
            key={ownProfile.id}
            profile={ownProfile}
            updateProfile={updateProfile}
            uploadAvatar={uploadAvatar}
          />
        </section>
      </div>
    );
  }

  return <OtherProfile key={id} id={id} />;
}

function OtherProfile({ id }) {
  const { data: fetched, error, loading } = useFetchedProfile(id, false);

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

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <h1 className="page-title">{fetched.display_name}</h1>
      </header>
      <section className="panel profile-panel">
        <ProfileView profile={fetched} />
      </section>
    </div>
  );
}
