import { useParams } from 'react-router-dom'
import Sidebar from '../Sidebar'
import './Account.css'

const Account = () => {
  const { id } = useParams()

  return (
    <div className="account-page">
      <Sidebar />
      <div className="account-main">
        <div className="account-content">
          <h1>Project Running Account - ID: {id}</h1>
          <p>This is a placeholder for the Project Running Account subsection. Functionality to manage running account details will be added here.</p>
        </div>
      </div>
    </div>
  )
}

export default Account