import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import './Home.css'

function Home() {
  const alerts = [
    { id: 1, message: 'Tender Deadline: May 10, 2025', type: 'deadline' },
    { id: 2, message: 'System Update: New Feature Available', type: 'update' },
    { id: 3, message: 'Tender Submission Due: May 15, 2025', type: 'deadline' }
  ]

  return (
    <div className="home-page">
      <img src="/logo.png" alt="Company Logo" className="company-logo" />
      <div className="home-content">
        <div className="home-card">
          <h1 className="home-title">Welcome to Tender System</h1>
          <div className="alerts-section">
            <h2 className="alerts-title">
              <FontAwesomeIcon icon={faBell} className="alerts-icon" />
              Alerts
            </h2>
            <div className="alerts-list">
              {alerts.map((alert) => (
                <div key={alert.id} className={`alert-item ${alert.type}`}>
                  <FontAwesomeIcon icon={faBell} className="alert-icon" />
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home