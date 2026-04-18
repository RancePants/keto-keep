import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/useAuth.js';
import ProgressBar from '../components/courses/ProgressBar.jsx';
import CourseFormModal from '../components/courses/CourseFormModal.jsx';
import ModuleFormModal from '../components/courses/ModuleFormModal.jsx';
import LessonFormModal from '../components/courses/LessonFormModal.jsx';
import OrderControls from '../components/courses/OrderControls.jsx';
import {
  computeCourseProgress,
  computeModuleProgress,
  firstIncomplete,
  formatMinutes,
  sumEstimatedMinutes,
} from '../lib/courseHelpers.js';

export default function CourseDetail() {
  const { slug } = useParams();
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [completedSet, setCompletedSet] = useState(new Set());
  const [expanded, setExpanded] = useState(() => new Set());
  const [expandedInitialized, setExpandedInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reorderBusy, setReorderBusy] = useState(false);

  const [courseFormOpen, setCourseFormOpen] = useState(false);
  const [moduleFormOpen, setModuleFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [lessonFormOpen, setLessonFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonTargetModuleId, setLessonTargetModuleId] = useState(null);

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
      .select('id, title, description, display_order, lessons(id, title, display_order, estimated_minutes)')
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

    // Auto-expand the first module on the initial load only. On subsequent
    // loads (after edits), preserve whatever the user had open.
    if (!expandedInitialized && mods.length > 0) {
      setExpanded(new Set([mods[0].id]));
      setExpandedInitialized(true);
    }

    const allLessonIds = mods.flatMap((m) => m.lessons.map((l) => l.id));
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
  }, [slug, user, expandedInitialized]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      await load();
      if (cancelled) return;
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const toggleModule = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onReorder = async (table, rows) => {
    if (reorderBusy) return;
    setReorderBusy(true);
    try {
      await Promise.all(
        rows.map((r, idx) =>
          supabase.from(table).update({ display_order: idx }).eq('id', r.id)
        )
      );
      await load();
    } finally {
      setReorderBusy(false);
    }
  };

  const moveModule = async (index, dir) => {
    const next = [...modules];
    const swapIdx = dir === 'up' ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= next.length) return;
    [next[index], next[swapIdx]] = [next[swapIdx], next[index]];
    await onReorder('modules', next);
  };

  const moveLesson = async (modIndex, lessonIndex, dir) => {
    const m = modules[modIndex];
    const next = [...m.lessons];
    const swapIdx = dir === 'up' ? lessonIndex - 1 : lessonIndex + 1;
    if (swapIdx < 0 || swapIdx >= next.length) return;
    [next[lessonIndex], next[swapIdx]] = [next[swapIdx], next[lessonIndex]];
    await onReorder('lessons', next);
  };

  const onNewModule = () => {
    setEditingModule(null);
    setModuleFormOpen(true);
  };

  const onEditModule = (mod) => {
    setEditingModule(mod);
    setModuleFormOpen(true);
  };

  const onNewLesson = (moduleId) => {
    setEditingLesson(null);
    setLessonTargetModuleId(moduleId);
    setLessonFormOpen(true);
  };

  const onEditLesson = (lesson, moduleId) => {
    setEditingLesson(lesson);
    setLessonTargetModuleId(moduleId);
    setLessonFormOpen(true);
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail">
        <header className="feed-header">
          <div className="feed-breadcrumbs">
            <Link to="/courses">Courses</Link>
          </div>
          <h1 className="feed-title">Not found</h1>
          <p className="feed-desc">{error || 'Course not found.'}</p>
        </header>
      </div>
    );
  }

  const totalProgress = computeCourseProgress(modules, completedSet);
  const resume = firstIncomplete(modules, completedSet);
  const started = totalProgress.done > 0;
  const complete = totalProgress.total > 0 && totalProgress.done >= totalProgress.total;
  const firstLesson = modules[0]?.lessons?.[0];

  let continueLesson = null;
  let continueLabel = 'Start course';
  if (complete) {
    continueLesson = firstLesson;
    continueLabel = 'Review course';
  } else if (resume) {
    continueLesson = resume;
    continueLabel = started ? 'Continue where I left off' : 'Start course';
  }

  const nextModuleOrder = modules.length;

  return (
    <div className="course-detail">
      <header className="feed-header">
        <div className="feed-breadcrumbs">
          <Link to="/courses">Courses</Link> → {course.title}
        </div>
      </header>

      <article className="course-detail-card">
        <div className="course-detail-cover-wrap">
          {course.cover_image_url ? (
            <img
              src={course.cover_image_url}
              alt=""
              className="course-detail-cover"
              loading="lazy"
            />
          ) : (
            <div className="course-detail-cover course-detail-cover-placeholder" aria-hidden="true">
              <span className="course-detail-cover-mark">📖</span>
            </div>
          )}
          <div className="course-detail-badges">
            {!course.published && isAdmin && (
              <span className="course-card-badge course-card-badge-draft">Unpublished</span>
            )}
            {course.access_level === 'premium' && (
              <span className="course-card-badge course-card-badge-premium">Premium</span>
            )}
          </div>
        </div>

        <div className="course-detail-head">
          <h1 className="course-detail-title">{course.title}</h1>
          {course.description && (
            <p className="course-detail-desc">{course.description}</p>
          )}

          <div className="course-detail-progress">
            <ProgressBar done={totalProgress.done} total={totalProgress.total} size="lg" />
          </div>

          <div className="course-detail-actions">
            {continueLesson ? (
              <Link
                to={`/courses/${course.slug}/${continueLesson.id}`}
                className="btn btn-primary btn-lg"
              >
                {continueLabel} →
              </Link>
            ) : (
              <span className="course-detail-no-lessons">No lessons yet.</span>
            )}
            {isAdmin && (
              <button
                type="button"
                className="icon-btn course-detail-edit"
                onClick={() => setCourseFormOpen(true)}
              >
                ✎ Edit course
              </button>
            )}
          </div>
        </div>

        <div className="course-detail-toc">
          <div className="course-detail-toc-header">
            <h2 className="course-detail-section-title">Table of contents</h2>
            {isAdmin && (
              <button type="button" className="icon-btn" onClick={onNewModule}>
                + New module
              </button>
            )}
          </div>

          {modules.length === 0 ? (
            <div className="feed-empty">
              {isAdmin
                ? 'This course has no modules yet. Add one to get started.'
                : 'This course is still being assembled. Check back soon.'}
            </div>
          ) : (
            <ul className="module-list">
              {modules.map((m, mi) => {
                const modProg = computeModuleProgress(m.lessons, completedSet);
                const isOpen = expanded.has(m.id);
                const totalMin = sumEstimatedMinutes(m.lessons);
                return (
                  <li key={m.id} className={`module-item${isOpen ? ' module-item-open' : ''}`}>
                    <div className="module-row">
                      <button
                        type="button"
                        className="module-toggle"
                        aria-expanded={isOpen}
                        onClick={() => toggleModule(m.id)}
                      >
                        <span className="module-chevron" aria-hidden="true">
                          {isOpen ? '▾' : '▸'}
                        </span>
                        <div className="module-row-main">
                          <div className="module-row-title">{m.title}</div>
                          {m.description && (
                            <div className="module-row-desc">{m.description}</div>
                          )}
                          <div className="module-row-meta">
                            <span>
                              {modProg.done} of {modProg.total} complete
                            </span>
                            {totalMin > 0 && (
                              <>
                                <span className="module-row-sep">·</span>
                                <span>{formatMinutes(totalMin)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                      {isAdmin && (
                        <div className="module-admin-controls">
                          <OrderControls
                            onUp={() => moveModule(mi, 'up')}
                            onDown={() => moveModule(mi, 'down')}
                            isFirst={mi === 0}
                            isLast={mi === modules.length - 1}
                            disabled={reorderBusy}
                            label="module"
                          />
                          <button
                            type="button"
                            className="icon-btn"
                            onClick={() => onEditModule(m)}
                          >
                            ✎
                          </button>
                        </div>
                      )}
                    </div>

                    {isOpen && (
                      <div className="module-lessons">
                        {m.lessons.length === 0 ? (
                          <div className="module-empty">No lessons in this module yet.</div>
                        ) : (
                          <ul className="lesson-list">
                            {m.lessons.map((l, li) => {
                              const done = completedSet.has(l.id);
                              return (
                                <li key={l.id} className="lesson-row">
                                  <Link
                                    to={`/courses/${course.slug}/${l.id}`}
                                    className="lesson-row-link"
                                  >
                                    <span
                                      className={`lesson-check${done ? ' lesson-check-done' : ''}`}
                                      aria-hidden="true"
                                    >
                                      {done ? '✓' : ''}
                                    </span>
                                    <span className="lesson-row-title">{l.title}</span>
                                    {l.estimated_minutes > 0 && (
                                      <span className="lesson-row-time">
                                        {formatMinutes(l.estimated_minutes)}
                                      </span>
                                    )}
                                  </Link>
                                  {isAdmin && (
                                    <div className="lesson-admin-controls">
                                      <OrderControls
                                        onUp={() => moveLesson(mi, li, 'up')}
                                        onDown={() => moveLesson(mi, li, 'down')}
                                        isFirst={li === 0}
                                        isLast={li === m.lessons.length - 1}
                                        disabled={reorderBusy}
                                        label="lesson"
                                      />
                                      <button
                                        type="button"
                                        className="icon-btn"
                                        onClick={() => onEditLesson(l, m.id)}
                                      >
                                        ✎
                                      </button>
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                        {isAdmin && (
                          <button
                            type="button"
                            className="icon-btn module-add-lesson"
                            onClick={() => onNewLesson(m.id)}
                          >
                            + New lesson
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </article>

      <CourseFormModal
        open={courseFormOpen}
        onClose={() => setCourseFormOpen(false)}
        course={course}
        onSaved={load}
        onDeleted={() => {
          setCourse(null);
          setError('This course was deleted.');
        }}
      />

      <ModuleFormModal
        open={moduleFormOpen}
        onClose={() => setModuleFormOpen(false)}
        courseId={course.id}
        module={editingModule}
        nextDisplayOrder={nextModuleOrder}
        onSaved={load}
        onDeleted={load}
      />

      <LessonFormModal
        open={lessonFormOpen}
        onClose={() => setLessonFormOpen(false)}
        moduleId={lessonTargetModuleId}
        lesson={editingLesson}
        nextDisplayOrder={
          modules.find((m) => m.id === lessonTargetModuleId)?.lessons.length || 0
        }
        onSaved={load}
        onDeleted={load}
      />
    </div>
  );
}
