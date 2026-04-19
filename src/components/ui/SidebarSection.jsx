export default function SidebarSection({ title, children }) {
  return (
    <div className="sidebar-section">
      {title && <h3 className="sidebar-section-title">{title}</h3>}
      <div className="sidebar-section-links">{children}</div>
    </div>
  );
}
