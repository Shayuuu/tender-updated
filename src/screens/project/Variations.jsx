import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import projectData from '../../data/Projectdata';
import Sidebar from '../Sidebar';
import './Variations.css';

const Variations = () => {
  const { id } = useParams();
  const [variationsData, setVariationsData] = useState([]);
  const [workOrderValue, setWorkOrderValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newVariation, setNewVariation] = useState({ addedValue: '' });
  const [editVariations, setEditVariations] = useState([]);

  useEffect(() => {
    // Load data from projectData or localStorage, prioritizing localData for specific fields
    const localData = JSON.parse(localStorage.getItem('customProjectData')) || [];
    const localProject = localData.find((p) => p.id === parseInt(id));
    const project = projectData.find((p) => p.id === parseInt(id));

    // Merge projectData with localData, but handle each field carefully
    const mergedData = {
      id: parseInt(id),
      forms: localProject?.forms || project?.forms || {},
      dates: localProject?.dates || project?.dates || [],
      account: localProject?.account || project?.account || {},
      expenses: localProject?.expenses || project?.expenses || [],
      variations: Array.isArray(localProject?.variations) && localProject.variations.length > 0 
        ? localProject.variations 
        : (project?.variations || []),
      notes: localProject?.notes || project?.notes || ""
    };

    // Initialize variationsData and workOrderValue
    setVariationsData(Array.isArray(mergedData.variations) ? mergedData.variations : []);
    setWorkOrderValue(mergedData.forms?.workOrderValue || '₹0');
  }, [id]);

  const calculateValues = (variations) => {
    return variations.map((variation, index) => {
      const previousValue = index === 0 
        ? workOrderValue 
        : variations[index - 1].updatedValue;
      const addedValueNum = parseFloat(variation.addedValue.replace(/[^0-9.-]+/g, '')) || 0;
      const updatedValueNum = parseFloat(previousValue.replace(/[^0-9.-]+/g, '')) + addedValueNum;
      return {
        previousValue,
        addedValue: `₹${addedValueNum.toLocaleString('en-IN')}`,
        updatedValue: `₹${updatedValueNum.toLocaleString('en-IN')}`
      };
    });
  };

  const handleAddToggle = () => {
    setIsAdding(true);
    setIsEditing(false);
    setEditVariations([]);
    setNewVariation({ addedValue: '' });
  };

  const handleEditToggle = () => {
    setIsEditing(true);
    setIsAdding(false);
    setNewVariation({ addedValue: '' });
    setEditVariations(variationsData.map(varn => ({ ...varn })));
  };

  const handleNewVariationChange = (e) => {
    setNewVariation({ addedValue: e.target.value });
  };

  const handleEditVariationChange = (index, value) => {
    const updatedEditVariations = [...editVariations];
    updatedEditVariations[index] = { ...updatedEditVariations[index], addedValue: value };
    setEditVariations(updatedEditVariations);
  };

  const handleSave = () => {
    let updatedVariations = [...variationsData];

    if (isAdding) {
      if (newVariation.addedValue) {
        const newVar = {
          previousValue: updatedVariations.length === 0 
            ? workOrderValue 
            : updatedVariations[updatedVariations.length - 1].updatedValue,
          addedValue: `₹${parseFloat(newVariation.addedValue).toLocaleString('en-IN')}`,
          updatedValue: ''
        };
        updatedVariations.push(newVar);
      }
    } else if (isEditing) {
      updatedVariations = editVariations.map(varn => ({
        ...varn,
        addedValue: `₹${parseFloat(varn.addedValue.replace(/[^0-9.-]+/g, '') || 0).toLocaleString('en-IN')}`
      }));
    }

    // Recalculate previousValue and updatedValue for all variations
    updatedVariations = calculateValues(updatedVariations);

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
      variations: updatedVariations,
      notes: existingLocalProject.notes || project?.notes || ""
    };

    if (projectIndex !== -1) {
      localData[projectIndex] = updatedProject;
    } else {
      localData.push(updatedProject);
    }
    localStorage.setItem('customProjectData', JSON.stringify(localData));

    setVariationsData(updatedVariations);
    setIsAdding(false);
    setIsEditing(false);
    setNewVariation({ addedValue: '' });
    setEditVariations([]);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setNewVariation({ addedValue: '' });
    setEditVariations([]);
  };

  return (
    <div className="variations-page">
      <Sidebar />
      <div className="variations-main">
        <div className="variations-content">
          <h1>Project Variations</h1>

          {/* Variations Section */}
          <div className="variations-list-section">
            <h2>Variations</h2>
            <div className="variations-list-container">
              <div className="variations-list-header">
                <div className="variations-list-column">Previous Value</div>
                <div className="variations-list-column">Added Value</div>
                <div className="variations-list-column">Updated Value</div>
              </div>
              <div className="variations-list">
                {variationsData.length === 0 && !isAdding && (
                  <div className="variations-empty">
                    No variations available.
                  </div>
                )}
                {variationsData.map((variation, index) => (
                  <div key={`variation-${index}`} className="variations-card">
                    <div className="variations-list-column">
                      <span className="variations-label-mobile">Previous Value:</span>
                      {variation.previousValue}
                    </div>
                    <div className="variations-list-column">
                      <span className="variations-label-mobile">Added Value:</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={(editVariations[index]?.addedValue || '').replace(/[^0-9.-]+/g, '')}
                          onChange={(e) => handleEditVariationChange(index, e.target.value)}
                          className="variations-input"
                          placeholder="Enter added value"
                        />
                      ) : (
                        variation.addedValue
                      )}
                    </div>
                    <div className="variations-list-column">
                      <span className="variations-label-mobile">Updated Value:</span>
                      {variation.updatedValue}
                    </div>
                  </div>
                ))}
                {isAdding && (
                  <div className="variations-card">
                    <div className="variations-list-column">
                      <span className="variations-label-mobile">Previous Value:</span>
                      {variationsData.length === 0 
                        ? workOrderValue 
                        : variationsData[variationsData.length - 1].updatedValue}
                    </div>
                    <div className="variations-list-column">
                      <span className="variations-label-mobile">Added Value:</span>
                      <input
                        type="number"
                        value={newVariation.addedValue}
                        onChange={handleNewVariationChange}
                        className="variations-input"
                        placeholder="Enter added value"
                      />
                    </div>
                    <div className="variations-list-column">
                      <span className="variations-label-mobile">Updated Value:</span>
                      {(() => {
                        const previous = variationsData.length === 0 
                          ? parseFloat(workOrderValue.replace(/[^0-9.-]+/g, '')) 
                          : parseFloat(variationsData[variationsData.length - 1].updatedValue.replace(/[^0-9.-]+/g, ''));
                        const added = parseFloat(newVariation.addedValue) || 0;
                        return `₹${(previous + added).toLocaleString('en-IN')}`;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="variations-actions">
              {!(isAdding || isEditing) ? (
                <>
                  <button
                    className="variations-btn variations-add-btn"
                    onClick={handleAddToggle}
                  >
                    Add Variation
                  </button>
                  <button
                    className="variations-btn variations-edit-btn"
                    onClick={handleEditToggle}
                    disabled={variationsData.length === 0}
                  >
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="variations-btn variations-save-btn"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="variations-btn variations-cancel-btn"
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
    </div>
  );
};

export default Variations;