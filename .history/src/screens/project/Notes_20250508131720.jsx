import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import projectData from '../../data/Projectdata';
import Sidebar from '../Sidebar';
import './Notes.css';

const Notes = () => {
  const { id } = useParams();
  const [notesData, setNotesData] = useState('');
  const [notesAttachments, setNotesAttachments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [newAttachments, setNewAttachments] = useState([]);

  useEffect(() => {
    // Load data from projectData or localStorage, prioritizing localData
    const localData = JSON.parse(localStorage.getItem('customProjectData')) || [];
    const localProject = localData.find((p) => p.id === parseInt(id));
    const project = projectData.find((p) => p.id === parseInt(id));

    // Merge projectData with localData
    const mergedData = {
      id: parseInt(id),
      forms: localProject?.forms || project?.forms || {},
      dates: localProject?.dates || project?.dates || [],
      account: localProject?.account || project?.account || {},
      expenses: localProject?.expenses || project?.expenses || [],
      variations: localProject?.variations || project?.variations || [],
      notes: localProject?.notes !== undefined ? localProject.notes : (project?.notes || ""),
      notesAttachments: Array.isArray(localProject?.notesAttachments) ? localProject.notesAttachments : (project?.notesAttachments || [])
    };

    // Initialize notesData and notesAttachments
    setNotesData(mergedData.notes || '');
    setNotesAttachments(mergedData.notesAttachments || []);
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(true);
    setEditedNotes(notesData);
    setNewAttachments([]);
  };

  const handleNotesChange = (e) => {
    setEditedNotes(e.target.value);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type
    }));
    setNewAttachments(prev => [...prev, ...newFiles]);
  };

  const handleRemoveAttachment = (index, isNew = false) => {
    if (isNew) {
      setNewAttachments(prev => prev.filter((_, i) => i !== index));
    } else {
      setNotesAttachments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    // Combine existing and new attachments
    const updatedAttachments = [...notesAttachments, ...newAttachments];

    // Save to localStorage
    const localData = JSON.parse(localStorage.getItem('customProjectData')) || [];
    const projectIndex = localData.findIndex((p) => p.id === parseInt(id));
    const project = projectData.find((p) => p.id === parseInt(id));
    const existingLocalProject = localData[projectIndex] || {};

    const updatedProject = {
      id: parseInt(id),
      forms: existingLocalProject.forms || project?.forms || {},
      dates: existingLocalProject.dates || project?.dates || [],
      account: existingLocalProject.account || project?.account || {},
      expenses: existingLocalProject.expenses || project?.expenses || [],
      variations: existingLocalProject.variations || project?.variations || [],
      notes: editedNotes,
      notesAttachments: updatedAttachments
    };

    if (projectIndex !== -1) {
      localData[projectIndex] = updatedProject;
    } else {
      localData.push(updatedProject);
    }
    localStorage.setItem('customProjectData', JSON.stringify(localData));

    setNotesData(editedNotes);
    setNotesAttachments(updatedAttachments);
    setIsEditing(false);
    setNewAttachments([]);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedNotes('');
    setNewAttachments([]);
  };

  // Determine icon based on file type
  const getFileIconClass = (type) => {
    if (type.includes('pdf')) return 'fas fa-file-pdf';
    if (type.includes('text')) return 'fas fa-file-alt';
    if (type.includes('image')) return 'fas fa-file-image';
    return 'fas fa-file'; // Default icon for other file types
  };

  return (
    <div className="notes-page">
      <Sidebar />
      <div className="notes-main">
        <div className="notes-content">
          <h1>Project Notes</h1>

          {/* Notes Section */}
          <div className="notes-section">
            <div className="notes-container">
              {isEditing ? (
                <textarea
                  value={editedNotes}
                  onChange={handleNotesChange}
                  className="notes-textarea"
                  placeholder="Write your notes here..."
                />
              ) : (
                <div className="notes-display">
                  {notesData ? notesData : "No notes available."}
                </div>
              )}
            </div>
          </div>

          {/* Attachments Section */}
          <div className="notes-attachments-section">
            <h2>Attachments</h2>
            <div className="notes-attachments-container">
              {notesAttachments.length === 0 && newAttachments.length === 0 && !isEditing ? (
                <div className="notes-empty">
                  No attachments available.
                </div>
              ) : (
                <div className="notes-attachments-grid">
                  {notesAttachments.map((attachment, index) => (
                    <div key={`existing-${index}`} className="notes-attachment-card">
                      <div className="notes-attachment-info">
                        <i className={`${getFileIconClass(attachment.type)} notes-attachment-icon`}></i>
                        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="notes-attachment-link">
                          {attachment.name}
                        </a>
                      </div>
                      {isEditing && (
                        <button
                          className="notes-remove-btn"
                          onClick={() => handleRemoveAttachment(index, false)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  {newAttachments.map((attachment, index) => (
                    <div key={`new-${index}`} className="notes-attachment-card">
                      <div className="notes-attachment-info">
                        <i className={`${getFileIconClass(attachment.type)} notes-attachment-icon`}></i>
                        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="notes-attachment-link">
                          {attachment.name}
                        </a>
                      </div>
                      <button
                        className="notes-remove-btn"
                        onClick={() => handleRemoveAttachment(index, true)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {isEditing && (
                <div className="notes-upload-section">
                  <label htmlFor="file-upload" className="notes-upload-label">
                    <i className="fas fa-upload notes-upload-icon"></i> Upload Files
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="notes-upload-input"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="notes-actions">
            {isEditing ? (
              <>
                <button
                  className="notes-btn notes-save-btn"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="notes-btn notes-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="notes-btn notes-edit-btn"
                onClick={handleEditToggle}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;