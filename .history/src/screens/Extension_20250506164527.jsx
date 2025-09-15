import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import bidderData from '../data/Bidderdata'
import Sidebar from './Sidebar'
import './Extension.css'

const Extension = () => {
  const { id } = useParams()
  const [extensionDates, setExtensionDates] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editDates, setEditDates] = useState([])

  useEffect(() => {
    // Load data from bidderData or localStorage
    const localData = JSON.parse(localStorage.getItem('customBidderData')) || []
    const bidder = bidderData.find((b) => b.id === parseInt(id))
    const localBidder = localData.find((b) => b.id === parseInt(id))

    let data = bidder || localBidder

    if (data && data.extensionDates) {
      setExtensionDates(data.extensionDates)
    } else {
      // If no data or no extensionDates, initialize as empty array
      setExtensionDates([])
    }
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yyyy = date.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

  const handleAddToggle = () => {
    setIsAdding(true)
    setIsEditing(false)
    setEditDates([])
  }

  const handleEditToggle = () => {
    setIsEditing(true)
    setIsAdding(false)
    setNewDate('')
    setEditDates(extensionDates.map(ext => ext.date))
  }

  const handleEditDateChange = (index, value) => {
    const updatedEditDates = [...editDates]
    updatedEditDates[index] = value
    setEditDates(updatedEditDates)
  }

  const handleSaveAdd = () => {
    if (newDate) {
      const newExtension = {
        extensionNo: extensionDates.length + 1,
        date: newDate
      }
      const updatedDates = [...extensionDates, newExtension]
      setExtensionDates(updatedDates)
      setNewDate('')
      setIsAdding(false)

      // Update localStorage
      const localData = JSON.parse(localStorage.getItem('customBidderData')) || []
      const bidderIndex = localData.findIndex((b) => b.id === parseInt(id))
      if (bidderIndex !== -1) {
        localData[bidderIndex].extensionDates = updatedDates
        localStorage.setItem('customBidderData', JSON.stringify(localData))
      }
    }
  }

  const handleSaveEdit = () => {
    if (editDates.length > 0) {
      const updatedDates = extensionDates.map((ext, index) => ({
        ...ext,
        date: editDates[index] || ext.date
      }))
      setExtensionDates(updatedDates)
      setIsEditing(false)
      setEditDates([])

      // Update localStorage
      const localData = JSON.parse(localStorage.getItem('customBidderData')) || []
      const bidderIndex = localData.findIndex((b) => b.id === parseInt(id))
      if (bidderIndex !== -1) {
        localData[bidderIndex].extensionDates = updatedDates
        localStorage.setItem('customBidderData', JSON.stringify(localData))
      }
    }
  }

  const handleCancel = () => {
    setNewDate('')
    setIsAdding(false)
    setIsEditing(false)
    setEditDates([])
  }

  if (!extensionDates || extensionDates.length === 0) {
    return (
      <div className="extension-page">
        <Sidebar />
        <div className="extension-main">
          <div className="extension-content">
            <h1>Extension Dates</h1>
            <div className="extension-coming-soon">
              Coming Soon: Detailed information for this tender is not yet available.
            </div>
            <div className="extension-actions">
              <button
                className="extension-btn extension-add-btn"
                onClick={handleAddToggle}
              >
                Add Extension Date
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="extension-page">
      <Sidebar />
      <div className="extension-main">
        <div className="extension-content">
          <h1>Extension Dates</h1>
          <div className="extension-list-container">
            <div className="extension-list-header">
              <div className="extension-list-column">Extension No.</div>
              <div className="extension-list-column">Date</div>
            </div>
            <div className="extension-list">
              {extensionDates.map((ext, index) => (
                <div key={index} className="extension-card">
                  <div className="extension-list-column">
                    <span className="extension-label-mobile">Extension No:</span>
                    {ext.extensionNo}
                  </div>
                  <div className="extension-list-column">
                    <span className="extension-label-mobile">Date:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editDates[index] || ''}
                        onChange={(e) => handleEditDateChange(index, e.target.value)}
                        className="extension-input"
                      />
                    ) : (
                      formatDate(ext.date)
                    )}
                  </div>
                </div>
              ))}
              {isAdding && (
                <div className="extension-card">
                  <div className="extension-list-column">
                    <span className="extension-label-mobile">Extension No:</span>
                    {extensionDates.length + 1}
                  </div>
                  <div className="extension-list-column">
                    <span className="extension-label-mobile">Date:</span>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="extension-input"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="extension-actions">
            {!(isAdding || isEditing) ? (
              <>
                <button
                  className="extension-btn extension-add-btn"
                  onClick={handleAddToggle}
                >
                  Add Extension Date
                </button>
                <button
                  className="extension-btn extension-edit-btn"
                  onClick={handleEditToggle}
                  disabled={extensionDates.length === 0}
                >
                  Edit
                </button>
              </>
            ) : (
              <>
                <button
                  className="extension-btn extension-save-btn"
                  onClick={isAdding ? handleSaveAdd : handleSaveEdit}
                >
                  Save
                </button>
                <button
                  className="extension-btn extension-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Extension