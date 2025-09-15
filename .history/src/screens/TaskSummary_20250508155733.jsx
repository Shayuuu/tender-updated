import Sidebar from './Sidebar'
import './TaskSummary.css'

const BidderTaskSummary = () => {
  return (
    <div className="bidder-tasksummary-page">
      <Sidebar />
      <div className="bidder-tasksummary-main">
        <div className="bidder-tasksummary-content">
          <h1>Bidder Task Summary</h1>
          <div className="bidder-tasksummary-coming-soon">
            Placeholder Content
          </div>
        </div>
      </div>
    </div>
  )
}

export default BidderTaskSummary