import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bidderData from '../data/Bidderdata';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import './FormDetails.css';

const capitalizeLabel = (str) => str.replace(/([A-Z])/g, ' $1')
                                     .replace(/^./, (s) => s.toUpperCase());

const FormDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState({});
  const [isNewForm, setIsNewForm] = useState(false);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('customBidderData')) || [];
    const bidder = bidderData.find((b) => b.id === parseInt(id));
    const localBidder = localData.find((b) => b.id === parseInt(id));

    const data = bidder || localBidder;

    if (!data) {
      setIsNewForm(true);
      const initialData = {
        id: parseInt(id),
        uniqueTenderNo: '',
        tenderId: '',
        projectName: '',
        department: '',
        formOfTenderDocumentsFee: 'ONLINE',
        formOfEmd: 'ONLINE',
        emdBgFdrValidityDate: '',
        emdBgFdrStatus: 'Not Returned',
        completionPeriod: '',
        lastDateOfSubmission: '',
        bidOpeningDate: '',
        physicallyNeededDocuments: '',
        pfeplJvShare: '',
        noOfBidsSubmitted: '',
        bidsSubmitted: 'No',
        attachments: [],
        typeOfProject: 'Survey',
        costOfWork: '',
        tenderDocumentsFee: '',
        emdAmount: '',
        emdBgFdrNo: '',
        emdBgFdrIssuedInFavorOf: '',
        emdBgFdrStatusDate: '',
        emdBgFdrDueDate: '',
        preBidMeetingDate: '',
        physicalDocumentSubmissionDueDate: '',
        selfJvType: 'Self',
        bidSubmissionDate: '',
        totalExpensesIncurred: '',
        remarks: '',
        status: 'Bidding Pending',
      };
      setFormData(initialData);
      setOriginalData({ ...initialData });
      setIsEditing(true);
    } else {
      setFormData(data);
      setOriginalData({ ...data });
      setIsNewForm(false);
      const fields = Object.keys(data).filter((key) => key !== 'id');
      const initialSelected = fields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
      setSelectedFields(initialSelected);
    }
  }, [id]);

  const handleInputChange = (e, field) => setFormData({ ...formData, [field]: e.target.value });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setFormData({ ...formData, attachments: [...(formData.attachments || []), ...newFiles] });
  };

  const removeFile = (index) => setFormData({ ...formData, attachments: formData.attachments.filter((_, i) => i !== index) });

  const toggleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (isNewForm) {
      const localData = JSON.parse(localStorage.getItem('customBidderData')) || [];
      localData.push(formData);
      localStorage.setItem('customBidderData', JSON.stringify(localData));
      navigate('/bidders');
    } else {
      setIsEditing(false);
      setOriginalData({ ...formData });
    }
  };

  const handleCancel = () => {
    if (isNewForm) navigate('/bidders');
    else setFormData({ ...originalData }) && setIsEditing(false);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleFieldSelection = (field) => setSelectedFields({ ...selectedFields, [field]: !selectedFields[field] });

  const handleSelectAll = () => {
    const allSelected = Object.keys(selectedFields).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setSelectedFields(allSelected);
  };

  const handleDownload = () => {
    const dateFields = [
      'emdBgFdrDueDate',
      'emdBgFdrValidityDate',
      'bidOpeningDate',
      'physicalDocumentSubmissionDueDate',
      'bidSubmissionDate',
      'preBidMeetingDate',
      'emdBgFdrStatusDate',
      'lastDateOfSubmission'
    ];

    const selectedData = Object.keys(selectedFields)
      .filter((field) => selectedFields[field])
      .map((field) => {
        let value = formData[field] || '';
        if (dateFields.includes(field) && value) {
          if (field === 'lastDateOfSubmission') {
            value = new Date(value).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
          } else {
            value = new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
          }
        } else if (field === 'attachments') {
          value = formData[field]?.map((file) => file.name).join('; ') || '';
        }
        return { Field: capitalizeLabel(field), Value: value };
      });

    const csvContent = [
      selectedData.map((item) => `"${item.Field}"`).join(','),
      selectedData.map((item) => `"${item.Value}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tender_${id}_details.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toggleModal();
  };

  if (!formData) return <div>Loading...</div>;

  // Split fields into Bidder and Project
  const bidderFields = ['uniqueTenderNo','tenderId','projectName','department','formOfTenderDocumentsFee','formOfEmd','emdBgFdrValidityDate','emdBgFdrStatus','completionPeriod','lastDateOfSubmission','bidOpeningDate','physicallyNeededDocuments','pfeplJvShare','noOfBidsSubmitted','bidsSubmitted','attachments'];
  const projectFields = ['typeOfProject','costOfWork','tenderDocumentsFee','emdAmount','emdBgFdrNo','emdBgFdrIssuedInFavorOf','emdBgFdrStatusDate','emdBgFdrDueDate','preBidMeetingDate','physicalDocumentSubmissionDueDate','selfJvType','bidSubmissionDate','totalExpensesIncurred','remarks','status'];

  const renderField = (field) => {
    const value = formData[field] || '';
    const label = capitalizeLabel(field);

    if (field === 'formOfTenderDocumentsFee') {
      return (
        <select value={value} onChange={(e) => handleInputChange(e, field)}>
          <option value="ONLINE">ONLINE</option>
          <option value="RTGS">RTGS</option>
          <option value="DD">DD</option>
          <option value="CASH">CASH</option>
        </select>
      );
    }

    if (field === 'formOfEmd') {
      return (
        <select value={value} onChange={(e) => handleInputChange(e, field)}>
          <option value="BG">BG</option>
          <option value="FDR">FDR</option>
          <option value="ONLINE">ONLINE</option>
          <option value="EBG">EBG</option>
        </select>
      );
    }

    if (field === 'bidsSubmitted') {
      return (
        <select value={value} onChange={(e) => handleInputChange(e, field)}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      );
    }

    if (field === 'selfJvType') {
      return (
        <select value={value} onChange={(e) => handleInputChange(e, field)}>
          <option value="Self">Self</option>
          <option value="JV">JV</option>
        </select>
      );
    }

    if (field === 'status') {
      return (
        <select
          value={value}
          onChange={(e) => handleInputChange(e, field)}
          className={`form-details-status-${value.toLowerCase().replace(' ', '-')}`}
        >
          <option value="Live">Live</option>
          <option value="Bidding Pending">Bidding Pending</option>
          <option value="Bidded">Bidded</option>
          <option value="Awarded">Awarded</option>
        </select>
      );
    }

    if (field === 'attachments') {
      return (
        <div className="form-details-file-upload">
          <input type="file" multiple onChange={handleFileChange} />
          <div className="form-details-file-previews">
            {formData.attachments?.map((file, index) => (
              <div key={index} className="form-details-file-preview">
                {file.type.startsWith('image/') ? <img src={file.url} alt={file.name} /> :
                  <div className="form-details-file-icon">
                    <FontAwesomeIcon icon={faFileExcel} />
                    <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                  </div>}
                <button onClick={() => removeFile(index)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (field.toLowerCase().includes('date')) {
      return <input type="date" value={value} onChange={(e) => handleInputChange(e, field)} />;
    }

    if (field.toLowerCase().includes('time') || field.toLowerCase().includes('submission')) {
      return <input type="datetime-local" value={value} onChange={(e) => handleInputChange(e, field)} />;
    }

    return <input type="text" value={value} onChange={(e) => handleInputChange(e, field)} />;
  };

  return (
    <div className="form-details-page">
      <Sidebar />
      <div className="form-details-main">
        <div className="form-details-content">
          <h1>Combined Tender Form</h1>
          <div className="form-details-container">
            <div className="form-details-column">
              <h3>Bidder Details</h3>
              {bidderFields.map(field => (
                <div key={field} className="form-details-field">
                  <label>{capitalizeLabel(field)}</label>
                  {isEditing ? renderField(field) : <div className="form-details-data-box">{formData[field] || '-'}</div>}
                </div>
              ))}
            </div>
            <div className="form-details-column">
              <h3>Project Details</h3>
              {projectFields.map(field => (
                <div key={field} className="form-details-field">
                  <label>{capitalizeLabel(field)}</label>
                  {isEditing ? renderField(field) : <div className="form-details-data-box">{formData[field] || '-'}</div>}
                </div>
              ))}
            </div>
          </div>

          {isModalOpen && (
            <div className="form-details-modal">
              <div className="form-details-modal-content">
                <h2>Select Fields to Download</h2>
                <button onClick={handleSelectAll}>Select All</button>
                {Object.keys(selectedFields).map(field => (
                  <div key={field}>
                    <input type="checkbox" checked={selectedFields[field]} onChange={() => handleFieldSelection(field)} />
                    <label>{capitalizeLabel(field)}</label>
                  </div>
                ))}
                <div>
                  <button onClick={handleDownload}>Download</button>
                  <button onClick={toggleModal}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="form-details-actions">
            {isEditing ? (
              <>
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={toggleEdit}>Edit</button>
                <button onClick={toggleModal}>Download</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormDetails;
