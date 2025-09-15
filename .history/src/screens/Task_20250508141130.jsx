import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Task.css';

const Task = () => {
  const [bidderFormIds, setBidderFormIds] = useState([]);
  const [projectFormIds, setProjectFormIds] = useState([]);
  const [storageData, setStorageData] = useState({ bidders: [], milestones: [], projects: [] });
  const [expandedFormId, setExpandedFormId] = useState(null);
  const [expandedFormSource, setExpandedFormSource] = useState(null); // Track whether the expanded form is from 'bidder' or 'project'

  useEffect(() => {
    // Load data from localStorage
    const bidders = JSON.parse(localStorage.getItem('customBidderData')) || [];
    const milestones = JSON.parse(localStorage.getItem('customMilestoneData')) || [];
    const projects = JSON.parse(localStorage.getItem('customProjectData')) || [];
    setStorageData({ bidders, milestones, projects });

    // Get unique Form IDs for bidders
    const bidderIds = [
      ...new Set([
        ...bidders.map(entry => entry.id),
        ...milestones.map(entry => entry.id)
      ])
    ].sort((a, b) => a - b);
    setBidderFormIds(bidderIds);

    // Get unique Form IDs for projects
    const projectIds = [...new Set(projects.map(entry => entry.id))].sort((a, b) => a - b);
    setProjectFormIds(projectIds);
  }, []);

  const handleDeleteEntireHistory = () => {
    localStorage.clear();
    setStorageData({ bidders: [], milestones: [], projects: [] });
    setBidderFormIds([]);
    setProjectFormIds([]);
    setExpandedFormId(null);
    setExpandedFormSource(null);
  };

  const handleDeleteForm = (id, source) => {
    if (source === 'bidder') {
      const updatedBidders = storageData.bidders.filter(entry => entry.id !== id);
      const updatedMilestones = storageData.milestones.filter(entry => entry.id !== id);
      localStorage.setItem('customBidderData', JSON.stringify(updatedBidders));
      localStorage.setItem('customMilestoneData', JSON.stringify(updatedMilestones));
      setStorageData(prev => ({
        ...prev,
        bidders: updatedBidders,
        milestones: updatedMilestones
      }));
      setBidderFormIds(prev => prev.filter(formId => formId !== id));
    } else if (source === 'project') {
      const updatedProjects = storageData.projects.filter(entry => entry.id !== id);
      localStorage.setItem('customProjectData', JSON.stringify(updatedProjects));
      setStorageData(prev => ({
        ...prev,
        projects: updatedProjects
      }));
      setProjectFormIds(prev => prev.filter(formId => formId !== id));
    }

    if (expandedFormId === id && expandedFormSource === source) {
      setExpandedFormId(null);
      setExpandedFormSource(null);
    }
  };

  const toggleViewForm = (id, source) => {
    if (expandedFormId === id && expandedFormSource === source) {
      setExpandedFormId(null);
      setExpandedFormSource(null);
    } else {
      setExpandedFormId(id);
      setExpandedFormSource(source);
    }
  };

  const formatField = (field, value) => {
    if (!value) return '-';
    const dateFields = [
      'emdBgFdrDueDate',
      'emdBgFdrValidityDate',
      'bidOpeningDate',
      'physicalDocumentSubmissionDueDate',
      'bidSubmissionDate',
      'preBidMeetingDate',
      'emdBgFdrStatusDate',
      'lastDateOfSubmission',
      'technicalOpeningDate',
      'financialOpeningDate',
      'date'
    ];
    if (dateFields.includes(field) && value) {
      const date = new Date(value);
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    } else if (field === 'attachments' || field === 'notesAttachments') {
      return value.map(file => file.name).join('; ') || '-';
    } else if (field === 'bidders') {
      return value.length > 0 ? (
        <ul>
          {value.map((bidder, index) => (
            <li key={index}>
              {bidder.bidderName} (Amount: {bidder.financialBidAmount.toLocaleString('en-IN')})
            </li>
          ))}
        </ul>
      ) : '-';
    } else if (field === 'extensionDates') {
      return value.length > 0 ? (
        <ul>
          {value.map((ext, index) => (
            <li key={index}>
              {ext.extensionNo ? `Extension ${ext.extensionNo}` : `Extension ${index + 1}`}: 
              {ext.date ? formatField('date', ext.date) : 'No date available'}
              {Object.keys(ext).filter(key => !['extensionNo', 'date'].includes(key)).length > 0 && (
                <ul>
                  {Object.entries(ext)
                    .filter(([key]) => !['extensionNo', 'date'].includes(key))
                    .map(([key, val]) => (
                      <li key={key}>
                        {key}: {formatField(key, val)}
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : '-';
    } else if (field === 'milestones') {
      return value.length > 0 ? (
        <ul>
          {value.map((milestone, index) => (
            <li key={index}>
              {milestone.task}: {milestone.completed ? 'Completed' : 'Not Completed'}
            </li>
          ))}
        </ul>
      ) : '-';
    } else if (field === 'dates') {
      return value.length > 0 ? (
        <ul>
          {value.map((date, index) => (
            <li key={index}>
              {formatField('date', date)}
            </li>
          ))}
        </ul>
      ) : '-';
    } else if (field === 'account') {
      return Object.keys(value).length > 0 ? (
        <ul>
          {Object.entries(value).map(([key, val]) => (
            <li key={key}>
              {key}: {val.toString()}
            </li>
          ))}
        </ul>
      ) : '-';
    } else if (field === 'expenses' || field === 'variations') {
      return value.length > 0 ? (
        <ul>
          {value.map((item, index) => (
            <li key={index}>
              {Object.entries(item).map(([key, val]) => (
                <span key={key}>
                  {key}: {val.toString()}{', '}
                </span>
              ))}
            </li>
          ))}
        </ul>
      ) : '-';
    }
    return value.toString();
  };

  const getFormData = (id, source) => {
    if (source === 'bidder') {
      const bidderEntry = storageData.bidders.find(entry => entry.id === id) || {};
      const milestoneEntry = storageData.milestones.find(entry => entry.id === id) || { milestones: [] };

      const formDetailsFields = {};
      const bidderDetailsFields = {};
      const bidderDetailsSpecificFields = ['bidders', 'technicalOpeningDate', 'financialOpeningDate'];

      Object.entries(bidderEntry).forEach(([key, value]) => {
        if (key === 'id' || key === 'extensionDates') return;
        if (bidderDetailsSpecificFields.includes(key)) {
          bidderDetailsFields[key] = value;
        } else {
          formDetailsFields[key] = value;
        }
      });

      return [
        { title: 'Form Details', data: formDetailsFields, hasData: Object.keys(formDetailsFields).length > 0 },
        { title: 'Bidder Details', data: bidderDetailsFields, hasData: Object.keys(bidderDetailsFields).length > 0 },
        { title: 'Extension Dates', data: { extensionDates: bidderEntry.extensionDates || [] }, hasData: bidderEntry.extensionDates?.length > 0 },
        { title: 'Milestones', data: { milestones: milestoneEntry.milestones }, hasData: milestoneEntry.milestones?.length > 0 }
      ];
    } else if (source === 'project') {
      const projectEntry = storageData.projects.find(entry => entry.id === id) || {};

      const projectDetailsFields = {};
      const projectDetailsSpecificFields = ['notes', 'notesAttachments', 'dates', 'account', 'expenses', 'variations'];

      const formsFields = projectEntry.forms || {};
      Object.entries(projectEntry).forEach(([key, value]) => {
        if (key === 'id' || key === 'forms') return;
        if (projectDetailsSpecificFields.includes(key)) {
          projectDetailsFields[key] = value;
        }
      });

      return [
        { title: 'Project Forms', data: formsFields, hasData: Object.keys(formsFields).length > 0 },
        { title: 'Project Details', data: projectDetailsFields, hasData: Object.keys(projectDetailsFields).length > 0 }
      ];
    }
    return [];
  };

  return (
    <div className="task-page">
      <Sidebar />
      <div className="task-main">
        <div className="task-content">
          <h1>Task Summary</h1>
          <div className="task-actions">
            <button className="task-btn task-clear-btn" onClick={handleDeleteEntireHistory}>
              Delete Entire Local History
            </button>
          </div>

          {/* Bidder Data Updates Section */}
          <div className="task-section">
            <h2>Bidder Data Updates</h2>
            {bidderFormIds.length === 0 ? (
              <div className="task-empty">No bidder data stored in local storage.</div>
            ) : (
              <div className="task-cards">
                {bidderFormIds.map((formId) => (
                  <div key={`bidder-${formId}`} className="task-card-wrapper">
                    <div className="task-card">
                      <div className="task-card-header">
                        <span>Form ID: {formId}</span>
                        <div className="task-card-actions">
                          <button
                            className="task-icon-btn task-view-btn"
                            onClick={() => toggleViewForm(formId, 'bidder')}
                            title="View"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            className="task-icon-btn task-delete-btn"
                            onClick={() => handleDeleteForm(formId, 'bidder')}
                            title="Delete"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                      {expandedFormId === formId && expandedFormSource === 'bidder' && (
                        <div className="task-card-details">
                          <h3>Form Details</h3>
                          {getFormData(formId, 'bidder').map((group, index) => (
                            group.hasData && (
                              <div key={group.title} className="task-data-group">
                                {index > 0 && group.hasData && (
                                  <div className="task-data-divider">
                                    <span>{group.title}</span>
                                  </div>
                                )}
                                <div className="task-list-container">
                                  {index === 0 && (
                                    <div className="task-list-header">
                                      <div className="task-list-column">Field</div>
                                      <div className="task-list-column">Value</div>
                                    </div>
                                  )}
                                  <div className="task-list">
                                    {Object.entries(group.data).map(([field, value]) => (
                                      <div key={field} className="task-detail-row">
                                        <div className="task-list-column">
                                          <span className="task-label-mobile">Field:</span>
                                          {field}
                                        </div>
                                        <div className="task-list-column">
                                          <span className="task-label-mobile">Value:</span>
                                          {formatField(field, value)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Data Updates Section */}
          <div className="task-section">
            <h2>Project Data Updates</h2>
            {projectFormIds.length === 0 ? (
              <div className="task-empty">No project data stored in local storage.</div>
            ) : (
              <div className="task-cards">
                {projectFormIds.map((formId) => (
                  <div key={`project-${formId}`} className="task-card-wrapper">
                    <div className="task-card">
                      <div className="task-card-header">
                        <span>Form ID: {formId}</span>
                        <div className="task-card-actions">
                          <button
                            className="task-icon-btn task-view-btn"
                            onClick={() => toggleViewForm(formId, 'project')}
                            title="View"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            className="task-icon-btn task-delete-btn"
                            onClick={() => handleDeleteForm(formId, 'project')}
                            title="Delete"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                      {expandedFormId === formId && expandedFormSource === 'project' && (
                        <div className="task-card-details">
                          <h3>Form Details</h3>
                          {getFormData(formId, 'project').map((group, index) => (
                            group.hasData && (
                              <div key={group.title} className="task-data-group">
                                {index > 0 && group.hasData && (
                                  <div className="task-data-divider">
                                    <span>{group.title}</span>
                                  </div>
                                )}
                                <div className="task-list-container">
                                  {index === 0 && (
                                    <div className="task-list-header">
                                      <div className="task-list-column">Field</div>
                                      <div className="task-list-column">Value</div>
                                    </div>
                                  )}
                                  <div className="task-list">
                                    {Object.entries(group.data).map(([field, value]) => (
                                      <div key={field} className="task-detail-row">
                                        <div className="task-list-column">
                                          <span className="task-label-mobile">Field:</span>
                                          {field}
                                        </div>
                                        <div className="task-list-column">
                                          <span className="task-label-mobile">Value:</span>
                                          {formatField(field, value)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;