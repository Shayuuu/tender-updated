import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import './Task.css'

const Task = () => {
  const [storageData, setStorageData] = useState({ bidders: [], extensions: [], milestones: [] })

  useEffect(() => {
    // Load data from localStorage
    const bidders = JSON.parse(localStorage.getItem('customBidderData')) || []
    const extensions = JSON.parse(localStorage.getItem('customExtensionData')) || []
    const milestones = JSON.parse(localStorage.getItem('customMilestoneData')) || []
    setStorageData({ bidders, extensions, milestones })
  }, [])

  const handleDeleteEntry = (id, type) => {
    let key;
    switch (type) {
      case 'bidders':
        key = 'customBidderData';
        break;
      case 'extensions':
        key = 'customExtensionData';
        break;
      case 'milestones':
        key = 'customMilestoneData';
        break;
      default:
        return;
    }

    const data = JSON.parse(localStorage.getItem(key)) || [];
    const updatedData = data.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(updatedData));

    // Update state to reflect the change
    setStorageData(prev => ({
      ...prev,
      [type]: updatedData
    }));
  }

  const handleClearAll = () => {
    localStorage.clear();
    setStorageData({ bidders: [], extensions: [], milestones: [] });
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  return (
    <div className="task-page">
      <Sidebar />
      <div className="task-main">
        <div className="task-content">
          <h1>Task Summary</h1>
          <div className="task-actions">
            <button className="task-btn task-clear-btn" onClick={handleClearAll}>
              Clear All Data
            </button>
          </div>
          <div className="task-section">
            <h2>Bidder Details Data</h2>
            {storageData.bidders.length === 0 ? (
              <div className="task-empty">No Bidder Details data available.</div>
            ) : (
              <div className="task-list-container">
                <div className="task-list-header">
                  <div className="task-list-column">Form ID</div>
                  <div className="task-list-column">Technical Opening Date</div>
                  <div className="task-list-column">Financial Opening Date</div>
                  <div className="task-list-column">Bidders</div>
                  <div className="task-list-column">Actions</div>
                </div>
                <div className="task-list">
                  {storageData.bidders.map((entry) => (
                    <div key={entry.id} className="task-card">
                      <div className="task-list-column">
                        <span className="task-label-mobile">Form ID:</span>
                        {entry.id}
                      </div>
                      <div className="task-list-column">
                        <span className="task-label-mobile">Technical Opening Date:</span>
                        {formatDate(entry.technicalOpeningDate)}
                      </div>
                      <div className="task-list-column">
                        <span className="task-label-mobile">Financial Opening Date:</span>
                        {formatDate(entry.financialOpeningDate)}
                      </div>
                      <div className="task-list-column">
                        <span className="task-label-mobile">Bidders:</span>
                        {entry.bidders.length > 0 ? (
                          <ul>
                            {entry.bidders.map((bidder, index) => (
                              <li key={index}>
                                {bidder.bidderName} (Amount: {bidder.financialBidAmount.toLocaleString('en-IN')})
                              </li>
                            ))}
                          </ul>
                        ) : '-'}
                      </div>
                      <div className="task-list-column">
                        <span className="task-label-mobile">Actions:</span>
                        <button
                          className="task-btn task-delete-btn"
                          onClick={() => handleDeleteEntry(entry.id, 'bidders')}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="task-section">
            <h2>Extension Data</h2>
            {storageData.extensions.length === 0 ? (
              <div className="task-empty">No Extension data available.</div>
            ) : (
              <div className="task-list-container">
                <div className="task-list-header">
                  <div className="task-list-column">Form ID</div>
                  <div className="task-list-column">Extensions</div>
                  <div className="task-list-column">Actions</div>
                </div>
                <div className="task-list">
                  {storageData.extensions.map((entry) => (
                    <div key={entry.id} className="task-card">
                      <div className="task-list-column">
                        <span className="task-label-mobile">Form ID:</span>
                        {entry.id}
                      </div>
                      <div className="task-list-column">
                        <span className="task-label-mobile">Extensions:</span>
                        {entry.extensions.length > 0 ? (
                          <ul>
                            {entry.extensions.map((ext, index) => (
                              <li key={index}>
                                Extension {ext.extensionNo}: {formatDate(ext.date)}
                              </li>
                            ))}
                          </ul>
                        ) : '-'}
                      </div>
                      <div className="task-list-column">
                        <span className="task-label-mobile">Actions:</span>
                        <button
                          className="task-btn task-delete-btn"
                          onClick={() => handleDeleteEntry(entry.id, 'extensions')}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="task-section">
            <h2>Milestone Data</h2>
            {storageData.milestones.length === 0 ? (
              <div className="task-empty">No Milestone data available.</div>
            ) : (
              <div className="task-list-container">
                <div className="task-list-header">
                  <div className="task-list-column">Form ID</div>
                  <div className="task-list-column">Milestones</div>
                  <div className="task-list-column">Actions</div>
                </div>
                <div className="task-list">
                  {storageData.milestones.map((entry) => (
                    <div key={entry.id} className="task-card">
                      <div className="task-list-column">
                        <span className="task-label-mobile">Form ID:</span>
                        {entry.id}
                      </div>
                      <div className="task-list-column">
                        <span className="task-label-mobile">Milestones:</span>
                        {entry.milestones.length > 0 ? (
                          <ul>
                            {entry.milestones.map((milestone, index) => (
                              <li key={index}>
                                {milestone.task}: {milestone.completed ? 'Completed' : 'Not Completed'}
                              </li>
                            ))}
                          </ul>
                        ) : '-'}
                      </div>
                      <div className="task-list-column">
                        <span className="task-label-mobile">Actions:</span>
                        <button
                          className="task-btn task-delete-btn"
                          onClick={() => handleDeleteEntry(entry.id, 'milestones')}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Task