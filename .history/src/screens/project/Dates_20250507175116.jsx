import { useParams } from 'react-router-dom'
import Sidebar from '../Sidebar'
import './Dates.css'

const Dates = () => {
  const { id } = useParams()

  return (
    <div className="dates-page">
      <Sidebar />
      <div className="dates-main">
        <div className="dates-content">
          <h1>Project Completion Dates - ID: {id}</h1>
          <p>This is a placeholder for the Project Completion Dates subsection. Functionality to manage completion dates will be added here.</p>
        </div>
      </div>
    </div>
  )
}

export default Dates