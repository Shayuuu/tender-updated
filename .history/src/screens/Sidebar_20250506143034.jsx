import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation, matchPath } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUserTie, faFolderOpen, faTasks, faSignOutAlt, faBars, faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import './Sidebar.css'

const Sidebar = ({ currentRoute }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isSidebarPinned, setIsSidebarPinned] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)
  const hamburgerRef = useRef(null)

  // Debug state
  console.log('Sidebar: location.pathname:', location.pathname)
  console.log('Sidebar: currentRoute:', currentRoute)
  console.log('Sidebar: isSidebarPinned:', isSidebarPinned)
  console.log('Sidebar: isSidebarExpanded:', isSidebarExpanded)

  // Extract bidder ID from the current route
  const bidderIdMatch = location.pathname.match(/\/(bidders|extension-dates|bidder-details|milestone-tracker)\/(\d+)/)
  const bidderId = bidderIdMatch ? bidderIdMatch[2] : '1' // Default to '1' if no ID is found
  console.log('Sidebar: bidderId:', bidderId)

  // Determine if Bidder Section subsections should be visible
  const bidderSubsectionRoutes = [
    { path: '/bidders/:id', exact: true }, // Matches /bidders/123
    { path: '/extension-dates/:id', exact: true }, // Matches /extension-dates/123
    { path: '/bidder-details/:id', exact: true }, // Matches /bidder-details/123
    { path: '/milestone-tracker/:id', exact: true } // Matches /milestone-tracker/123
  ]

  const isBidderSubsectionOpen = bidderSubsectionRoutes.some(route =>
    typeof route === 'string'
      ? location.pathname === route || currentRoute === route
      : matchPath({ path: route.path, exact: route.exact }, location.pathname) ||
        (currentRoute && matchPath({ path: route.path, exact: route.exact }, currentRoute))
  )
  console.log('Sidebar: isBidderSubsectionOpen:', isBidderSubsectionOpen)

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
    <div className="sidebar-container">
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
              <FontAwesomeIcon icon={faHome} className="mobile-nav-icon" />
              <span>Home</span>
            </Link>
            <Link
              to="/bidders"
              className={`mobile-nav-link ${location.pathname === '/bidders' ? 'active' : ''}`}
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={faUserTie} className="mobile-nav-icon" />
              <span>Bidder Section</span>
            </Link>
            <Link
              to="/projects"
              className={`mobile-nav-link ${location.pathname === '/projects' ? 'active' : ''}`}
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={faFolderOpen} className="mobile-nav-icon" />
              <span>Project Section</span>
            </Link>
            <Link
              to="/tasks"
              className={`mobile-nav-link ${location.pathname === '/tasks' ? 'active' : ''}`}
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={faTasks} className="mobile-nav-icon" />
              <span>Task Summary</span>
            </Link>
            <button className="mobile-nav-link sidebar-logout-btn" onClick={handleLogout}>
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
            <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
            {(isSidebarPinned || isSidebarExpanded) && <span>Home</span>}
          </Link>
          <div className="sidebar-bidder-section">
            <Link
              to="/bidders"
              className={`sidebar-link ${location.pathname === '/bidders' ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faUserTie} className="sidebar-icon" />
              {(isSidebarPinned || isSidebarExpanded) && <span>Bidder<br />Section</span>}
            </Link>
            {(isSidebarPinned || isSidebarExpanded) && isBidderSubsectionOpen && (
              <div className="sidebar-bidder-subsection">
                {/* Forms Subsection */}
                <Link
                  to={location.pathname.match(/^\/bidders\/[^/]+$/) ? location.pathname : `/bidders/${bidderId}`}
                  className={`sidebar-sub-link sidebar-sub-link-forms ${matchPath({ path: '/bidders/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Forms</span>}
                </Link>
                {/* Extensions Subsection */}
                <Link
                  to={location.pathname.match(/^\/extension-dates\/[^/]+$/) ? location.pathname : `/extension-dates/${bidderId}`}
                  className={`sidebar-sub-link sidebar-sub-link-extensions ${matchPath({ path: '/extension-dates/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Extensions</span>}
                </Link>
                {/* Bidders Subsection */}
                <Link
                  to={location.pathname.match(/^\/bidder-details\/[^/]+$/) ? location.pathname : `/bidder-details/${bidderId}`}
                  className={`sidebar-sub-link sidebar-sub-link-bidders ${matchPath({ path: '/bidder-details/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Bidders</span>}
                </Link>
                {/* Milestones Subsection */}
                <Link
                  to={location.pathname.match(/^\/milestone-tracker\/[^/]+$/) ? location.pathname : `/milestone-tracker/${bidderId}`}
                  className={`sidebar-sub-link sidebar-sub-link-milestones ${matchPath({ path: '/milestone-tracker/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Milestones</span>}
                </Link>
              </div>
            )}
          </div>
          <Link
            to="/projects"
            className={`sidebar-link ${location.pathname === '/projects' ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faFolderOpen} className="sidebar-icon" />
            {(isSidebarPinned || isSidebarExpanded) && <span>Project<br />Section</span>}
          </Link>
          <Link
            to="/tasks"
            className={`sidebar-link ${location.pathname === '/tasks' ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faTasks} className="sidebar-icon" />
            {(isSidebarPinned || isSidebarExpanded) && <span>Task<br />Summary</span>}
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
          <button onClick={handleLogout} className="sidebar-link sidebar-logout-btn">
            <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" />
            {(isSidebarPinned || isSidebarExpanded) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </div>
  )
}

export default Sidebar