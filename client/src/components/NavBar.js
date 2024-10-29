import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext'; // Import the ThemeContext
import './NavBar.css'; // Ensure you import the CSS

function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme(); // Use the theme context

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <ul className="navbar-list">
        <div className="navbar-left">
          <li>
            <Link to="/">
              <img 
                src="https://placehold.co/40x40.png?text=Logo" // Placeholder logo
                alt="Logo" 
                style={{ 
                  width: '25px', 
                  height: '25px', 
                  marginRight: '10px', 
                  pointerEvents: 'none' // Prevent hover events on the logo
                }} 
              />
            </Link>
          </li>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/read">Read</Link></li>
          <li><Link to="/latest">Latest</Link></li>
          <li><Link to="/summary">Summary</Link></li>
          <li><Link to="/about-us">About Us</Link></li>
        </div>
        <div className="navbar-right">
          <li>
            <button onClick={toggleTheme}>
              {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
