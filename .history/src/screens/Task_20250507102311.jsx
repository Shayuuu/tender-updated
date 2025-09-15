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

  const formatField = (field, value) => {
    if (!value) return '-';
    const dateFields = [
      'emdBgFdrDueDate',
      'emdBgFdrValidityDate',
      'bidOpeningDate',
      'physicalDocumentSubmissionDueDate',
      'bidSubmissionDate',
      'preBidMeetingDate',
      'emdBgFdrStatusDate',
      'lastDateOfSubmission',
      'technicalOpeningDate',
      'financialOpeningDate'
    ];
    if (dateFields.includes(field) && value) {
      return formatDate(value);
    } else if (field === 'attachments') {
      return value.map(file => file.name).join('; ') || '-';
    } else if (field === 'bidders') {
      return value.length > 0 ? (
        <ul>
          {value.map((bidder, index) => (
            <li key={index}>
              {bidder.bidderName} (Amount: {bidder.financialBidAmount.toLocaleString('en-IN')})
            </li>
          ))}
        </ul>
      ) : '-';
    }
    return value.toString();
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
            <h2>Form and Bidder Details Data</h2>
            {storageData.bidders.length === 0 ? (
              <div className="task-empty">No Form or Bidder Details data available.</div>
            ) : (
              storageData.bidders.map((entry) => (
                <div key={entry.id} className="task-entry">
                  <h3>Form ID: {entry.id}</h3>
                  <div className="task-list-container">
                    <div className="task-list-header">
                      <div className="task-list-column">Field</div>
                      <div className="task-list-column">Value</div>
                    </div>
                    <div className="task-list">
                      {Object.keys(entry)
                        .filter(key => key !== 'id')
                        .map((field) => (
                          <div key={field} className="task-card">
                            <div className="task-list-column">
                              <span className="task-label-mobile">Field:</span>
                              {field}
                            </div>
                            <div className="task-list-column">
                              <span className="task-label-mobile">Value:</span>
                              {formatField(field, entry[field])}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="task-entry-actions">
                    <button
                      className="task-btn task-delete-btn"
                      onClick={() => handleDeleteEntry(entry.id, 'bidders')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
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