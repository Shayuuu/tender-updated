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
    const data = bidderData.find((bidder) => bidder.id === parseInt(id))
    if (data && data.id === 1 && data.milestones) {
      setMilestones(data.milestones)
    }
  }, [id])

  const handleEditToggle = () => {
    setIsEditing(true)
    setEditMilestones(milestones.map(milestone => ({ ...milestone })))
  }

  const handleSaveEdit = () => {
    setMilestones(editMilestones)
    setIsEditing(false)
    setEditMilestones([])
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditMilestones([])
  }

  const toggleCompletion = (index) => {
    const updatedEditMilestones = [...editMilestones]
    updatedEditMilestones[index].completed = !updatedEditMilestones[index].completed
    setEditMilestones(updatedEditMilestones)
  }

  if (!milestones || milestones.length === 0) {
    return (
      <div className="milestone-page">
        <Sidebar />
        <div className="milestone-main">
          <div className="milestone-content">
            <h1>Milestone Tracker</h1>
            <div className="milestone-coming-soon">
              Coming Soon: Milestone tracking for this tender is not yet available.
            </div>
          </div>
        </div>
      </div>
    )
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
              {(isEditing ? editMilestones : milestones).map((milestone, index) => (
                <div key={index} className="milestone-card">
                  <div className="milestone-list-column">
                    <span className="milestone-label-mobile">Task:</span>
                    {milestone.task}
                  </div>
                  <div className="milestone-list-column">
                    <span className="milestone-label-mobile">Status:</span>
                    <span
                      className={`milestone-status ${isEditing ? 'editable' : ''}`}
                      onClick={isEditing ? () => toggleCompletion(index) : null}
                    >
                      <FontAwesomeIcon
                        icon={milestone.completed ? faCheckCircle : faCircle}
                        className={`milestone-icon ${milestone.completed ? 'completed' : ''}`}
                      />
                      {isEditing && <span>{milestone.completed ? 'Completed' : 'Not Completed'}</span>}
                    </span>
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
                disabled={milestones.length === 0}
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