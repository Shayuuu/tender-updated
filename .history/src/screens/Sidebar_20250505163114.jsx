import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faFileAlt, faChartBar, faSignOutAlt, faBars, faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import './Sidebar.css'

const Sidebar = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isSidebarPinned, setIsSidebarPinned] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)
  const hamburgerRef = useRef(null)

  const toggleSidebarPin = () => {
    setIsSidebarPinned((prev) => !prev)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const handleLogout = () => {
    navigate('/')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <div className={`hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <button ref={hamburgerRef} onClick={toggleMobileMenu} className="hamburger-btn">
          <FontAwesomeIcon icon={faBars} className="hamburger-icon" />
        </button>
        {isMobileMenuOpen && (
          <nav ref={dropdownRef} className="mobile-nav-dropdown">
            <Link
              to="/home"
              className={`mobile-nav-link ${location.pathname === '/home' ? 'active' : ''}`}
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={faBell} className="mobile-nav-icon" />
              <span>Alerts</span>
            </Link>
            <Link
              to="/tenders"
              className={`mobile-nav-link ${location.pathname === '/tenders' ? 'active' : ''}`}
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={faFileAlt} className="mobile-nav-icon" />
              <span>Tenders</span>
            </Link>
            <Link
              to="/reports"
              className={`mobile-nav-link ${location.pathname === '/reports' ? 'active' : ''}`}
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={faChartBar} className="mobile-nav-icon" />
              <span>Reports</span>
            </Link>
            <button className="mobile-nav-link logout-btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="mobile-nav-icon" />
              <span>Logout</span>
            </button>
          </nav>
        )}
      </div>

      {/* Sidebar for Desktop/Tablet */}
      <aside
        className={`sidebar ${isSidebarPinned || isSidebarExpanded ? 'expanded' : ''} ${isSidebarPinned ? 'pinned' : ''}`}
        onMouseEnter={() => !isSidebarPinned && setIsSidebarExpanded(true)}
        onMouseLeave={() => !isSidebarPinned && setIsSidebarExpanded(false)}
      >
        <div className="sidebar-header"></div>
        <nav className="sidebar-nav">
          <Link
            to="/home"
            className={`sidebar-link ${location.pathname === '/home' ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faBell} className="sidebar-icon" />
            {(isSidebarPinned || isSidebarExpanded) && <span>Alerts</span>}
          </Link>
          <Link
            to="/tenders"
            className={`sidebar-link ${location.pathname === '/tenders' ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faFileAlt} className="sidebar-icon" />
            {(isSidebarPinned || isSidebarExpanded) && <span>Tenders</span>}
          </Link>
          <Link
            to="/reports"
            className={`sidebar-link ${location.pathname === '/reports' ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faChartBar} className="sidebar-icon" />
            {(isSidebarPinned || isSidebarExpanded) && <span>Reports</span>}
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button
            onClick={toggleSidebarPin}
            className={`sidebar-toggle-btn ${isSidebarPinned ? 'pinned' : ''}`}
            title={isSidebarPinned ? 'Unpin Sidebar' : 'Pin Sidebar'}
          >
            <FontAwesomeIcon icon={faWindowRestore} className="toggle-icon" />
            {(isSidebarPinned || isSidebarExpanded) && <span>{isSidebarPinned ? 'Unpin' : 'Pin'}</span>}
          </button>
          <button onClick={handleLogout} className="sidebar-link logout-btn">
            <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" />
            {(isSidebarPinned || isSidebarExpanded) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar