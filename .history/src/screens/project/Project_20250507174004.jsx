import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '../Sidebar'
import projectData from '../../data/ProjectData'
import './Project.css'

const Project = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleNewProject = () => {
    // Find the highest ID in projectData and localStorage to generate a new ID
    const localData = JSON.parse(localStorage.getItem('customProjectData')) || [];
    const maxProjectDataId = projectData.length > 0 ? Math.max(...projectData.map(item => item.id)) : 0;
    const maxLocalDataId = localData.length > 0 ? Math.max(...localData.map(item => item.id)) : 0;
    const newId = Math.max(maxProjectDataId, maxLocalDataId) + 1;

    // Navigate to the ProjectForms page with the new ID
    navigate(`/projects/${newId}`);
  }

  // Combine projectData with localStorage data, mapping fields as needed
  const localData = JSON.parse(localStorage.getItem('customProjectData')) || [];
  const mappedLocalData = localData.map(item => ({
    ...item,
    projectNo: item.projectNo || '',
    nameOfWork: item.nameOfWork || '',
    dateOfLoa: item.dateOfLoa || '',
    dateOfWorkOrder: item.dateOfWorkOrder || '',
    startingDate: item.startingDate || '',
    durationOfProject: item.durationOfProject || '',
    completionDate: item.completionDate || '',
    actualDateOfCompletion: item.actualDateOfCompletion || '',
    workOrderValue: item.workOrderValue || '',
    revisedWorkOrder: item.revisedWorkOrder || '',
    remarks: item.remarks || '',
    status: item.status || ''
  }));
  const combinedData = [...projectData, ...mappedLocalData];

  const filteredData = combinedData.filter((item) => (
    item.nameOfWork?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.projectNo?.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const entriesPerPage = 10;
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="project-page">
      <Sidebar />
      <div className="project-main">
        <div className="project-content">
          <div className="controls-bar">
            <div className="search-field">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search Name of Work or Project No."
                className="search-input"
              />
            </div>
            <button className="new-project-btn" onClick={handleNewProject}>
              <FontAwesomeIcon icon={faPlus} className="plus-icon" />
              New Project
            </button>
          </div>
          <div className="project-table">
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
              <div className="table-cell">Project No.</div>
              <div className="table-cell">Name of Work</div>
              <div className="table-cell">Date of LOA/LOI</div>
              <div className="table-cell">Date of Work Order/Contract</div>
              <div className="table-cell">Starting Date</div>
              <div className="table-cell">Duration of Project</div>
              <div className="table-cell">Completion Date as per Contract</div>
              <div className="table-cell">Actual Date of Completion</div>
              <div className="table-cell">Work Order/Value of Contract</div>
              <div className="table-cell">Revised Work Order after Variations</div>
              <div className="table-cell">Remarks</div>
            </div>
            {paginatedData.map((item) => (
              <div
                key={item.id}
                className="table-row"
                onClick={() => navigate(`/projects/${item.id}`)}
              >
                <div className="table-cell">{item.id}</div>
                <div className="table-cell">{item.projectNo || ''}</div>
                <div className="table-cell">{item.nameOfWork || ''}</div>
                <div className="table-cell">{item.dateOfLoa || ''}</div>
                <div className="table-cell">{item.dateOfWorkOrder || ''}</div>
                <div className="table-cell">{item.startingDate || ''}</div>
                <div className="table-cell">{item.durationOfProject || ''}</div>
                <div className="table-cell">{item.completionDate || ''}</div>
                <div className="table-cell">{item.actualDateOfCompletion || ''}</div>
                <div className="table-cell">{item.workOrderValue || ''}</div>
                <div className="table-cell">{item.revisedWorkOrder || ''}</div>
                <div className="table-cell">{item.remarks || ''}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Project