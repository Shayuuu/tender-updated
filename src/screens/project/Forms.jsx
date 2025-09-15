import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import projectData from '../../data/Projectdata'
import Sidebar from '../Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'
import './Forms.css'

const Forms = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFields, setSelectedFields] = useState({})
  const [isNewForm, setIsNewForm] = useState(false)

  useEffect(() => {
    // Load data from projectData or localStorage
    const localData = JSON.parse(localStorage.getItem('customProjectData')) || []
    const project = projectData.find((p) => p.id === parseInt(id))
    const localProject = localData.find((p) => p.id === parseInt(id))

    let data = project?.forms || localProject?.forms

    if (!data) {
      // If no data found, this is a new form
      setIsNewForm(true)
      const initialData = {
        id: parseInt(id),
        projectNo: '',
        dateOfLoa: '',
        additionalSecurityDeposit: '',
        asdActualReturnDate: '',
        asdPlannedReturnDate: '',
        psdBgFdrActualDate: '',
        asdBgFdrNo: '',
        nameOfWork: '',
        dateOfWorkOrder: '',
        formOfAsd: 'BG',
        asdBgFdrValidity: '',
        asdBgFdrStatus: 'Not Returned',
        performanceSecurityDeposit: '',
        psdBgFdrNo: '',
        asdBgFdrIssuedInFavorOf: '',
        psdBgFdrReturnDate: '',
        formOfPsd: 'BG',
        psdBgFdrValidity: '',
        psdBgFdrStatus: 'Not Returned',
        startingDate: '',
        completionDate: '',
        workOrderValue: '',
        psdBgFdrIssuedInFavorOf: '',
        durationOfProject: '',
        actualDateOfCompletion: '',
        dateOfAmendment: '',
        dlpEndDate: '',
        remarks: '',
        workCompletionCertificateTaken: 'No',
        revisedWorkOrder: '',
        defectsLiabilityPeriod: '',
        attachments: []
      }
      setFormData(initialData)
      setOriginalData({ ...initialData })
      setIsEditing(true) // New form is editable by default
    } else {
      setFormData(data)
      setOriginalData({ ...data })
      setIsNewForm(false)
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
    if (isNewForm) {
      // Save to localStorage
      const localData = JSON.parse(localStorage.getItem('customProjectData')) || []
      const newProject = {
        id: parseInt(id),
        forms: formData,
        dates: {},
        account: {},
        expenses: [],
        variations: [],
        notes: ""
      }
      localData.push(newProject)
      localStorage.setItem('customProjectData', JSON.stringify(localData))
      navigate('/projects')
    } else {
      setIsEditing(false)
      setOriginalData({ ...formData })
    }
  }

  const handleCancel = () => {
    if (isNewForm) {
      navigate('/projects')
    } else {
      setIsEditing(false)
      setFormData({ ...originalData })
    }
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
    const dateFields = [
      'dateOfLoa',
      'asdActualReturnDate',
      'asdPlannedReturnDate',
      'psdBgFdrActualDate',
      'dateOfWorkOrder',
      'asdBgFdrValidity',
      'psdBgFdrReturnDate',
      'psdBgFdrValidity',
      'startingDate',
      'completionDate',
      'actualDateOfCompletion',
      'dateOfAmendment',
      'dlpEndDate'
    ]

    const selectedData = Object.keys(selectedFields)
      .filter((field) => selectedFields[field])
      .map((field) => {
        let value = formData[field] || ''
        if (dateFields.includes(field) && value) {
          value = new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        } else if (field === 'attachments') {
          value = formData[field]?.map((file) => file.name).join('; ') || ''
        }
        return {
          Field: field,
          Value: value
        }
      })

    const csvContent = [
      selectedData.map((item) => `"${item.Field}"`).join(','),
      selectedData.map((item) => `"${item.Value}"`).join(',')
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `project_${id}_details.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toggleModal()
  }

  if (!formData && !isNewForm) {
    return (
      <div className="form-details-page">
        <Sidebar />
        <div className="form-details-main">
          <div className="form-details-content">
            <h1>Project Details</h1>
            <div className="form-details-coming-soon">
              Coming Soon: Detailed information for this project is not yet available.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="form-details-page">
      <Sidebar />
      <div className="form-details-main">
        <div className="form-details-content">
          <h1>Project Details</h1>

          <div className="form-details-container">
            <div className="form-details-column">
              <div className="form-details-field">
                <label>Sr No / Unique Project No (PFEPL Internal)</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.projectNo || ''}
                    onChange={(e) => handleInputChange(e, 'projectNo')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.projectNo || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Date Of LOA / LOI</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dateOfLoa || ''}
                    onChange={(e) => handleInputChange(e, 'dateOfLoa')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.dateOfLoa || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Additional Security Deposit (ASD)</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.additionalSecurityDeposit || ''}
                    onChange={(e) => handleInputChange(e, 'additionalSecurityDeposit')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.additionalSecurityDeposit || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>ASD Actual Return Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.asdActualReturnDate || ''}
                    onChange={(e) => handleInputChange(e, 'asdActualReturnDate')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.asdActualReturnDate || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>ASD Planned Return Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.asdPlannedReturnDate || ''}
                    onChange={(e) => handleInputChange(e, 'asdPlannedReturnDate')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.asdPlannedReturnDate || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>PSD BG/FDR Actual Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.psdBgFdrActualDate || ''}
                    onChange={(e) => handleInputChange(e, 'psdBgFdrActualDate')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.psdBgFdrActualDate || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>ASD BG/FDR No</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.asdBgFdrNo || ''}
                    onChange={(e) => handleInputChange(e, 'asdBgFdrNo')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.asdBgFdrNo || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Name Of Work</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nameOfWork || ''}
                    onChange={(e) => handleInputChange(e, 'nameOfWork')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.nameOfWork || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Date Of Work Order</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dateOfWorkOrder || ''}
                    onChange={(e) => handleInputChange(e, 'dateOfWorkOrder')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.dateOfWorkOrder || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Form Of ASD</label>
                {isEditing ? (
                  <select
                    value={formData.formOfAsd || ''}
                    onChange={(e) => handleInputChange(e, 'formOfAsd')}
                  >
                    <option value="BG">BG</option>
                    <option value="FDR">FDR</option>
                    <option value="ONLINE">ONLINE</option>
                  </select>
                ) : (
                  <div className="form-details-data-box">{formData.formOfAsd || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>ASD BG/FDR Validity</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.asdBgFdrValidity || ''}
                    onChange={(e) => handleInputChange(e, 'asdBgFdrValidity')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.asdBgFdrValidity || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>ASD BG/FDR Status</label>
                {isEditing ? (
                  <select
                    value={formData.asdBgFdrStatus || ''}
                    onChange={(e) => handleInputChange(e, 'asdBgFdrStatus')}
                  >
                    <option value="Returned">Returned</option>
                    <option value="Not Returned">Not Returned</option>
                  </select>
                ) : (
                  <div className="form-details-data-box">{formData.asdBgFdrStatus || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Performance Security Deposit (PSD)</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.performanceSecurityDeposit || ''}
                    onChange={(e) => handleInputChange(e, 'performanceSecurityDeposit')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.performanceSecurityDeposit || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>PSD BG/FDR No</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.psdBgFdrNo || ''}
                    onChange={(e) => handleInputChange(e, 'psdBgFdrNo')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.psdBgFdrNo || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>ASD BG/FDR Issued In Favor Of</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.asdBgFdrIssuedInFavorOf || ''}
                    onChange={(e) => handleInputChange(e, 'asdBgFdrIssuedInFavorOf')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.asdBgFdrIssuedInFavorOf || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>PSD BG/FDR Return Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.psdBgFdrReturnDate || ''}
                    onChange={(e) => handleInputChange(e, 'psdBgFdrReturnDate')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.psdBgFdrReturnDate || '-'}</div>
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
                            <div className="form-details-file-icon">
                              <FontAwesomeIcon icon={faFileExcel} />
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
                                {file.name}
                              </a>
                            </div>
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
                            <div className="form-details-file-icon">
                              <FontAwesomeIcon icon={faFileExcel} />
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
                                {file.name}
                              </a>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="form-details-data-box">No attachments</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="form-details-column">
              <div className="form-details-field">
                <label>Form Of PSD</label>
                {isEditing ? (
                  <select
                    value={formData.formOfPsd || ''}
                    onChange={(e) => handleInputChange(e, 'formOfPsd')}
                  >
                    <option value="BG">BG</option>
                    <option value="FDR">FDR</option>
                    <option value="ONLINE">ONLINE</option>
                  </select>
                ) : (
                  <div className="form-details-data-box">{formData.formOfPsd || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>PSD BG/FDR Validity</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.psdBgFdrValidity || ''}
                    onChange={(e) => handleInputChange(e, 'psdBgFdrValidity')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.psdBgFdrValidity || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>PSD BG/FDR Status</label>
                {isEditing ? (
                  <select
                    value={formData.psdBgFdrStatus || ''}
                    onChange={(e) => handleInputChange(e, 'psdBgFdrStatus')}
                  >
                    <option value="Returned">Returned</option>
                    <option value="Not Returned">Not Returned</option>
                  </select>
                ) : (
                  <div className="form-details-data-box">{formData.psdBgFdrStatus || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Starting Date Of Project</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.startingDate || ''}
                    onChange={(e) => handleInputChange(e, 'startingDate')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.startingDate || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Completion Date As Per Work Order</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.completionDate || ''}
                    onChange={(e) => handleInputChange(e, 'completionDate')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.completionDate || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Value Of Contract/Work Order</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.workOrderValue || ''}
                    onChange={(e) => handleInputChange(e, 'workOrderValue')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.workOrderValue || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>PSD BG/FDR Issued In Favor Of</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.psdBgFdrIssuedInFavorOf || ''}
                    onChange={(e) => handleInputChange(e, 'psdBgFdrIssuedInFavorOf')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.psdBgFdrIssuedInFavorOf || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Duration Of Project</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.durationOfProject || ''}
                    onChange={(e) => handleInputChange(e, 'durationOfProject')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.durationOfProject || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Actual Date Of Completion</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.actualDateOfCompletion || ''}
                    onChange={(e) => handleInputChange(e, 'actualDateOfCompletion')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.actualDateOfCompletion || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Date Of Amendment</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dateOfAmendment || ''}
                    onChange={(e) => handleInputChange(e, 'dateOfAmendment')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.dateOfAmendment || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>DLP End Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dlpEndDate || ''}
                    onChange={(e) => handleInputChange(e, 'dlpEndDate')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.dlpEndDate || '-'}</div>
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
                  <div className="form-details-data-box">{formData.remarks || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Work Completion Certificate Taken</label>
                {isEditing ? (
                  <select
                    value={formData.workCompletionCertificateTaken || ''}
                    onChange={(e) => handleInputChange(e, 'workCompletionCertificateTaken')}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                ) : (
                  <div className="form-details-data-box">{formData.workCompletionCertificateTaken || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Work Order After Variation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.revisedWorkOrder || ''}
                    onChange={(e) => handleInputChange(e, 'revisedWorkOrder')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.revisedWorkOrder || '-'}</div>
                )}
              </div>
              <div className="form-details-field">
                <label>Defects Liability Period (DLP)</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.defectsLiabilityPeriod || ''}
                    onChange={(e) => handleInputChange(e, 'defectsLiabilityPeriod')}
                  />
                ) : (
                  <div className="form-details-data-box">{formData.defectsLiabilityPeriod || '-'}</div>
                )}
              </div>
            </div>
          </div>

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
              <>
                <button className="form-details-btn form-details-edit-btn" onClick={toggleEdit}>
                  Edit
                </button>
                <button className="form-details-btn form-details-download-btn" onClick={toggleModal}>
                  Download
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forms