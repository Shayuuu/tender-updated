import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import Sidebar from './Sidebar'
import bidderData from '../data/Bidderdata'
import './Bidders.css'

const Bidders = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleNewForm = () => {
    // Find the highest ID in bidderData and localStorage to generate a new ID
    const localData = JSON.parse(localStorage.getItem('customBidderData')) || [];
    const maxBidderDataId = bidderData.length > 0 ? Math.max(...bidderData.map(item => item.id)) : 0;
    const maxLocalDataId = localData.length > 0 ? Math.max(...localData.map(item => item.id)) : 0;
    const newId = Math.max(maxBidderDataId, maxLocalDataId) + 1;

    // Navigate to the FormDetails page with the new ID
    navigate(`/bidders/${newId}`);
  }

  // Combine bidderData with localStorage data, mapping fields as needed
  const localData = JSON.parse(localStorage.getItem('customBidderData')) || [];
  const mappedLocalData = localData.map(item => ({
    ...item,
    year: '2025', // Set year to 2025 for new entries
    typeOfTender: item.typeOfProject || '', // Map typeOfProject to typeOfTender
    nameOfWork: item.projectName || '', // Map projectName to nameOfWork
    projectValue: item.costOfWork || '', // Map costOfWork to projectValue
    emd: item.emdAmount || '' // Map emdAmount to emd
  }));
  const combinedData = [...bidderData, ...mappedLocalData];

  const filteredData = combinedData.filter((item) => (
    item.nameOfWork?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tenderId?.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const entriesPerPage = 10;
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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
            <button className="new-form-btn" onClick={handleNewForm}>
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
                <div className="table-cell">{item.year || ''}</div>
                <div className="table-cell">{item.status || ''}</div>
                <div className="table-cell">{item.tenderId || ''}</div>
                <div className="table-cell">{item.typeOfTender || ''}</div>
                <div className="table-cell">{item.nameOfWork || ''}</div>
                <div className="table-cell">{item.projectValue || ''}</div>
                <div className="table-cell">{item.tenderDocumentsFee || ''}</div>
                <div className="table-cell">{item.formOfTenderDocumentsFee || ''}</div>
                <div className="table-cell">{item.emd || ''}</div>
                <div className="table-cell">{item.formOfEmd || ''}</div>
                <div className="table-cell">{item.completionPeriod || ''}</div>
                <div className="table-cell">{item.lastDateOfSubmission || ''}</div>
                <div className="table-cell">{item.department || ''}</div>
                <div className="table-cell">{item.remarks || ''}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bidders