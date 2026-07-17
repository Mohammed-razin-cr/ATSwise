import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Brain, User, LogOut, Upload, FileText, ArrowUpRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { BRAND_NAME } from '../brand';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Brain className="logo-icon" size={28} />
          {BRAND_NAME}
        </Link>
        
        {user && (
          <div className="navbar-menu">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <FileText size={18} />
              Dashboard
            </NavLink>
            <NavLink
              to="/upload"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <Upload size={18} />
              Upload
            </NavLink>
            <div className="user-dropdown">
              <div className="user-info">
                <User size={18} />
                {user.username}
              </div>
              <button onClick={logout} className="logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}

        {!user && (
          <div className="navbar-public-actions">
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/signup" className="nav-cta">
              Get Started Free
              <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
