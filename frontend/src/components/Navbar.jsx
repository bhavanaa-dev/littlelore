// frontend/src/components/Navbar.jsx
import { NavLink, Link } from 'react-router-dom';

function Navbar() {
  const linkClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`;
  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="navbar-brand">
            <span className="brand-mark">❧</span>
            LittleLore
          </span>
        </Link>
        <div className="flex items-center" style={{ gap: '0.25rem' }}>
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/my-shelf" className={linkClass}>My Shelf</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
