import { useParams } from 'react-router-dom'
import Sidebar from '../Sidebar'
import './Expenses.css'

const Expenses = () => {
  const { id } = useParams()

  return (
    <div className="expenses-page">
      <Sidebar />
      <div className="expenses-main">
        <div className="expenses-content">
          <h1>Project Expenses - ID: {id}</h1>
          <p>This is a placeholder for the Project Expenses subsection. Functionality to manage expenses will be added here.</p>
        </div>
      </div>
    </div>
  )
}

export default Expenses