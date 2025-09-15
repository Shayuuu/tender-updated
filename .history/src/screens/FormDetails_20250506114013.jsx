import { useLocation, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import './FormDetails.css'

const FormDetails = () => {
  const location = useLocation()
  const { id } = useParams()
  console.log('FormDetails: location.pathname:', location.pathname)
  console.log('FormDetails: bidder id:', id)

  return (
    <div className="form-details-page" data-route={`/bidders/${id}`}>
      <Sidebar currentRoute={location.pathname} />
      <div className="form-details-main">
        <h1 className="form-details-title">Form Details</h1>
        <div className="form-details-content">
          <p>PCurrently in Production</p>
        </div>
      </div>
    </div>
  )
}

export default FormDetails