import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import Sidebar from './Sidebar'
import './Home.css'

function Home() {
  const alerts = [
    { id: 1, name: 'Tender Deadline', message: 'Tender Deadline: May 10, 2025', severity: 'High' },
    { id: 2, name: 'System Update', message: 'System Update: New Feature Available', severity: 'Low' },
    { id: 3, name: 'Tender Submission', message: 'Tender Submission Due: May 15, 2025', severity: 'Medium' }
  ]

  return (
    <div className="home-page">
      <Sidebar />
      <div className="home-content">
        <h1 className="home-title">Tender System</h1>
        <div className="home-card">
          <div className="alerts-section">
            <h2 className="alerts-title">
              <FontAwesomeIcon icon={faBell} className="alerts-icon" />
              Alerts
            </h2>
            <div className="alerts-table">
              <div className="table-header">
                <div className="table-cell">No</div>
                <div className="table-cell">Alert Name</div>
                <div className="table-cell">Description</div>
                <div className="table-cell">Severity</div>
              </div>
              {alerts.map((alert, index) => (
                <div key={alert.id} className="table-row">
                  <div className="table-cell">{index + 1}</div>
                  <div className="table-cell">{alert.name}</div>
                  <div className="table-cell">{alert.message}</div>
                  <div className="table-cell">
                    <span className={`severity-badge severity-${alert.severity.toLowerCase()}`}>
                      {alert.severity}
                    </span>
                  </div>
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