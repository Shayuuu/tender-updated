import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import projectData from '../../data/Projectdata';
import Sidebar from '../Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faFileExcel,
  faFileWord,
  faFileAlt,
  faFileImage,
  faFile,
  faPlus,
  faTrashAlt,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import './Notes.css';

const Notes = () => {
  const { id } = useParams();
  const [notesData, setNotesData] = useState([]); // Now an array of note objects
  const [notesAttachments, setNotesAttachments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState([]); // Array for editing notes
  const [newAttachments, setNewAttachments] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null); // Track which note is being edited
  const [newNoteContent, setNewNoteContent] = useState(''); // For adding new notes

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

    // Initialize notesData as an array
    // If notes is a string (from previous format), convert it to an array with one note
    let initialNotes = [];
    if (typeof mergedData.notes === 'string' && mergedData.notes.trim() !== '') {
      initialNotes = [{ id: Date.now(), content: mergedData.notes }];
    } else if (Array.isArray(mergedData.notes)) {
      initialNotes = mergedData.notes.map(note => ({
        id: note.id || Date.now(),
        content: note.content || ''
      }));
    }
    setNotesData(initialNotes);
    setNotesAttachments(mergedData.notesAttachments || []);
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(true);
    setEditedNotes([...notesData]); // Create a copy of notes for editing
    setNewAttachments([]);
  };

  const handleNoteChange = (id, value) => {
    setEditedNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, content: value } : note
      )
    );
  };

  const handleAddNote = () => {
    if (newNoteContent.trim() === '') return;
    const newNote = {
      id: Date.now(),
      content: newNoteContent
    };
    setEditedNotes(prev => [...prev, newNote]);
    setNewNoteContent('');
  };

  const handleDeleteNote = (id) => {
    setEditedNotes(prev => prev.filter(note => note.id !== id));
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
      notes: editedNotes, // Save as array of notes
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
    setEditingNoteId(null);
    setNewNoteContent('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedNotes([]);
    setNewAttachments([]);
    setEditingNoteId(null);
    setNewNoteContent('');
  };

  // Determine icon based on file type
  const getFileIcon = (type) => {
    if (type.includes('pdf')) return faFilePdf;
    if (type.includes('excel') || type.includes('spreadsheetml')) return faFileExcel;
    if (type.includes('word') || type.includes('wordprocessingml')) return faFileWord;
    if (type.includes('text')) return faFileAlt;
    if (type.includes('image')) return faFileImage;
    return faFile;
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
              {notesData.length === 0 && !isEditing ? (
                <div className="notes-empty">
                  No notes available.
                </div>
              ) : (
                <div className="notes-grid">
                  {isEditing ? (
                    <>
                      {editedNotes.map(note => (
                        <div key={note.id} className="notes-card">
                          {editingNoteId === note.id ? (
                            <textarea
                              value={note.content}
                              onChange={(e) => handleNoteChange(note.id, e.target.value)}
                              className="notes-card-textarea"
                              placeholder="Write your note here..."
                            />
                          ) : (
                            <div className="notes-card-content">
                              {note.content}
                            </div>
                          )}
                          <div className="notes-card-actions">
                            <button
                              className="notes-card-btn notes-edit-card-btn"
                              onClick={() => setEditingNoteId(editingNoteId === note.id ? null : note.id)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="notes-card-btn notes-delete-card-btn"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="notes-add-card">
                        <textarea
                          value={newNoteContent}
                          onChange={(e) => setNewNoteContent(e.target.value)}
                          className="notes-card-textarea"
                          placeholder="Write a new note..."
                        />
                        <button
                          className="notes-add-card-btn"
                          onClick={handleAddNote}
                          disabled={!newNoteContent.trim()}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </>
                  ) : (
                    notesData.map(note => (
                      <div key={note.id} className="notes-card">
                        <div className="notes-card-content">
                          {note.content}
                        </div>
                      </div>
                    ))
                  )}
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
                <div className="notes-attachments-wrapper">
                  <div className="notes-attachments-grid">
                    {notesAttachments.map((attachment, index) => (
                      <div key={`existing-${index}`} className="notes-attachment-card">
                        <div className="notes-attachment-info">
                          <FontAwesomeIcon icon={getFileIcon(attachment.type)} className="notes-attachment-icon" />
                          <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="notes-attachment-link">
                            {attachment.name}
                          </a>
                        </div>
                        {isEditing && (
                          <button
                            className="notes-remove-btn"
                            onClick={() => handleRemoveAttachment(index, false)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        )}
                      </div>
                    ))}
                    {newAttachments.map((attachment, index) => (
                      <div key={`new-${index}`} className="notes-attachment-card">
                        <div className="notes-attachment-info">
                          <FontAwesomeIcon icon={getFileIcon(attachment.type)} className="notes-attachment-icon" />
                          <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="notes-attachment-link">
                            {attachment.name}
                          </a>
                        </div>
                        <button
                          className="notes-remove-btn"
                          onClick={() => handleRemoveAttachment(index, true)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    ))}
                    {isEditing && (
                      <div className="notes-upload-section">
                        <label htmlFor="file-upload" className="notes-add-attachment-btn">
                          <FontAwesomeIcon icon={faPlus} />
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