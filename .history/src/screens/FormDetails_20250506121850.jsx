import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import bidderData from '../data/Bidderdata'
import './FormDetails.css'

const FormDetails = () => {
  const { id } = useParams()
  const [formData, setFormData] = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFields, setSelectedFields] = useState({})

  useEffect(() => {
    const data = bidderData.find((bidder) => bidder.id === parseInt(id))
    if (data) {
      setFormData(data)
      setOriginalData({ ...data })
      // Initialize selectedFields for download modal
      const fields = Object.keys(data).filter((key) => key !== 'id')
      const initialSelected = fields.reduce((acc, field) => {
        acc[field] = true
        return acc
      }, {})
      setSelectedFields(initialSelected)
    }
  }, [id])

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const newFiles = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }))
    setFormData({ ...formData, attachments: [...(formData.attachments || []), ...newFiles] })
  }

  const removeFile = (index) => {
    const updatedAttachments = formData.attachments.filter((_, i) => i !== index)
    setFormData({ ...formData, attachments: updatedAttachments })
  }

  const toggleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    setOriginalData({ ...formData })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({ ...originalData })
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleFieldSelection = (field) => {
    setSelectedFields({ ...selectedFields, [field]: !selectedFields[field] })
  }

  const handleSelectAll = () => {
    const allSelected = Object.keys(selectedFields).reduce((acc, field) => {
      acc[field] = true
      return acc
    }, {})
    setSelectedFields(allSelected)
  }

  const handleDownload = () => {
    const selectedData = Object.keys(selectedFields)
      .filter((field) => selectedFields[field])
      .map((field) => ({
        Field: field,
        Value: formData[field] || '',
      }))

    const csvContent = [
      selectedData.map((item) => `"${item.Field}"`).join(','),
      selectedData.map((item) => `"${item.Value}"`).join(','),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `bidder_${id}_details.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toggleModal()
  }

  if (!formData) return <div>Loading...</div>

  return (
    <div className="form-details-page">
      <h1>Form Details</h1>
      <div className="form-details-actions">
        {isEditing ? (
          <>
            <button className="form-details-btn form-details-save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="form-details-btn form-details-cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <button className="form-details-btn form-details-edit-btn" onClick={toggleEdit}>
            Edit
          </button>
        )}
        <button className="form-details-btn form-details-download-btn" onClick={toggleModal}>
          Download
        </button>
      </div>
      <div className="form-details-container">
        {/* First Column */}
        <div className="form-details-column">
          <div className="form-details-field">
            <label>Unique Tender No</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.uniqueTenderNo || ''}
                onChange={(e) => handleInputChange(e, 'uniqueTenderNo')}
              />
            ) : (
              <span>{formData.uniqueTenderNo}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Tender ID</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.tenderId || ''}
                onChange={(e) => handleInputChange(e, 'tenderId')}
              />
            ) : (
              <span>{formData.tenderId}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Project Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.projectName || ''}
                onChange={(e) => handleInputChange(e, 'projectName')}
              />
            ) : (
              <span>{formData.projectName}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Department/Authority</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.department || ''}
                onChange={(e) => handleInputChange(e, 'department')}
              />
            ) : (
              <span>{formData.department}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Form of Tender Documents Fee</label>
            {isEditing ? (
              <select
                value={formData.formOfTenderDocumentsFee || ''}
                onChange={(e) => handleInputChange(e, 'formOfTenderDocumentsFee')}
              >
                <option value="ONLINE">ONLINE</option>
                <option value="RTGS">RTGS</option>
                <option value="DD">DD</option>
                <option value="CASH">CASH</option>
              </select>
            ) : (
              <span>{formData.formOfTenderDocumentsFee}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Form of EMD</label>
            {isEditing ? (
              <select
                value={formData.formOfEmd || ''}
                onChange={(e) => handleInputChange(e, 'formOfEmd')}
              >
                <option value="BG">BG</option>
                <option value="FDR">FDR</option>
                <option value="ONLINE">ONLINE</option>
                <option value="EBG">EBG</option>
              </select>
            ) : (
              <span>{formData.formOfEmd}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>EMD BG/FDR Validity Date</label>
            {isEditing ? (
              <input
                type="date"
                value={formData.emdBgFdrValidityDate || ''}
                onChange={(e) => handleInputChange(e, 'emdBgFdrValidityDate')}
              />
            ) : (
              <span>{formData.emdBgFdrValidityDate}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>EMD BG/FDR Status</label>
            {isEditing ? (
              <select
                value={formData.emdBgFdrStatus || ''}
                onChange={(e) => handleInputChange(e, 'emdBgFdrStatus')}
              >
                <option value="Returned">Returned</option>
                <option value="Not Returned">Not Returned</option>
              </select>
            ) : (
              <span>{formData.emdBgFdrStatus}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Completion Period</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.completionPeriod || ''}
                onChange={(e) => handleInputChange(e, 'completionPeriod')}
              />
            ) : (
              <span>{formData.completionPeriod}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Last Date of Submission</label>
            {isEditing ? (
              <input
                type="datetime-local"
                value={formData.lastDateOfSubmission || ''}
                onChange={(e) => handleInputChange(e, 'lastDateOfSubmission')}
              />
            ) : (
              <span>{formData.lastDateOfSubmission}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Bid Opening Date</label>
            {isEditing ? (
              <input
                type="date"
                value={formData.bidOpeningDate || ''}
                onChange={(e) => handleInputChange(e, 'bidOpeningDate')}
              />
            ) : (
              <span>{formData.bidOpeningDate}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Physically Needed Documents</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.physicallyNeededDocuments || ''}
                onChange={(e) => handleInputChange(e, 'physicallyNeededDocuments')}
              />
            ) : (
              <span>{formData.physicallyNeededDocuments}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>PFEPL JV Share</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.pfeplJvShare || ''}
                onChange={(e) => handleInputChange(e, 'pfeplJvShare')}
              />
            ) : (
              <span>{formData.pfeplJvShare}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>No. of Bids Submitted</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.noOfBidsSubmitted || ''}
                onChange={(e) => handleInputChange(e, 'noOfBidsSubmitted')}
              />
            ) : (
              <span>{formData.noOfBidsSubmitted}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Bids Submitted</label>
            {isEditing ? (
              <select
                value={formData.bidsSubmitted || ''}
                onChange={(e) => handleInputChange(e, 'bidsSubmitted')}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            ) : (
              <span>{formData.bidsSubmitted}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Attachments</label>
            {isEditing ? (
              <div className="form-details-file-upload">
                <input type="file" multiple onChange={handleFileChange} />
                <div className="form-details-file-previews">
                  {formData.attachments?.map((file, index) => (
                    <div key={index} className="form-details-file-preview">
                      {file.type.startsWith('image/') ? (
                        <img src={file.url} alt={file.name} />
                      ) : (
                        <span>{file.name}</span>
                      )}
                      <button onClick={() => removeFile(index)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="form-details-file-previews">
                {formData.attachments?.length > 0 ? (
                  formData.attachments.map((file, index) => (
                    <div key={index} className="form-details-file-preview">
                      {file.type.startsWith('image/') ? (
                        <img src={file.url} alt={file.name} />
                      ) : (
                        <span>{file.name}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <span>No attachments</span>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Second Column */}
        <div className="form-details-column">
          <div className="form-details-field">
            <label>Type of Project</label>
            {isEditing ? (
              <select
                value={formData.typeOfProject || ''}
                onChange={(e) => handleInputChange(e, 'typeOfProject')}
              >
                <option value="Civil">Civil</option>
                <option value="Survey">Survey</option>
              </select>
            ) : (
              <span>{formData.typeOfProject}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Cost of Work acc. to Tender</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.costOfWork || ''}
                onChange={(e) => handleInputChange(e, 'costOfWork')}
              />
            ) : (
              <span>{formData.costOfWork}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Tender Document Fee</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.tenderDocumentsFee || ''}
                onChange={(e) => handleInputChange(e, 'tenderDocumentsFee')}
              />
            ) : (
              <span>{formData.tenderDocumentsFee}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>EMD Amount</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.emdAmount || ''}
                onChange={(e) => handleInputChange(e, 'emdAmount')}
              />
            ) : (
              <span>{formData.emdAmount}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>EMD BG/FDR No</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.emdBgFdrNo || ''}
                onChange={(e) => handleInputChange(e, 'emdBgFdrNo')}
              />
            ) : (
              <span>{formData.emdBgFdrNo}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>EMD BG/FDR Issued in Favor of</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.emdBgFdrIssuedInFavorOf || ''}
                onChange={(e) => handleInputChange(e, 'emdBgFdrIssuedInFavorOf')}
              />
            ) : (
              <span>{formData.emdBgFdrIssuedInFavorOf}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>EMD BG/FDR Status Date</label>
            {isEditing ? (
              <input
                type="date"
                value={formData.emdBgFdrStatusDate || ''}
                onChange={(e) => handleInputChange(e, 'emdBgFdrStatusDate')}
              />
            ) : (
              <span>{formData.emdBgFdrStatusDate}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>EMD BG/FDR Due Date</label>
            {isEditing ? (
              <input
                type="date"
                value={formData.emdBgFdrDueDate || ''}
                onChange={(e) => handleInputChange(e, 'emdBgFdrDueDate')}
              />
            ) : (
              <span>{formData.emdBgFdrDueDate}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Pre Bid Meeting Date</label>
            {isEditing ? (
              <input
                type="date"
                value={formData.preBidMeetingDate || ''}
                onChange={(e) => handleInputChange(e, 'preBidMeetingDate')}
              />
            ) : (
              <span>{formData.preBidMeetingDate}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Physical Document Submission Due Date</label>
            {isEditing ? (
              <input
                type="date"
                value={formData.physicalDocumentSubmissionDueDate || ''}
                onChange={(e) => handleInputChange(e, 'physicalDocumentSubmissionDueDate')}
              />
            ) : (
              <span>{formData.physicalDocumentSubmissionDueDate}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Self/JV Type</label>
            {isEditing ? (
              <select
                value={formData.selfJvType || ''}
                onChange={(e) => handleInputChange(e, 'selfJvType')}
              >
                <option value="Self">Self</option>
                <option value="JV">JV</option>
              </select>
            ) : (
              <span>{formData.selfJvType}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Bid Submission Date</label>
            {isEditing ? (
              <input
                type="date"
                value={formData.bidSubmissionDate || ''}
                onChange={(e) => handleInputChange(e, 'bidSubmissionDate')}
              />
            ) : (
              <span>{formData.bidSubmissionDate}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Total Expenses Incurred Against Bid</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.totalExpensesIncurred || ''}
                onChange={(e) => handleInputChange(e, 'totalExpensesIncurred')}
              />
            ) : (
              <span>{formData.totalExpensesIncurred}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Remarks</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.remarks || ''}
                onChange={(e) => handleInputChange(e, 'remarks')}
              />
            ) : (
              <span>{formData.remarks}</span>
            )}
          </div>
          <div className="form-details-field">
            <label>Status</label>
            {isEditing ? (
              <select
                value={formData.status || ''}
                onChange={(e) => handleInputChange(e, 'status')}
                className={`form-details-status-${formData.status.toLowerCase().replace(' ', '-')}`}
              >
                <option value="Live">Live</option>
                <option value="Bidding Pending">Bidding Pending</option>
                <option value="Bidded">Bidded</option>
                <option value="Awarded">Awarded</option>
              </select>
            ) : (
              <span className={`form-details-status-${formData.status.toLowerCase().replace(' ', '-')}`}>
                {formData.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Download Modal */}
      {isModalOpen && (
        <div className="form-details-modal">
          <div className="form-details-modal-content">
            <h2>Select Fields to Download</h2>
            <button className="form-details-select-all-btn" onClick={handleSelectAll}>
              Select All
            </button>
            <div className="form-details-modal-fields">
              {Object.keys(selectedFields).map((field) => (
                <div key={field} className="form-details-modal-field">
                  <input
                    type="checkbox"
                    checked={selectedFields[field]}
                    onChange={() => handleFieldSelection(field)}
                  />
                  <label>{field}</label>
                </div>
              ))}
            </div>
            <div className="form-details-modal-actions">
              <button className="form-details-btn form-details-download-confirm-btn" onClick={handleDownload}>
                Download
              </button>
              <button className="form-details-btn form-details-cancel-btn" onClick={toggleModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormDetails