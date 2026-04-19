import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/useAuth.js';
import LessonContent from '../components/courses/LessonContent.jsx';
import { flattenLessons, formatMinutes } from '../lib/courseHelpers.js';
import usePageTitle from '../lib/usePageTitle.js';

export default function LessonView() {
  usePageTitle('Lesson');
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isSuspended } = useAuth();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [completedSet, setCompletedSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingComplete, setSavingComplete] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const load = useCallback(async () => {
    const { data: courseRow, error: cErr } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (cErr) {
      setError(cErr.message);
      return;
    }
    if (!courseRow) {
      setError('Course not found.');
      setCourse(null);
      return;
    }
    setCourse(courseRow);
    setError(null);

    const { data: modRows, error: mErr } = await supabase
      .from('modules')
      .select('id, title, description, display_order, lessons(id, title, content_html, estimated_minutes, display_order, module_id)')
      .eq('course_id', courseRow.id)
      .order('display_order', { ascending: true });
    if (mErr) {
      setError(mErr.message);
      return;
    }
    const mods = (modRows || []).map((m) => ({
      ...m,
      lessons: (m.lessons || []).sort((a, b) => a.display_order - b.display_order),
    }));
    setModules(mods);

    const flat = flattenLessons(mods);
    const currentLesson = flat.find((l) => l.id === lessonId) || null;
    setLesson(currentLesson);

    if (!currentLesson) {
      setError('Lesson not found.');
      return;
    }

    const allLessonIds = flat.map((l) => l.id);
    if (allLessonIds.length > 0 && user) {
      const { data: progressRows } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id)
        .in('lesson_id', allLessonIds);
      setCompletedSet(
        new Set((progressRows || []).filter((p) => p.completed).map((p) => p.lesson_id))
      );
    } else {
      setCompletedSet(new Set());
    }
  }, [slug, lessonId, user]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      setJustCompleted(false);
      await load();
      if (cancelled) return;
      setLoading(false);
      // Scroll to top on lesson change for a clean reading view.
      window.scrollTo({ top: 0, behavior: 'instant' });
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const flat = useMemo(() => flattenLessons(modules), [modules]);
  const currentIdx = useMemo(
    () => flat.findIndex((l) => l.id === lessonId),
    [flat, lessonId]
  );
  const prevLesson = currentIdx > 0 ? flat[currentIdx - 1] : null;
  const nextLesson = currentIdx >= 0 && currentIdx < flat.length - 1 ? flat[currentIdx + 1] : null;
  const isComplete = lesson ? completedSet.has(lesson.id) : false;
  const currentModule = lesson?.module || null;

  const toggleComplete = async () => {
    if (!lesson || !user || savingComplete) return;
    setSavingComplete(true);
    const nextCompleted = !isComplete;
    try {
      const { error: upErr } = await supabase
        .from('lesson_progress')
        .upsert(
          {
            user_id: user.id,
            lesson_id: lesson.id,
            completed: nextCompleted,
            completed_at: nextCompleted ? new Date().toISOString() : null,
          },
          { onConflict: 'user_id,lesson_id' }
        );
      if (upErr) {
        setError(upErr.message);
        return;
      }
      setCompletedSet((prev) => {
        const next = new Set(prev);
        if (nextCompleted) next.add(lesson.id);
        else next.delete(lesson.id);
        return next;
      });
      if (nextCompleted) {
        setJustCompleted(true);
        window.setTimeout(() => setJustCompleted(false), 1200);
      }
    } finally {
      setSavingComplete(false);
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (error || !course || !lesson) {
    return (
      <div className="lesson-view">
        <header className="feed-header">
          <div className="feed-breadcrumbs">
            <Link to="/courses">Courses</Link>
            {course && (
              <>
                {' '}→ <Link to={`/courses/${course.slug}`}>{course.title}</Link>
              </>
            )}
          </div>
          <h1 className="feed-title">Not found</h1>
          <p className="feed-desc">{error || 'Lesson not found.'}</p>
        </header>
      </div>
    );
  }

  return (
    <div className="lesson-view">
      <nav className="lesson-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/courses">Courses</Link>
        <span className="lesson-breadcrumb-sep">→</span>
        <Link to={`/courses/${course.slug}`}>{course.title}</Link>
        {currentModule && (
          <>
            <span className="lesson-breadcrumb-sep">→</span>
            <span className="lesson-breadcrumb-module">{currentModule.title}</span>
          </>
        )}
      </nav>

      <div className="lesson-layout">
        <main className="lesson-main">
          <header className="lesson-header">
            <h1 className="lesson-title">{lesson.title}</h1>
            <div className="lesson-meta">
              {lesson.estimated_minutes > 0 && (
                <span className="lesson-meta-time">
                  🕒 {formatMinutes(lesson.estimated_minutes)}
                </span>
              )}
              {isComplete && !justCompleted && (
                <span className="lesson-meta-done">✓ Completed</span>
              )}
              {isAdmin && !course.published && (
                <span className="course-card-badge course-card-badge-draft">
                  Course unpublished
                </span>
              )}
            </div>
          </header>

          <LessonContent html={lesson.content_html} />

          <section className="lesson-complete-section">
            <button
              type="button"
              className={`lesson-complete-btn${isComplete ? ' lesson-complete-btn-done' : ''}${justCompleted ? ' lesson-complete-btn-celebrate' : ''}`}
              onClick={toggleComplete}
              disabled={savingComplete || isSuspended}
              aria-pressed={isComplete}
              title={isSuspended ? 'Progress tracking disabled while suspended' : undefined}
            >
              <span className="lesson-complete-check" aria-hidden="true">
                {isComplete ? '✓' : ''}
              </span>
              <span className="lesson-complete-label">
                {savingComplete
                  ? 'Saving…'
                  : isComplete
                  ? 'Completed'
                  : 'Mark complete'}
              </span>
            </button>
            {isSuspended && (
              <p className="muted">
                Progress tracking is disabled while your account is suspended.
              </p>
            )}
            {justCompleted && (
              <div className="lesson-complete-toast" role="status">
                Nice work! 🎉
              </div>
            )}
          </section>

          <nav className="lesson-prev-next" aria-label="Lesson navigation">
            {prevLesson ? (
              <button
                type="button"
                className="lesson-nav-btn lesson-nav-prev"
                onClick={() => navigate(`/courses/${course.slug}/${prevLesson.id}`)}
              >
                <span className="lesson-nav-dir">← Previous</span>
                <span className="lesson-nav-title">{prevLesson.title}</span>
              </button>
            ) : (
              <span className="lesson-nav-spacer" aria-hidden="true" />
            )}
            {nextLesson ? (
              <button
                type="button"
                className="lesson-nav-btn lesson-nav-next"
                onClick={() => navigate(`/courses/${course.slug}/${nextLesson.id}`)}
              >
                <span className="lesson-nav-dir">Next →</span>
                <span className="lesson-nav-title">{nextLesson.title}</span>
              </button>
            ) : (
              <Link to={`/courses/${course.slug}`} className="lesson-nav-btn lesson-nav-finish">
                <span className="lesson-nav-dir">Back to course</span>
                <span className="lesson-nav-title">{course.title}</span>
              </Link>
            )}
          </nav>
        </main>

        {currentModule && currentModule.lessons.length > 1 && (
          <aside className="lesson-sidebar" aria-label="Module lesson list">
            <div className="lesson-sidebar-header">
              <div className="lesson-sidebar-eyebrow">This module</div>
              <div className="lesson-sidebar-title">{currentModule.title}</div>
            </div>
            <ul className="lesson-sidebar-list">
              {currentModule.lessons.map((l) => {
                const done = completedSet.has(l.id);
                const current = l.id === lesson.id;
                return (
                  <li key={l.id} className="lesson-sidebar-item">
                    <Link
                      to={`/courses/${course.slug}/${l.id}`}
                      className={`lesson-sidebar-link${current ? ' lesson-sidebar-current' : ''}`}
                      aria-current={current ? 'page' : undefined}
                    >
                      <span
                        className={`lesson-sidebar-check${done ? ' lesson-sidebar-check-done' : ''}`}
                        aria-hidden="true"
                      >
                        {done ? '✓' : ''}
                      </span>
                      <span className="lesson-sidebar-label">{l.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
