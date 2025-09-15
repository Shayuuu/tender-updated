import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import Sidebar from './Sidebar'
import bidderData from '../data/Bidderdata'
import './Bidders.css'

const Bidders = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()
  const modalRef = useRef(null)

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const openModal = () => {
    setFormData({
      year: '',
      status: 'Bidding Pending',
      tenderId: '',
      typeOfTender: 'survey',
      nameOfWork: '',
      projectValue: '',
      tenderDocumentsFee: '',
      formOfTenderDocumentsFee: 'Online',
      emd: '',
      formOfEmd: 'Online',
      completionPeriod: '',
      lastDateOfSubmission: '',
      department: '',
      remarks: ''
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({})
  }

  const handleSave = () => {
    console.log('New Bidder Form Saved:', formData)
    closeModal()
  }

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value })
  }

  const filteredData = bidderData.filter((item) => (
    item.nameOfWork.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tenderId.toLowerCase().includes(searchTerm.toLowerCase())
  ))

  const entriesPerPage = 10
  const totalEntries = filteredData.length
  const totalPages = Math.ceil(totalEntries / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal()
      }
    }
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModalOpen])

  return (
    <div className="bidders-page">
      <Sidebar />
      <div className="bidders-main">
        <div className="bidders-content">
          <div className="controls-bar">
            <div className="search-field">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search Name of Work or Tender ID"
                className="search-input"
              />
            </div>
            <h3 className="title-mid">Bidder Section</h3>
            <button className="new-form-btn" onClick={openModal}>
              <FontAwesomeIcon icon={faPlus} className="plus-icon" />
              New Form
            </button>
          </div>
          <div className="bidders-table">
            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination">
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      className={`page-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="table-header">
              <div className="table-cell">No</div>
              <div className="table-cell">Year</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Tender ID</div>
              <div className="table-cell">Type of Tender</div>
              <div className="table-cell">Name of Work</div>
              <div className="table-cell">Project Value (Cr.)</div>
              <div className="table-cell">Tender Documents Fee</div>
              <div className="table-cell">Form of Tender Fee</div>
              <div className="table-cell">EMD (Cr.)</div>
              <div className="table-cell">Form of EMD</div>
              <div className="table-cell">Completion Period</div>
              <div className="table-cell">Last Date of Submission</div>
              <div className="table-cell">Department</div>
              <div className="table-cell">Remarks</div>
            </div>
            {paginatedData.map((item) => (
              <div
                key={item.id}
                className="table-row"
                onClick={() => navigate(`/bidders/${item.id}`)}
              >
                <div className="table-cell">{item.id}</div>
                <div className="table-cell">{item.year}</div>
                <div className="table-cell">{item.status}</div>
                <div className="table-cell">{item.tenderId}</div>
                <div className="table-cell">{item.typeOfTender}</div>
                <div className="table-cell">{item.nameOfWork}</div>
                <div className="table-cell">{item.projectValue}</div>
                <div className="table-cell">{item.tenderDocumentsFee}</div>
                <div className="table-cell">{item.formOfTenderDocumentsFee}</div>
                <div className="table-cell">{item.emd}</div>
                <div className="table-cell">{item.formOfEmd}</div>
                <div className="table-cell">{item.completionPeriod}</div>
                <div className="table-cell">{item.lastDateOfSubmission}</div>
                <div className="table-cell">{item.department}</div>
                <div className="table-cell">{item.remarks}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            <h2 className="modal-title">New Bidder Form</h2>
            <div className="modal-section">
              <div className="modal-row">
                <div className="modal-field">
                  <label>Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="modal-input"
                  />
                </div>
                <div className="modal-field">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="modal-input"
                  >
                    <option value="Bidding Pending">Bidding Pending</option>
                    <option value="Bidding Completed">Bidding Completed</option>
                  </select>
                </div>
                <div className="modal-field">
                  <label>Tender ID</label>
                  <input
                    type="text"
                    value={formData.tenderId}
                    onChange={(e) => handleInputChange('tenderId', e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label>Type of Tender</label>
                  <select
                    value={formData.typeOfTender}
                    onChange={(e) => handleInputChange('typeOfTender', e.target.value)}
                    className="modal-input"
                  >
                    <option value="survey">Survey</option>
                    <option value="civil">Civil</option>
                  </select>
                </div>
                <div className="modal-field">
                  <label>Name of Work</label>
                  <input
                    type="text"
                    value={formData.nameOfWork}
                    onChange={(e) => handleInputChange('nameOfWork', e.target.value)}
                    className="modal-input"
                  />
                </div>
                <div className="modal-field">
                  <label>Project Value (Cr.)</label>
                  <input
                    type="number"
                    value={formData.projectValue}
                    onChange={(e) => handleInputChange('projectValue', e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label>Tender Documents Fee</label>
                  <input
                    type="number"
                    value={formData.tenderDocumentsFee}
                    onChange={(e) => handleInputChange('tenderDocumentsFee', e.target.value)}
                    className="modal-input"
                  />
                </div>
                <div className="modal-field">
                  <label>Form of Tender Fee</label>
                  <select
                    value={formData.formOfTenderDocumentsFee}
                    onChange={(e) => handleInputChange('formOfTenderDocumentsFee', e.target.value)}
                    className="modal-input"
                  >
                    <option value="Online">Online</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div className="modal-field">
                  <label>EMD (Cr.)</label>
                  <input
                    type="number"
                    value={formData.emd}
                    onChange={(e) => handleInputChange('emd', e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label>Form of EMD</label>
                  <select
                    value={formData.formOfEmd}
                    onChange={(e) => handleInputChange('formOfEmd', e.target.value)}
                    className="modal-input"
                  >
                    <option value="Online">Online</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div className="modal-field">
                  <label>Completion Period</label>
                  <input
                    type="text"
                    value={formData.completionPeriod}
                    onChange={(e) => handleInputChange('completionPeriod', e.target.value)}
                    className="modal-input"
                  />
                </div>
                <div className="modal-field">
                  <label>Last Date of Submission</label>
                  <input
                    type="datetime-local"
                    value={formData.lastDateOfSubmission}
                    onChange={(e) => handleInputChange('lastDateOfSubmission', e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>
              <div className="modal-row">
                <div className="modal-field modal-field-full">
                  <label>Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>
              <div className="modal-row">
                <div className="modal-field modal-field-full">
                  <label>Remarks</label>
                  <input
                    type="text"
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-action-btn modal-save-btn" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bidders