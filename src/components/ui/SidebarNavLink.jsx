import { NavLink } from 'react-router-dom';

export default function SidebarNavLink({ to, icon, label, onNavigate, badge, disabled, tooltip, end }) {
  if (disabled) {
    return (
      <div
        className="sidebar-nav-link sidebar-nav-link-disabled"
        role="link"
        aria-disabled="true"
        title={tooltip || 'Coming soon'}
      >
        <span className="sidebar-nav-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="sidebar-nav-label">{label}</span>
        {tooltip && <span className="sidebar-nav-hint">Soon</span>}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `sidebar-nav-link${isActive ? ' sidebar-nav-link-active' : ''}`
      }
      onClick={onNavigate}
    >
      <span className="sidebar-nav-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="sidebar-nav-label">{label}</span>
      {typeof badge === 'number' && badge > 0 && (
        <span className="sidebar-nav-badge" aria-label={`${badge} unread`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  );
}
