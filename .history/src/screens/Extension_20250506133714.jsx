import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import bidderData from '../data/Bidderdata';
import Sidebar from './Sidebar';
import './Extension.css';

// yyyy-mm-dd ➝ dd-mm-yyyy
const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`;
};

const Extension = () => {
  const { id } = useParams();
  const [extensionDates, setExtensionDates] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    const data = bidderData.find((bidder) => bidder.id === parseInt(id));
    if (data && data.id === 1 && data.extensionDates) {
      setExtensionDates(data.extensionDates);
    }
  }, [id]);

  const handleAddToggle = () => {
    setIsAdding(true);
  };

  const handleSave = () => {
    if (newDate) {
      const newExtension = {
        extensionNo: extensionDates.length + 1,
        date: newDate
      };
      setExtensionDates([...extensionDates, newExtension]);
      setNewDate('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewDate('');
    setIsAdding(false);
  };

  if (!extensionDates || extensionDates.length === 0) {
    return (
      <div className="extension-page">
        <Sidebar />
        <div className="extension-main">
          <div className="extension-content">
            <h1>Extension Dates</h1>
            <div className="extension-coming-soon">
              Coming Soon: Detailed information for this tender is not yet available.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="extension-page">
      <Sidebar />
      <div className="extension-main">
        <div className="extension-content">
          <h1>Extension Dates</h1>
          <div className="extension-actions">
            {!isAdding ? (
              <button
                className="extension-btn extension-add-btn"
                onClick={handleAddToggle}
              >
                Add Extension Date
              </button>
            ) : (
              <>
                <button
                  className="extension-btn extension-save-btn"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="extension-btn extension-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
          <div className="extension-table-container">
            <table className="extension-table">
              <thead>
                <tr>
                  <th>Extension No.</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {extensionDates.map((ext, index) => (
                  <tr key={index}>
                    <td>{ext.extensionNo}</td>
                    <td>{formatDate(ext.date)}</td>
                  </tr>
                ))}
                {isAdding && (
                  <tr>
                    <td>{extensionDates.length + 1}</td>
                    <td>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="extension-input"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Extension;