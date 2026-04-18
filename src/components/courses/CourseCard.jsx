import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';

export default function CourseCard({ course, progress, isAdmin }) {
  const started = progress && progress.done > 0;
  const total = progress?.total || 0;

  return (
    <article className={`course-card${course.published ? '' : ' course-card-unpublished'}`}>
      <Link to={`/courses/${course.slug}`} className="course-card-cover-link">
        {course.cover_image_url ? (
          <img
            src={course.cover_image_url}
            alt=""
            className="course-card-cover"
            loading="lazy"
          />
        ) : (
          <div className="course-card-cover course-card-cover-placeholder" aria-hidden="true">
            <span className="course-card-cover-mark">📖</span>
          </div>
        )}
        {isAdmin && !course.published && (
          <span className="course-card-badge course-card-badge-draft">Unpublished</span>
        )}
        {course.access_level === 'premium' && (
          <span className="course-card-badge course-card-badge-premium">Premium</span>
        )}
      </Link>

      <div className="course-card-body">
        <h3 className="course-card-title">
          <Link to={`/courses/${course.slug}`}>{course.title}</Link>
        </h3>
        {course.description && (
          <p className="course-card-desc">{truncate(course.description, 140)}</p>
        )}

        <div className="course-card-footer">
          {started ? (
            <ProgressBar done={progress.done} total={total} size="sm" />
          ) : (
            <Link to={`/courses/${course.slug}`} className="btn btn-primary btn-block">
              {total > 0 ? 'Start course' : 'View course'}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function truncate(text, n) {
  if (!text) return '';
  if (text.length <= n) return text;
  return text.slice(0, n).trimEnd() + '…';
}
