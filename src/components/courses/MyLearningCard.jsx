import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';
import ProgressBar from './ProgressBar.jsx';
import { firstIncomplete } from '../../lib/courseHelpers.js';

export default function MyLearningCard() {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, course: null, progress: null, resumeLesson: null });

  useEffect(() => {
    if (!user) return undefined;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;

      // Find a course the member has any progress on (most recent completed_at),
      // and if none, fall back to the first published course.
      const { data: progressRows } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed, completed_at, lessons!inner(id, module_id, modules!inner(id, course_id, courses!inner(id, slug, title, cover_image_url, published)))')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(50);

      let chosenCourseId = null;
      const progressCourseMap = new Map();
      for (const row of progressRows || []) {
        const c = row?.lessons?.modules?.courses;
        if (c && c.published) {
          if (!progressCourseMap.has(c.id)) progressCourseMap.set(c.id, c);
          if (!chosenCourseId) chosenCourseId = c.id;
        }
      }

      let chosenCourse = chosenCourseId ? progressCourseMap.get(chosenCourseId) : null;

      if (!chosenCourse) {
        const { data: firstPublished } = await supabase
          .from('courses')
          .select('id, slug, title, cover_image_url, published')
          .eq('published', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();
        chosenCourse = firstPublished || null;
      }

      if (!chosenCourse) {
        if (!cancelled) setState({ loading: false, course: null, progress: null, resumeLesson: null });
        return;
      }

      // Load modules + lessons for the chosen course to compute progress + resume.
      const { data: modulesRows } = await supabase
        .from('modules')
        .select('id, title, display_order, lessons(id, title, display_order)')
        .eq('course_id', chosenCourse.id)
        .order('display_order', { ascending: true });

      const modules = (modulesRows || []).map((m) => ({
        ...m,
        lessons: (m.lessons || []).sort((a, b) => a.display_order - b.display_order),
      }));
      const allLessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
      let completedSet = new Set();
      if (allLessonIds.length > 0) {
        const { data: courseProgress } = await supabase
          .from('lesson_progress')
          .select('lesson_id, completed')
          .eq('user_id', user.id)
          .in('lesson_id', allLessonIds);
        completedSet = new Set(
          (courseProgress || []).filter((p) => p.completed).map((p) => p.lesson_id)
        );
      }

      const done = allLessonIds.filter((id) => completedSet.has(id)).length;
      const total = allLessonIds.length;
      const resume = firstIncomplete(modules, completedSet) || (modules[0]?.lessons?.[0] ?? null);

      if (cancelled) return;
      setState({
        loading: false,
        course: chosenCourse,
        progress: { done, total },
        resumeLesson: resume,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (state.loading) {
    return (
      <section className="panel my-learning-card">
        <div className="my-learning-loading">Loading your course…</div>
      </section>
    );
  }

  if (!state.course) return null;

  const { course, progress, resumeLesson } = state;
  const complete = progress && progress.total > 0 && progress.done >= progress.total;
  const started = progress && progress.done > 0;
  const ctaLabel = complete ? 'Review' : started ? 'Continue' : 'Start';

  return (
    <section className="panel my-learning-card">
      <div className="my-learning-header">
        <h2 className="panel-title">My learning</h2>
        <Link to="/courses" className="my-learning-all">
          All courses →
        </Link>
      </div>
      <div className="my-learning-body">
        {course.cover_image_url ? (
          <img
            src={course.cover_image_url}
            alt=""
            className="my-learning-thumb"
            loading="lazy"
          />
        ) : (
          <div className="my-learning-thumb my-learning-thumb-placeholder" aria-hidden="true">
            📖
          </div>
        )}
        <div className="my-learning-meta">
          <h3 className="my-learning-title">
            <Link to={`/courses/${course.slug}`}>{course.title}</Link>
          </h3>
          <ProgressBar done={progress.done} total={progress.total} size="sm" />
          {resumeLesson ? (
            <Link
              to={`/courses/${course.slug}/${resumeLesson.id}`}
              className="btn btn-primary my-learning-cta"
            >
              {ctaLabel} →
            </Link>
          ) : (
            <Link to={`/courses/${course.slug}`} className="btn btn-primary my-learning-cta">
              View course →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
