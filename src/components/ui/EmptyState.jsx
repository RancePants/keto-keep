export default function EmptyState({ title, message, icon, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon" aria-hidden="true">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {message && <p className="empty-state-msg">{message}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
