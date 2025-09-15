import Sidebar from './Sidebar'
import './TaskList.css'

const BidderTaskList = () => {
  return (
    <div className="bidder-tasklist-page">
      <Sidebar />
      <div className="bidder-tasklist-main">
        <div className="bidder-tasklist-content">
          <h1>Bidder TaskList</h1>
          <div className="bidder-tasklist-coming-soon">
            Placeholder Content
          </div>
        </div>
      </div>
    </div>
  )
}

export default BidderTaskList