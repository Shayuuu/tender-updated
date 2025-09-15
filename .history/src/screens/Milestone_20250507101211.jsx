import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import bidderData from '../data/Bidderdata'
import Sidebar from './Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons'
import './Milestone.css'

const Milestone = () => {
  const { id } = useParams()
  const [milestones, setMilestones] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editMilestones, setEditMilestones] = useState([])

  useEffect(() => {
    // Load data from bidderData or localStorage
    const localData = JSON.parse(localStorage.getItem('customMilestoneData')) || []
    const bidder = bidderData.find((b) => b.id === parseInt(id))
    const localMilestone = localData.find((b) => b.id === parseInt(id))

    let data = bidder || localMilestone

    if (data && data.milestones) {
      setMilestones(data.milestones)
    } else {
      // Initialize with specific milestones for new forms
      const defaultMilestones = [
        { task: 'BG Made', completed: false },
        { task: 'FD Made', completed: false },
        { task: 'TD Made', completed: false },
        { task: 'Project Won', completed: false }
      ]
      setMilestones(defaultMilestones)
    }
  }, [id])

  const handleEditToggle = () => {
    setIsEditing(true)
    setEditMilestones(milestones.map(milestone => ({ ...milestone })))
  }

  const handleMilestoneChange = (index, field, value) => {
    const updatedEditMilestones = [...editMilestones]
    updatedEditMilestones[index] = { ...updatedEditMilestones[index], [field]: value }
    setEditMilestones(updatedEditMilestones)
  }

  const handleSaveEdit = () => {
    setMilestones(editMilestones)
    setIsEditing(false)
    setEditMilestones([])

    // Update or create entry in localStorage
    const localData = JSON.parse(localStorage.getItem('customMilestoneData')) || []
    const milestoneIndex = localData.findIndex((m) => m.id === parseInt(id))
    if (milestoneIndex !== -1) {
      // Update existing entry
      localData[milestoneIndex].milestones = editMilestones
    } else {
      // Create new entry if it doesn't exist
      const newMilestoneEntry = { id: parseInt(id), milestones: editMilestones }
      localData.push(newMilestoneEntry)
    }
    localStorage.setItem('customMilestoneData', JSON.stringify(localData))
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditMilestones([])
  }

  return (
    <div className="milestone-page">
      <Sidebar />
      <div className="milestone-main">
        <div className="milestone-content">
          <h1>Milestone Tracker</h1>
          <div className="milestone-list-container">
            <div className="milestone-list-header">
              <div className="milestone-list-column">Task</div>
              <div className="milestone-list-column">Status</div>
            </div>
            <div className="milestone-list">
              {milestones.length === 0 && (
                <div className="milestone-empty">
                  No milestones available.
                </div>
              )}
              {milestones.map((milestone, index) => (
                <div key={index} className="milestone-card">
                  <div className="milestone-list-column">
                    <span className="milestone-label-mobile">Task:</span>
                    {milestone.task}
                  </div>
                  <div className="milestone-list-column">
                    <span className="milestone-label-mobile">Status:</span>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={editMilestones[index]?.completed || false}
                        onChange={(e) => handleMilestoneChange(index, 'completed', e.target.checked)}
                        className="milestone-checkbox"
                      />
                    ) : (
                      <span className="milestone-status">
                        <FontAwesomeIcon
                          icon={milestone.completed ? faCheckCircle : faCircle}
                          className={`milestone-icon ${milestone.completed ? 'completed' : ''}`}
                        />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="milestone-actions">
            {isEditing ? (
              <>
                <button
                  className="milestone-btn milestone-save-btn"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
                <button
                  className="milestone-btn milestone-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="milestone-btn milestone-edit-btn"
                onClick={handleEditToggle}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Milestone