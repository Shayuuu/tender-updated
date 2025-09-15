import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import bidderData from '../data/Bidderdata'
import Sidebar from './Sidebar'
import './BidderDetails.css'

const BidderDetails = () => {
  const { id } = useParams()
  const [technicalOpeningDate, setTechnicalOpeningDate] = useState('')
  const [financialOpeningDate, setFinancialOpeningDate] = useState('')
  const [bidders, setBidders] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [newBidder, setNewBidder] = useState({ bidderName: '', technicallyQualified: 'YES', financialBidAmount: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [editDates, setEditDates] = useState({ technical: '', financial: '' })
  const [editBidders, setEditBidders] = useState([])
  const [sortOrder, setSortOrder] = useState('desc') // desc or asc
  const [tenderCost, setTenderCost] = useState(0)

  useEffect(() => {
    const data = bidderData.find((bidder) => bidder.id === parseInt(id))
    if (data && data.id === 1 && data.bidders) {
      setTechnicalOpeningDate(data.technicalOpeningDate)
      setFinancialOpeningDate(data.financialOpeningDate)
      setBidders(data.bidders)
      setTenderCost(parseFloat(data.costOfWork.replace(' Lakhs', '')) * 100000) // Convert "50 Lakhs" to 5000000
    }
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yyyy = date.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

  const calculateRankingAndPercentage = (biddersList) => {
    const sortedBidders = [...biddersList].sort((a, b) => {
      const amountA = parseFloat(a.financialBidAmount)
      const amountB = parseFloat(b.financialBidAmount)
      return sortOrder === 'desc' ? amountB - amountA : amountA - amountB
    })

    return sortedBidders.map((bidder, index) => {
      const amount = parseFloat(bidder.financialBidAmount)
      const percentage = ((amount - tenderCost) / tenderCost) * 100
      return {
        ...bidder,
        ranking: `L${index + 1}`,
        percentageAboveBelow: percentage >= 0 ? `+${percentage.toFixed(2)}%` : `${percentage.toFixed(2)}%`
      }
    })
  }

  const handleSortRanking = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
  }

  const handleAddToggle = () => {
    setIsAdding(true)
    setIsEditing(false)
    setEditDates({ technical: '', financial: '' })
    setEditBidders([])
  }

  const handleEditToggle = () => {
    setIsEditing(true)
    setIsAdding(false)
    setNewBidder({ bidderName: '', technicallyQualified: 'YES', financialBidAmount: '' })
    setEditDates({ technical: technicalOpeningDate, financial: financialOpeningDate })
    setEditBidders(bidders.map(bidder => ({ ...bidder })))
  }

  const handleEditBidderChange = (index, field, value) => {
    const updatedEditBidders = [...editBidders]
    updatedEditBidders[index] = { ...updatedEditBidders[index], [field]: value }
    setEditBidders(updatedEditBidders)
  }

  const handleSaveAdd = () => {
    if (newBidder.bidderName && newBidder.financialBidAmount) {
      const newEntry = {
        bidderNo: bidders.length + 1,
        bidderName: newBidder.bidderName,
        technicallyQualified: newBidder.technicallyQualified,
        financialBidAmount: parseFloat(newBidder.financialBidAmount)
      }
      setBidders([...bidders, newEntry])
      setNewBidder({ bidderName: '', technicallyQualified: 'YES', financialBidAmount: '' })
      setIsAdding(false)
    }
  }

  const handleSaveEdit = () => {
    if (editDates.technical && editDates.financial && editBidders.length > 0) {
      setTechnicalOpeningDate(editDates.technical)
      setFinancialOpeningDate(editDates.financial)
      setBidders(editBidders)
      setIsEditing(false)
      setEditDates({ technical: '', financial: '' })
      setEditBidders([])
    }
  }

  const handleCancel = () => {
    setNewBidder({ bidderName: '', technicallyQualified: 'YES', financialBidAmount: '' })
    setIsAdding(false)
    setIsEditing(false)
    setEditDates({ technical: '', financial: '' })
    setEditBidders([])
  }

  if (!bidders || bidders.length === 0) {
    return (
      <div className="bidder-details-page">
        <Sidebar />
        <div className="bidder-details-main">
          <div className="bidder-details-content">
            <h1>Bidder Details</h1>
            <div className="bidder-details-coming-soon">
              Coming Soon: Detailed information for this tender is not yet available.
            </div>
          </div>
        </div>
      </div>
    )
  }

  const rankedBidders = calculateRankingAndPercentage(bidders)

  return (
    <div className="bidder-details-page">
      <Sidebar />
      <div className="bidder-details-main">
        <div className="bidder-details-content">
          <h1>Bidder Details</h1>
          <div className="bidder-details-dates-container">
            <div className="bidder-details-date-card">
              <div className="bidder-details-date-header">
                <span className="bidder-details-date-label">Technical Opening Date</span>
              </div>
              <div className="bidder-details-date-value">
                {isEditing ? (
                  <input
                    type="date"
                    value={editDates.technical}
                    onChange={(e) => setEditDates({ ...editDates, technical: e.target.value })}
                    className="bidder-details-input"
                  />
                ) : (
                  <span>{formatDate(technicalOpeningDate)}</span>
                )}
              </div>
            </div>
            <div className="bidder-details-date-card">
              <div className="bidder-details-date-header">
                <span className="bidder-details-date-label">Financial Opening Date</span>
              </div>
              <div className="bidder-details-date-value">
                {isEditing ? (
                  <input
                    type="date"
                    value={editDates.financial}
                    onChange={(e) => setEditDates({ ...editDates, financial: e.target.value })}
                    className="bidder-details-input"
                  />
                ) : (
                  <span>{formatDate(financialOpeningDate)}</span>
                )}
              </div>
            </div>
          </div>
          <div className="bidder-details-list-container">
            <div className="bidder-details-list-header">
              <div className="bidder-details-list-column">Bidder No</div>
              <div className="bidder-details-list-column">Bidder Name</div>
              <div className="bidder-details-list-column">Technically Qualified / Responsive</div>
              <div className="bidder-details-list-column">Financial Bid Amount</div>
              <div className="bidder-details-list-column sortable" onClick={handleSortRanking}>
                Ranking {sortOrder === 'desc' ? '↓' : '↑'}
              </div>
              <div className="bidder-details-list-column">Percentage above/below tender cost</div>
            </div>
            <div className="bidder-details-list">
              {rankedBidders.map((bidder, index) => (
                <div key={index} className="bidder-details-card">
                  <div className="bidder-details-list-column">
                    <span className="bidder-details-label-mobile">Bidder No:</span>
                    {bidder.bidderNo}
                  </div>
                  <div className="bidder-details-list-column">
                    <span className="bidder-details-label-mobile">Bidder Name:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editBidders[index]?.bidderName || ''}
                        onChange={(e) => handleEditBidderChange(index, 'bidderName', e.target.value)}
                        className="bidder-details-input"
                      />
                    ) : (
                      bidder.bidderName
                    )}
                  </div>
                  <div className="bidder-details-list-column">
                    <span className="bidder-details-label-mobile">Technically Qualified / Responsive:</span>
                    {isEditing ? (
                      <select
                        value={editBidders[index]?.technicallyQualified || 'YES'}
                        onChange={(e) => handleEditBidderChange(index, 'technicallyQualified', e.target.value)}
                        className="bidder-details-input"
                      >
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    ) : (
                      bidder.technicallyQualified
                    )}
                  </div>
                  <div className="bidder-details-list-column">
                    <span className="bidder-details-label-mobile">Financial Bid Amount:</span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editBidders[index]?.financialBidAmount || ''}
                        onChange={(e) => handleEditBidderChange(index, 'financialBidAmount', parseFloat(e.target.value))}
                        className="bidder-details-input"
                      />
                    ) : (
                      bidder.financialBidAmount.toLocaleString('en-IN')
                    )}
                  </div>
                  <div className="bidder-details-list-column">
                    <span className="bidder-details-label-mobile">Ranking:</span>
                    {bidder.ranking}
                  </div>
                  <div className="bidder-details-list-column">
                    <span className="bidder-details-label-mobile">Percentage above/below tender cost:</span>
                    {bidder.percentageAboveBelow}
                  </div>
                </div>
              ))}
              {isAdding && (
                <div className="bidder-details-card">
                  <div className="bidder-details-list-column">
                    <span className="bidder-details-label-mobile">Bidder No:</span>
                    {bidders.length + 1}
                  </div>
                  <div className="bidder-details-list-column">
                    <span className="bidder-details-label-mobile">Bidder Name:</span>
                    <input
                      type="text"
                      value={newBidder.bidderName}
                      onChange={(e) => setNewBidder({ ...newBidder, bidderName: e.target.value })}
                      className="bidder-details-input"
                      placeholder="Enter Bidder Name"
                    />
                  </div>
                  <div className="bidder-details-list-column">
                    <span className="bidder-details-label-mobile">Technically Qualified / Responsive:</span>
                    <select
                      value={newBidder.technicallyQualified}
                      onChange={(e) => setNewBidder({ ...newBidder, technicallyQualified: e.target.value })}
                      className="bidder-details-input"
                    >
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                    </select>
                  </div>
                  <div className="bidder-details-list-column">
                    <span className="bidder-details-label-mobile">Financial Bid Amount:</span>
                    <input
                      type="number"
                      value={newBidder.financialBidAmount}
                      onChange={(e) => setNewBidder({ ...newBidder, financialBidAmount: parseFloat(e.target.value) })}
                      className="bidder-details-input"
                      placeholder="Enter Amount"
                    />
                  </div>
                  <div className="bidder-details-list-column">
                    <span className="bidder-details-label-mobile">Ranking:</span>
                    -
                  </div>
                  <div className="bidder-details-list-column">
                    <span className="bidder-details-label-mobile">Percentage above/below tender cost:</span>
                    -
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bidder-details-actions">
            {!(isAdding || isEditing) ? (
              <>
                <button
                  className="bidder-details-btn bidder-details-add-btn"
                  onClick={handleAddToggle}
                >
                  Add Bidder
                </button>
                <button
                  className="bidder-details-btn bidder-details-edit-btn"
                  onClick={handleEditToggle}
                  disabled={bidders.length === 0}
                >
                  Edit
                </button>
              </>
            ) : (
              <>
                <button
                  className="bidder-details-btn bidder-details-save-btn"
                  onClick={isAdding ? handleSaveAdd : handleSaveEdit}
                >
                  Save
                </button>
                <button
                  className="bidder-details-btn bidder-details-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BidderDetails