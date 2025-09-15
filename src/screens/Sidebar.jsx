import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation, matchPath } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUserTie, faFolderOpen, faSignOutAlt, faBars, faWindowRestore, faClipboardList, faDatabase } from '@fortawesome/free-solid-svg-icons'
import './Sidebar.css'

const Sidebar = ({ currentRoute }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isSidebarPinned, setIsSidebarPinned] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)
  const hamburgerRef = useRef(null)

  // Get ID from current route for dynamic links
  const sectionIdMatch = location.pathname.match(/\/(bidders|forms|bidder-details|milestone-tracker)\/(\d+)/)
  const sectionId = sectionIdMatch ? sectionIdMatch[2] : '1'

  // Check if Bidder subsections should be open
  const bidderSubsectionRoutes = [
    { path: '/bidders/:id', exact: true },
    { path: '/bidder-details/:id', exact: true },
    { path: '/extension-dates/:id', exact: true },
    { path: '/milestone-tracker/:id', exact: true }
  ]

  const isBidderSubsectionOpen = bidderSubsectionRoutes.some(route =>
    matchPath({ path: route.path, exact: route.exact }, location.pathname) ||
    (currentRoute && matchPath({ path: route.path, exact: route.exact }, currentRoute))
  )

  // Check if Project subsection (combined form) should be open
  const projectSubsectionRoutes = [
    { path: '/forms/:id', exact: true } // Only first form tab
  ]
  const isProjectSubsectionOpen = projectSubsectionRoutes.some(route =>
    matchPath({ path: route.path, exact: route.exact }, location.pathname) ||
    (currentRoute && matchPath({ path: route.path, exact: route.exact }, currentRoute))
  )

  const toggleSidebarPin = () => setIsSidebarPinned(prev => !prev)
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev)
  const handleLogout = () => navigate('/')

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
    if (isMobileMenuOpen) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
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
            <Link to="/home" className={`mobile-nav-link ${location.pathname === '/home' ? 'active' : ''}`} onClick={toggleMobileMenu}>
              <FontAwesomeIcon icon={faHome} className="mobile-nav-icon" />
              <span>Home</span>
            </Link>
            <Link to="/bidders" className={`mobile-nav-link ${location.pathname === '/bidders' ? 'active' : ''}`} onClick={toggleMobileMenu}>
              <FontAwesomeIcon icon={faUserTie} className="mobile-nav-icon" />
              <span>Bidder Section</span>
            </Link>
            <Link to={`/forms/${sectionId}`} className={`mobile-nav-link ${location.pathname === `/forms/${sectionId}` ? 'active' : ''}`} onClick={toggleMobileMenu}>
              <FontAwesomeIcon icon={faFolderOpen} className="mobile-nav-icon" />
              <span>Project Form</span>
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
          <Link to="/home" className={`sidebar-link ${location.pathname === '/home' ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
            {(isSidebarPinned || isSidebarExpanded) && <span>Home</span>}
          </Link>

          {/* Bidder Section */}
          <div className="sidebar-bidder-section">
            <Link to="/bidders" className={`sidebar-link ${location.pathname.startsWith('/bidders') ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faUserTie} className="sidebar-icon" />
              {(isSidebarPinned || isSidebarExpanded) && <span>Bidder<br />Section</span>}
            </Link>
            {(isSidebarPinned || isSidebarExpanded) && isBidderSubsectionOpen && (
              <div className="sidebar-bidder-subsection">
                <Link to={`/bidders/${sectionId}`} className={`sidebar-sub-link ${matchPath({ path: '/bidders/:id', exact: true }, location.pathname) ? 'active' : ''}`}>
                  {(isSidebarPinned || isSidebarExpanded) && <span>Forms</span>}
                </Link>
                <Link to={`/extension-dates/${sectionId}`} className={`sidebar-sub-link ${matchPath({ path: '/extension-dates/:id', exact: true }, location.pathname) ? 'active' : ''}`}>
                  {(isSidebarPinned || isSidebarExpanded) && <span>Extensions</span>}
                </Link>
                <Link to={`/bidder-details/${sectionId}`} className={`sidebar-sub-link ${matchPath({ path: '/bidder-details/:id', exact: true }, location.pathname) ? 'active' : ''}`}>
                  {(isSidebarPinned || isSidebarExpanded) && <span>Bidders</span>}
                </Link>
                <Link to={`/milestone-tracker/${sectionId}`} className={`sidebar-sub-link ${matchPath({ path: '/milestone-tracker/:id', exact: true }, location.pathname) ? 'active' : ''}`}>
                  {(isSidebarPinned || isSidebarExpanded) && <span>Milestones</span>}
                </Link>
              </div>
            )}
          </div>

          {/* Project Section - Only first form tab */}
          <div className="sidebar-project-section">
            <Link to="/projects" className={`sidebar-link ${location.pathname.startsWith('/forms') ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faFolderOpen} className="sidebar-icon" />
              {(isSidebarPinned || isSidebarExpanded) && <span>Project<br />Section</span>}
            </Link>
            {(isSidebarPinned || isSidebarExpanded) && isProjectSubsectionOpen && (
              <div className="sidebar-project-subsection">
                <Link to={`/forms/${sectionId}`} className={`sidebar-sub-link ${matchPath({ path: '/forms/:id', exact: true }, location.pathname) ? 'active' : ''}`}>
                  {(isSidebarPinned || isSidebarExpanded) && <span>Combined Form</span>}
                </Link>
              </div>
            )}
          </div>

          {/* TaskList & History */}
          <Link to="/tasklist" className={`sidebar-link ${location.pathname === '/tasklist' ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faClipboardList} className="sidebar-icon" />
            {(isSidebarPinned || isSidebarExpanded) && <span>TaskList</span>}
          </Link>
          <Link to="/tasks" className={`sidebar-link ${location.pathname === '/tasks' ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faDatabase} className="sidebar-icon" />
            {(isSidebarPinned || isSidebarExpanded) && <span>Local<br />History</span>}
          </Link>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button onClick={toggleSidebarPin} className={`sidebar-toggle-btn ${isSidebarPinned ? 'pinned' : ''}`} title={isSidebarPinned ? 'Unpin Sidebar' : 'Pin Sidebar'}>
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
