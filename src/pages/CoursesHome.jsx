import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/useAuth.js';
import CourseCard from '../components/courses/CourseCard.jsx';
import CourseFormModal from '../components/courses/CourseFormModal.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import GuideTooltip from '../components/guide/GuideTooltip.jsx';

export default function CoursesHome() {
  usePageTitle('Courses');
  const { user, isAdmin } = useAuth();

  const [courses, setCourses] = useState([]);
  const [progressByCourse, setProgressByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    // RLS handles the published vs admin-sees-all split. No client filter needed.
    const { data: courseRows, error: cErr } = await supabase
      .from('courses')
      .select('id, title, description, slug, cover_image_url, access_level, display_order, published, created_at')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (cErr) {
      setError(cErr.message);
      return;
    }
    const rows = courseRows || [];
    setCourses(rows);
    setError(null);

    if (rows.length === 0 || !user) {
      setProgressByCourse({});
      return;
    }

    // Fetch lesson totals per course (all lessons under all modules).
    const courseIds = rows.map((c) => c.id);
    const { data: modulesRows } = await supabase
      .from('modules')
      .select('id, course_id, lessons(id)')
      .in('course_id', courseIds);

    const totals = {};
    const lessonsByCourse = {};
    for (const m of modulesRows || []) {
      if (!lessonsByCourse[m.course_id]) lessonsByCourse[m.course_id] = [];
      for (const l of m.lessons || []) {
        lessonsByCourse[m.course_id].push(l.id);
      }
    }
    for (const cid of courseIds) {
      totals[cid] = (lessonsByCourse[cid] || []).length;
    }

    // Fetch the member's completed lessons for every lesson under these courses.
    const allLessonIds = Object.values(lessonsByCourse).flat();
    let completedSet = new Set();
    if (allLessonIds.length > 0) {
      const { data: progressRows } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id)
        .in('lesson_id', allLessonIds);
      completedSet = new Set(
        (progressRows || []).filter((p) => p.completed).map((p) => p.lesson_id)
      );
    }

    const progress = {};
    for (const cid of courseIds) {
      const lessonIds = lessonsByCourse[cid] || [];
      const done = lessonIds.filter((id) => completedSet.has(id)).length;
      progress[cid] = { done, total: totals[cid] };
    }
    setProgressByCourse(progress);
  }, [user]);

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

  const onAdminCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const onSaved = async () => {
    await load();
  };

  const onDeleted = async () => {
    await load();
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="courses-page">
      <header className="page-header courses-page-header">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-sub">Self-paced lessons on eating, sleep, movement, and more.</p>
        </div>
        {isAdmin && (
          <button type="button" className="btn btn-primary" onClick={onAdminCreate}>
            + New course
          </button>
        )}
      </header>

      <GuideTooltip tipId="discover-courses" pose="pointing">
        Welcome to the Library! These self-paced courses cover the pillars of ancestral health. Work through them at your own speed — your progress is saved automatically.
      </GuideTooltip>

      {error && <div className="form-error">{error}</div>}

      {courses.length === 0 ? (
        <div className="feed-empty">
          {isAdmin
            ? 'No courses yet. Tap "New course" to create the first one.'
            : 'No courses are available just yet. Check back soon.'}
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              progress={progressByCourse[c.id]}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      <CourseFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        course={editing}
        onSaved={onSaved}
        onDeleted={onDeleted}
      />
    </div>
  );
}
