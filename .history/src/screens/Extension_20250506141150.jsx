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
  const [editIndex, setEditIndex] = useState(null)
  const [editDate, setEditDate] = useState('')

  useEffect(() => {
    const data = bidderData.find((bidder) => bidder.id === parseInt(id))
    if (data && data.id === 1 && data.extensionDates) {
      setExtensionDates(data.extensionDates)
    }
  }, [id])

  const formatDateWithDay = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const day = dayNames[date.getDay()]
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yyyy = date.getFullYear()
    return `${day} ${dd}-${mm}-${yyyy}`
  }

  const handleAddToggle = () => {
    setIsAdding(true)
    setIsEditing(false)
    setEditIndex(null)
    setEditDate('')
  }

  const handleEditToggle = (index, date) => {
    setIsEditing(true)
    setEditIndex(index)
    setEditDate(date)
    setIsAdding(false)
    setNewDate('')
  }

  const handleSaveAdd = () => {
    if (newDate) {
      const newExtension = {
        extensionNo: extensionDates.length + 1,
        date: newDate
      }
      setExtensionDates([...extensionDates, newExtension])
      setNewDate('')
      setIsAdding(false)
    }
  }

  const handleSaveEdit = () => {
    if (editDate && editIndex !== null) {
      const updatedDates = [...extensionDates]
      updatedDates[editIndex] = { ...updatedDates[editIndex], date: editDate }
      setExtensionDates(updatedDates)
      setIsEditing(false)
      setEditIndex(null)
      setEditDate('')
    }
  }

  const handleCancel = () => {
    setNewDate('')
    setIsAdding(false)
    setIsEditing(false)
    setEditIndex(null)
    setEditDate('')
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
                  onClick={() => setIsEditing(true)}
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
          <div className="extension-table-container">
            <table className="extension-table">
              <thead>
                <tr>
                  <th>Extension No.</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {extensionDates.map((ext, index) => (
                  <tr key={index}>
                    <td>{ext.extensionNo}</td>
                    <td>
                      {isEditing && editIndex === index ? (
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="extension-input"
                        />
                      ) : (
                        <>
                          {formatDateWithDay(ext.date)}
                          {isEditing && editIndex !== index && (
                            <button
                              className="extension-edit-row-btn"
                              onClick={() => handleEditToggle(index, ext.date)}
                            >
                              Edit
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {isAdding && (
                  <tr>
                    <td>{extensionDates.length + 1}</td>
                    <td>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="extension-input"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Extension