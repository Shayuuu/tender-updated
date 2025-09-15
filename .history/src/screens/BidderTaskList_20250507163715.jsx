import Sidebar from './Sidebar'
import './BidderTaskList.css'

const BidderTaskList = () => {
  return (
    <div className="bidder-tasklist-page">
      <Sidebar />
      <div className="bidder-tasklist-main">
        <div className="bidder-tasklist-content">
          <h1>Bidder TaskList</h1>
          <div className="bidder-tasklist-coming-soon">
            Coming Soon: This page will display the task list for the bidder.
          </div>
        </div>
      </div>
    </div>
  )
}

export default BidderTaskList