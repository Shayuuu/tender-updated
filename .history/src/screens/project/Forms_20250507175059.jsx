import { useParams } from 'react-router-dom'
import Sidebar from '../Sidebar'
import './Forms.css'

const Forms = () => {
  const { id } = useParams()

  return (
    <div className="forms-page">
      <Sidebar />
      <div className="forms-main">
        <div className="forms-content">
          <h1>Project Forms - ID: {id}</h1>
          <p>This is a placeholder for the Project Forms subsection. Functionality to edit project details will be added here.</p>
        </div>
      </div>
    </div>
  )
}

export default Forms