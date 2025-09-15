import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import bidderData from '../data/Bidderdata'
import Sidebar from './Sidebar'
import './Milestone.css'

const Milestone = () => {
  const { id } = useParams()
  const [milestones, setMilestones] = useState([])

  useEffect(() => {
    const data = bidderData.find((bidder) => bidder.id === parseInt(id))
    if (data && data.id === 1 && data.milestones) {
      setMilestones(data.milestones)
    }
  }, [id])

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
          <div className="milestone-timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="milestone-item">
                <div className="milestone-dot-container">
                  <div className={`milestone-dot ${milestone.completed ? 'completed' : ''}`}>
                    {milestone.completed && <div className="milestone-dot-glow"></div>}
                  </div>
                  {index < milestones.length - 1 && <div className="milestone-line"></div>}
                </div>
                <div className="milestone-info">
                  <div className="milestone-task">{milestone.task}</div>
                  <div className="milestone-status">
                    {milestone.completed ? 'Completed' : 'Not Completed'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Milestone