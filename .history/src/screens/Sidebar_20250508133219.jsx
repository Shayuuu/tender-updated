import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation, matchPath } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUserTie, faFolderOpen, faTasks, faSignOutAlt, faBars, faWindowRestore, faClipboardList } from '@fortawesome/free-solid-svg-icons'
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

  // Extract section ID from the current route (for both Bidder and Project subsections)
  const sectionIdMatch = location.pathname.match(/\/(bidders|extension-dates|bidder-details|milestone-tracker|forms|dates|account|expenses|variations|notes)\/(\d+)/)
  const sectionId = sectionIdMatch ? sectionIdMatch[2] : '1' // Default to '1' if no ID is found
  console.log('Sidebar: sectionId:', sectionId)

  // Determine if Bidder Section subsections should be visible
  const bidderSubsectionRoutes = [
    { path: '/bidders/:id', exact: true },
    { path: '/extension-dates/:id', exact: true },
    { path: '/bidder-details/:id', exact: true },
    { path: '/milestone-tracker/:id', exact: true }
  ]

  const isBidderSubsectionOpen = bidderSubsectionRoutes.some(route =>
    typeof route === 'string'
      ? location.pathname === route || currentRoute === route
      : matchPath({ path: route.path, exact: route.exact }, location.pathname) ||
        (currentRoute && matchPath({ path: route.path, exact: route.exact }, currentRoute))
  )
  console.log('Sidebar: isBidderSubsectionOpen:', isBidderSubsectionOpen)

  // Determine if Project Section subsections should be visible
  const projectSubsectionRoutes = [
    { path: '/forms/:id', exact: true },
    { path: '/dates/:id', exact: true },
    { path: '/account/:id', exact: true },
    { path: '/expenses/:id', exact: true },
    { path: '/variations/:id', exact: true },
    { path: '/notes/:id', exact: true }
  ]

  const isProjectSubsectionOpen = projectSubsectionRoutes.some(route =>
    typeof route === 'string'
      ? location.pathname === route || currentRoute === route
      : matchPath({ path: route.path, exact: route.exact }, location.pathname) ||
        (currentRoute && matchPath({ path: route.path, exact: route.exact }, currentRoute))
  )
  console.log('Sidebar: isProjectSubsectionOpen:', isProjectSubsectionOpen)

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
              to="/bidder-tasklist"
              className={`mobile-nav-link ${location.pathname === '/bidder-tasklist' ? 'active' : ''}`}
              onClick={toggleMobileMenu}
            >
              <FontAwesomeIcon icon={faClipboardList} className="mobile-nav-icon" />
              <span>TaskList</span>
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
                  to={location.pathname.match(/^\/bidders\/[^/]+$/) ? location.pathname : `/bidders/${sectionId}`}
                  className={`sidebar-sub-link sidebar-sub-link-forms ${matchPath({ path: '/bidders/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Forms</span>}
                </Link>
                {/* Extensions Subsection */}
                <Link
                  to={location.pathname.match(/^\/extension-dates\/[^/]+$/) ? location.pathname : `/extension-dates/${sectionId}`}
                  className={`sidebar-sub-link sidebar-sub-link-extensions ${matchPath({ path: '/extension-dates/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Extensions</span>}
                </Link>
                {/* Bidders Subsection */}
                <Link
                  to={location.pathname.match(/^\/bidder-details\/[^/]+$/) ? location.pathname : `/bidder-details/${sectionId}`}
                  className={`sidebar-sub-link sidebar-sub-link-bidders ${matchPath({ path: '/bidder-details/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Bidders</span>}
                </Link>
                {/* Milestones Subsection */}
                <Link
                  to={location.pathname.match(/^\/milestone-tracker\/[^/]+$/) ? location.pathname : `/milestone-tracker/${sectionId}`}
                  className={`sidebar-sub-link sidebar-sub-link-milestones ${matchPath({ path: '/milestone-tracker/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Milestones</span>}
                </Link>
              </div>
            )}
          </div>
          <div className="sidebar-project-section">
            <Link
              to="/projects"
              className={`sidebar-link ${location.pathname === '/projects' ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={faFolderOpen} className="sidebar-icon" />
              {(isSidebarPinned || isSidebarExpanded) && <span>Project<br />Section</span>}
            </Link>
            {(isSidebarPinned || isSidebarExpanded) && isProjectSubsectionOpen && (
              <div className="sidebar-project-subsection">
                {/* Forms Subsection */}
                <Link
                  to={location.pathname.match(/^\/forms\/[^/]+$/) ? location.pathname : `/forms/${sectionId}`}
                  className={`sidebar-sub-link sidebar-sub-link-forms ${matchPath({ path: '/forms/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Forms</span>}
                </Link>
                {/* Completion Dates Subsection */}
                <Link
                  to={location.pathname.match(/^\/dates\/[^/]+$/) ? location.pathname : `/dates/${sectionId}`}
                  className={`sidebar-sub-link sidebar-sub-link-completion-dates ${matchPath({ path: '/dates/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Completion Dates</span>}
                </Link>
                {/* Running Account Subsection */}
                <Link
                  to={location.pathname.match(/^\/account\/[^/]+$/) ? location.pathname : `/account/${sectionId}`}
                  className={`sidebar-sub-link sidebar-sub-link-running-account ${matchPath({ path: '/account/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Running Account</span>}
                </Link>
                {/* Expenses Subsection */}
                <Link
                  to={location.pathname.match(/^\/expenses\/[^/]+$/) ? location.pathname : `/expenses/${sectionId}`}
                  className={`sidebar-sub-link sidebar-sub-link-expenses ${matchPath({ path: '/expenses/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Expenses</span>}
                </Link>
                {/* Variations Subsection */}
                <Link
                  to={location.pathname.match(/^\/variations\/[^/]+$/) ? location.pathname : `/variations/${sectionId}`}
                  className={`sidebar-sub-link sidebar-sub-link-variations ${matchPath({ path: '/variations/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Variations</span>}
                </Link>
                {/* Notes Subsection */}
                <Link
                  to={location.pathname.match(/^\/notes\/[^/]+$/) ? location.pathname : `/notes/${sectionId}`}
                  className={`sidebar-sub-link sidebar-sub-link-notes ${matchPath({ path: '/notes/:id', exact: true }, location.pathname) ? 'active' : ''}`}
                >
                  {(isSidebarPinned || isSidebarExpanded) && <span>Notes</span>}
                </Link>
              </div>
            )}
          </div>
          <Link
            to="/bidder-tasklist"
            className={`sidebar-link ${location.pathname === '/bidder-tasklist' ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faClipboardList} className="sidebar-icon" />
            {(isSidebarPinned || isSidebarExpanded) && <span>TaskList</span>}
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