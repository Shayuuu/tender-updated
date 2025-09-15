import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import projectData from '../../data/Projectdata'
import Sidebar from '../Sidebar'
import './Dates.css'

const Dates = () => {
  const { id } = useParams()
  const [completionDates, setCompletionDates] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editDates, setEditDates] = useState([])

  useEffect(() => {
    // Load data from projectData or localStorage, prioritizing localData
    const localData = JSON.parse(localStorage.getItem('customProjectData')) || [];
    const localProject = localData.find((p) => p.id === parseInt(id));
    const project = projectData.find((p) => p.id === parseInt(id));

    // Merge projectData with localData, prioritizing localData fields
    const data = localProject ? { ...project, ...localProject } : project;

    if (data && data.dates) {
      setCompletionDates(data.dates);
    } else {
      setCompletionDates([]);
    }
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  const handleAddToggle = () => {
    setIsAdding(true);
    setIsEditing(false);
    setEditDates([]);
  }

  const handleEditToggle = () => {
    setIsEditing(true);
    setIsAdding(false);
    setNewDate('');
    setEditDates(completionDates.map(ext => ext.date));
  }

  const handleEditDateChange = (index, value) => {
    const updatedEditDates = [...editDates];
    updatedEditDates[index] = value;
    setEditDates(updatedEditDates);
  }

  const handleSaveAdd = () => {
    if (newDate) {
      const newCompletion = {
        completionNo: completionDates.length + 1,
        date: newDate
      };
      const updatedDates = [...completionDates, newCompletion];
      setCompletionDates(updatedDates);
      setNewDate('');
      setIsAdding(false);

      // Load the full project data and update with new dates
      const localData = JSON.parse(localStorage.getItem('customProjectData')) || [];
      const projectIndex = localData.findIndex((p) => p.id === parseInt(id));
      const project = projectData.find((p) => p.id === parseInt(id));
      const updatedProject = { ...project, dates: updatedDates };

      if (projectIndex !== -1) {
        localData[projectIndex] = updatedProject;
      } else {
        localData.push(updatedProject);
      }
      localStorage.setItem('customProjectData', JSON.stringify(localData));
    }
  }

  const handleSaveEdit = () => {
    if (editDates.length > 0) {
      const updatedDates = completionDates.map((ext, index) => ({
        ...ext,
        date: editDates[index] || ext.date
      }));
      setCompletionDates(updatedDates);
      setIsEditing(false);
      setEditDates([]);

      // Load the full project data and update with new dates
      const localData = JSON.parse(localStorage.getItem('customProjectData')) || [];
      const projectIndex = localData.findIndex((p) => p.id === parseInt(id));
      const project = projectData.find((p) => p.id === parseInt(id));
      const updatedProject = { ...project, dates: updatedDates };

      if (projectIndex !== -1) {
        localData[projectIndex] = updatedProject;
      } else {
        localData.push(updatedProject);
      }
      localStorage.setItem('customProjectData', JSON.stringify(localData));
    }
  }

  const handleCancel = () => {
    setNewDate('');
    setIsAdding(false);
    setIsEditing(false);
    setEditDates([]);
  }

  return (
    <div className="dates-page">
      <Sidebar />
      <div className="dates-main">
        <div className="dates-content">
          <h1>Completion Dates</h1>
          <div className="dates-list-container">
            <div className="dates-list-header">
              <div className="dates-list-column">Completion Date No.</div>
              <div className="dates-list-column">Date</div>
            </div>
            <div className="dates-list">
              {completionDates.length === 0 && !isAdding && (
                <div className="dates-empty">
                  No completion dates available.
                </div>
              )}
              {completionDates.map((ext, index) => (
                <div key={index} className="dates-card">
                  <div className="dates-list-column">
                    <span className="dates-label-mobile">Completion Date No:</span>
                    {ext.completionNo}
                  </div>
                  <div className="dates-list-column">
                    <span className="dates-label-mobile">Date:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editDates[index] || ''}
                        onChange={(e) => handleEditDateChange(index, e.target.value)}
                        className="dates-input"
                      />
                    ) : (
                      formatDate(ext.date)
                    )}
                  </div>
                </div>
              ))}
              {isAdding && (
                <div className="dates-card">
                  <div className="dates-list-column">
                    <span className="dates-label-mobile">Completion Date No:</span>
                    {completionDates.length + 1}
                  </div>
                  <div className="dates-list-column">
                    <span className="dates-label-mobile">Date:</span>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="dates-input"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="dates-actions">
            {!(isAdding || isEditing) ? (
              <>
                <button
                  className="dates-btn dates-add-btn"
                  onClick={handleAddToggle}
                >
                  Add Completion Date
                </button>
                <button
                  className="dates-btn dates-edit-btn"
                  onClick={handleEditToggle}
                  disabled={completionDates.length === 0}
                >
                  Edit
                </button>
              </>
            ) : (
              <>
                <button
                  className="dates-btn dates-save-btn"
                  onClick={isAdding ? handleSaveAdd : handleSaveEdit}
                >
                  Save
                </button>
                <button
                  className="dates-btn dates-cancel-btn"
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

export default Dates