import { useParams } from 'react-router-dom'
import Sidebar from '../Sidebar'
import './Variations.css'

const Variations = () => {
  const { id } = useParams()

  return (
    <div className="variations-page">
      <Sidebar />
      <div className="variations-main">
        <div className="variations-content">
          <h1>Project Variations - ID: {id}</h1>
          <p>This is a placeholder for the Project Variations subsection. Functionality to manage contract variations will be added here.</p>
        </div>
      </div>
    </div>
  )
}

export default Variations