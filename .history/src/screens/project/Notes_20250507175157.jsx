import { useParams } from 'react-router-dom'
import Sidebar from '../Sidebar'
import './Notes.css'

const Notes = () => {
  const { id } = useParams()

  return (
    <div className="notes-page">
      <Sidebar />
      <div className="notes-main">
        <div className="notes-content">
          <h1>Project Notes - ID: {id}</h1>
          <p>This is a placeholder for the Project Notes subsection. Functionality to manage notes will be added here.</p>
        </div>
      </div>
    </div>
  )
}

export default Notes