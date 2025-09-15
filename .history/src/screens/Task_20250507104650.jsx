import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import './Task.css'

const Task = () => {
  const [formIds, setFormIds] = useState([])
  const [storageData, setStorageData] = useState({ bidders: [], milestones: [] })
  const [expandedFormId, setExpandedFormId] = useState(null)

  useEffect(() => {
    // Load data from localStorage
    const bidders = JSON.parse(localStorage.getItem('customBidderData')) || []
    const milestones = JSON.parse(localStorage.getItem('customMilestoneData')) || []
    setStorageData({ bidders, milestones })

    // Get unique Form IDs
    const allIds = [
      ...bidders.map(entry => entry.id),
      ...milestones.map(entry => entry.id)
    ]
    const uniqueIds = [...new Set(allIds)].sort((a, b) => a - b)
    setFormIds(uniqueIds)
  }, [])

  const handleDeleteEntireHistory = () => {
    localStorage.clear()
    setStorageData({ bidders: [], milestones: [] })
    setFormIds([])
    setExpandedFormId(null)
  }

  const handleDeleteForm = (id) => {
    const updatedBidders = storageData.bidders.filter(entry => entry.id !== id)
    const updatedMilestones = storageData.milestones.filter(entry => entry.id !== id)

    localStorage.setItem('customBidderData', JSON.stringify(updatedBidders))
    localStorage.setItem('customMilestoneData', JSON.stringify(updatedMilestones))

    setStorageData({
      bidders: updatedBidders,
      milestones: updatedMilestones
    })

    const updatedIds = formIds.filter(formId => formId !== id)
    setFormIds(updatedIds)

    if (expandedFormId === id) {
      setExpandedFormId(null)
    }
  }

  const toggleViewForm = (id) => {
    setExpandedFormId(expandedFormId === id ? null : id)
  }

  const formatField = (field, value) => {
    if (!value) return '-'
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
      'financialOpeningDate',
      'date'
    ]
    if (dateFields.includes(field) && value) {
      const date = new Date(value)
      const dd = String(date.getDate()).padStart(2, '0')
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const yyyy = date.getFullYear()
      return `${dd}-${mm}-${yyyy}`
    } else if (field === 'attachments') {
      return value.map(file => file.name).join('; ') || '-'
    } else if (field === 'bidders') {
      return value.length > 0 ? (
        <ul>
          {value.map((bidder, index) => (
            <li key={index}>
              {bidder.bidderName} (Amount: {bidder.financialBidAmount.toLocaleString('en-IN')})
            </li>
          ))}
        </ul>
      ) : '-'
    } else if (field === 'extensionDates') {
      return value.length > 0 ? (
        <ul>
          {value.map((ext, index) => (
            <li key={index}>
              {ext.extensionNo ? `Extension ${ext.extensionNo}` : `Extension ${index + 1}`}: 
              {ext.date ? formatField('date', ext.date) : 'No date available'}
              {Object.keys(ext).filter(key => !['extensionNo', 'date'].includes(key)).length > 0 && (
                <ul>
                  {Object.entries(ext)
                    .filter(([key]) => !['extensionNo', 'date'].includes(key))
                    .map(([key, val]) => (
                      <li key={key}>
                        {key}: {formatField(key, val)}
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : '-'
    } else if (field === 'milestones') {
      return value.length > 0 ? (
        <ul>
          {value.map((milestone, index) => (
            <li key={index}>
              {milestone.task}: {milestone.completed ? 'Completed' : 'Not Completed'}
            </li>
          ))}
        </ul>
      ) : '-'
    }
    return value.toString()
  }

  const getFormData = (id) => {
    const bidderEntry = storageData.bidders.find(entry => entry.id === id) || {}
    const milestoneEntry = storageData.milestones.find(entry => entry.id === id) || { milestones: [] }

    return {
      ...bidderEntry,
      extensionDates: bidderEntry.extensionDates || [],
      milestones: milestoneEntry.milestones
    }
  }

  return (
    <div className="task-page">
      <Sidebar />
      <div className="task-main">
        <div className="task-content">
          <h1>Task Summary</h1>
          <div className="task-actions">
            <button className="task-btn task-clear-btn" onClick={handleDeleteEntireHistory}>
              Delete Entire Local History
            </button>
          </div>
          <div className="task-cards">
            {formIds.length === 0 ? (
              <div className="task-empty">No forms stored in local storage.</div>
            ) : (
              formIds.map((formId) => (
                <div key={formId} className="task-card-wrapper">
                  <div className="task-card">
                    <div className="task-card-header">
                      <span>Form ID: {formId}</span>
                      <div className="task-card-actions">
                        <button
                          className="task-icon-btn task-view-btn"
                          onClick={() => toggleViewForm(formId)}
                          title="View"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          className="task-icon-btn task-delete-btn"
                          onClick={() => handleDeleteForm(formId)}
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                    {expandedFormId === formId && (
                      <div className="task-card-details">
                        <h3>Form Details</h3>
                        <div className="task-list-container">
                          <div className="task-list-header">
                            <div className="task-list-column">Field</div>
                            <div className="task-list-column">Value</div>
                          </div>
                          <div className="task-list">
                            {Object.entries(getFormData(formId))
                              .filter(([key]) => key !== 'id')
                              .map(([field, value]) => (
                                <div key={field} className="task-detail-row">
                                  <div className="task-list-column">
                                    <span className="task-label-mobile">Field:</span>
                                    {field}
                                  </div>
                                  <div className="task-list-column">
                                    <span className="task-label-mobile">Value:</span>
                                    {formatField(field, value)}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Task