import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import bidderData from '../data/Bidderdata'
import Sidebar from './Sidebar'
import './Extension.css'

const Extension = () => {
  const { id } = useParams()
  const [extensionDates, setExtensionDates] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newDate, setNewDate] = useState('')

  useEffect(() => {
    const data = bidderData.find((bidder) => bidder.id === parseInt(id))
    if (data && data.id === 1 && data.extensionDates) {
      setExtensionDates(data.extensionDates)
    }
  }, [id])

  const handleAddDate = () => {
    if (newDate) {
      const newExtension = {
        extensionNo: extensionDates.length + 1,
        date: newDate
      }
      setExtensionDates([...extensionDates, newExtension])
      setNewDate('')
      setIsModalOpen(false)
    }
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
          <button
            className="extension-btn extension-add-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Add Extension Date
          </button>
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
                    <td>{ext.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isModalOpen && (
            <div className="extension-modal">
              <div className="extension-modal-content">
                <h2>Add Extension Date</h2>
                <div className="extension-modal-field">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>
                <div className="extension-modal-actions">
                  <button
                    className="extension-btn extension-add-confirm-btn"
                    onClick={handleAddDate}
                  >
                    Add
                  </button>
                  <button
                    className="extension-btn extension-cancel-btn"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Extension