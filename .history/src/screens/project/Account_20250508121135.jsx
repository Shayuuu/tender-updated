import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import projectData from '../../data/Projectdata';
import Sidebar from '../Sidebar';
import './Account.css';

const Account = () => {
  const { id } = useParams();
  const [accountData, setAccountData] = useState({ summary: {}, bills: [] });
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newRA, setNewRA] = useState({ date: '', billAmount: '', workBreakdownStructure: '' });
  const [editRAs, setEditRAs] = useState([]);

  useEffect(() => {
    // Load data from projectData or localStorage, prioritizing localData
    const localData = JSON.parse(localStorage.getItem('customProjectData')) || [];
    const localProject = localData.find((p) => p.id === parseInt(id));
    const project = projectData.find((p) => p.id === parseInt(id));

    // Merge projectData with localData, prioritizing localData fields
    const data = localProject ? { ...project, ...localProject } : project;

    // Initialize accountData
    if (data && data.account && data.account.bills) {
      setAccountData({
        summary: data.account.summary || { cumulativeValueOfBills: "₹0", balanceValueOfContract: "₹0", revisedValueFromVariation: "₹0" },
        bills: Array.isArray(data.account.bills) ? data.account.bills : []
      });
    } else {
      setAccountData({
        summary: { cumulativeValueOfBills: "₹0", balanceValueOfContract: "₹0", revisedValueFromVariation: "₹0" },
        bills: []
      });
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const calculateCumulativeAmount = (bills, currentIndex) => {
    return bills.slice(0, currentIndex + 1).reduce((sum, bill) => {
      const amount = parseFloat(bill.billAmount.replace(/[^0-9.-]+/g, '')) || 0;
      return sum + amount;
    }, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const handleAddToggle = () => {
    setIsAdding(true);
    setIsEditing(false);
    setEditRAs([]);
    setNewRA({ date: '', billAmount: '', workBreakdownStructure: '' });
  };

  const handleEditToggle = () => {
    setIsEditing(true);
    setIsAdding(false);
    setNewRA({ date: '', billAmount: '', workBreakdownStructure: '' });
    setEditRAs(accountData.bills.map(bill => ({ ...bill })));
  };

  const handleNewRAChange = (e, field) => {
    setNewRA({ ...newRA, [field]: e.target.value });
  };

  const handleEditRAChange = (index, field, value) => {
    const updatedEditRAs = [...editRAs];
    updatedEditRAs[index] = { ...updatedEditRAs[index], [field]: value };
    setEditRAs(updatedEditRAs);
  };

  const handleSave = () => {
    let updatedBills = [...accountData.bills];
    let updatedSummary = { ...accountData.summary };

    if (isAdding) {
      if (newRA.date && newRA.billAmount && newRA.workBreakdownStructure) {
        const newBill = {
          raNumber: `RA${updatedBills.length + 1}`,
          date: newRA.date,
          billAmount: `₹${parseFloat(newRA.billAmount).toLocaleString('en-IN')}`,
          workBreakdownStructure: newRA.workBreakdownStructure
        };
        updatedBills.push(newBill);
      }
    } else if (isEditing) {
      updatedBills = editRAs.map(bill => ({
        ...bill,
        billAmount: `₹${parseFloat(bill.billAmount.replace(/[^0-9.-]+/g, '') || 0).toLocaleString('en-IN')}`
      }));
    }

    // Recalculate cumulative amounts for each bill
    updatedBills = updatedBills.map((bill, index) => ({
      ...bill,
      cumulativeAmount: calculateCumulativeAmount(updatedBills, index)
    }));

    // Update summary
    const totalCumulative = updatedBills.reduce((sum, bill) => {
      const amount = parseFloat(bill.billAmount.replace(/[^0-9.-]+/g, '')) || 0;
      return sum + amount;
    }, 0);
    updatedSummary.cumulativeValueOfBills = `₹${totalCumulative.toLocaleString('en-IN')}`;

    // Save to localStorage
    const localData = JSON.parse(localStorage.getItem('customProjectData')) || [];
    const projectIndex = localData.findIndex((p) => p.id === parseInt(id));
    const project = projectData.find((p) => p.id === parseInt(id));
    const existingLocalProject = localData[projectIndex] || {};

    const updatedProject = {
      id: parseInt(id),
      forms: existingLocalProject.forms || project?.forms || {},
      dates: existingLocalProject.dates || project?.dates || [],
      account: {
        summary: updatedSummary,
        bills: updatedBills
      },
      expenses: existingLocalProject.expenses || project?.expenses || [],
      variations: existingLocalProject.variations || project?.variations || [],
      notes: existingLocalProject.notes || project?.notes || ""
    };

    if (projectIndex !== -1) {
      localData[projectIndex] = updatedProject;
    } else {
      localData.push(updatedProject);
    }
    localStorage.setItem('customProjectData', JSON.stringify(localData));

    setAccountData({ summary: updatedSummary, bills: updatedBills });
    setIsAdding(false);
    setIsEditing(false);
    setNewRA({ date: '', billAmount: '', workBreakdownStructure: '' });
    setEditRAs([]);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setNewRA({ date: '', billAmount: '', workBreakdownStructure: '' });
    setEditRAs([]);
  };

  return (
    <div className="account-page">
      <Sidebar />
      <div className="account-main">
        <div className="account-content">
          <h1>Running Account Bill</h1>

          {/* Summary Section */}
          <div className="account-summary-section">
            <h2>Summary</h2>
            <div className="account-summary-details">
              <div className="account-summary-field">
                <label>Cumulative Value of Bills</label>
                <div className="account-data-box">
                  {accountData.summary.cumulativeValueOfBills || '₹0'}
                </div>
              </div>
              <div className="account-summary-field">
                <label>Balance Value of Contract</label>
                <div className="account-data-box">
                  {accountData.summary.balanceValueOfContract || '₹0'}
                </div>
              </div>
              <div className="account-summary-field">
                <label>Revised Value from Variation - Cumulative Value</label>
                <div className="account-data-box">
                  {accountData.summary.revisedValueFromVariation || '₹0'}
                </div>
              </div>
            </div>
          </div>

          {/* RA Bills Section */}
          <div className="account-bills-section">
            <h2>Running Account Bills</h2>
            <div className="account-bills-list-container">
              <div className="account-bills-list-header">
                <div className="account-bills-list-column">RA Number</div>
                <div className="account-bills-list-column">Date</div>
                <div className="account-bills-list-column">Bill Amount</div>
                <div className="account-bills-list-column">Cumulative Amount</div>
                <div className="account-bills-list-column">Work Breakdown Structure</div>
              </div>
              <div className="account-bills-list">
                {accountData.bills.length === 0 && !isAdding && (
                  <div className="account-bills-empty">
                    No Running Account Bills available.
                  </div>
                )}
                {accountData.bills.map((bill, index) => (
                  <div key={bill.raNumber} className="account-bills-card">
                    <div className="account-bills-list-column">
                      <span className="account-bills-label-mobile">RA Number:</span>
                      {bill.raNumber}
                    </div>
                    <div className="account-bills-list-column">
                      <span className="account-bills-label-mobile">Date:</span>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editRAs[index]?.date || ''}
                          onChange={(e) => handleEditRAChange(index, 'date', e.target.value)}
                          className="account-bills-input"
                        />
                      ) : (
                        formatDate(bill.date)
                      )}
                    </div>
                    <div className="account-bills-list-column">
                      <span className="account-bills-label-mobile">Bill Amount:</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={(editRAs[index]?.billAmount || '').replace(/[^0-9.-]+/g, '')}
                          onChange={(e) => handleEditRAChange(index, 'billAmount', e.target.value)}
                          className="account-bills-input"
                          placeholder="Enter bill amount"
                        />
                      ) : (
                        bill.billAmount
                      )}
                    </div>
                    <div className="account-bills-list-column">
                      <span className="account-bills-label-mobile">Cumulative Amount:</span>
                      {bill.cumulativeAmount || calculateCumulativeAmount(accountData.bills, index)}
                    </div>
                    <div className="account-bills-list-column">
                      <span className="account-bills-label-mobile">Work Breakdown Structure:</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editRAs[index]?.workBreakdownStructure || ''}
                          onChange={(e) => handleEditRAChange(index, 'workBreakdownStructure', e.target.value)}
                          className="account-bills-input"
                          placeholder="Enter work breakdown structure"
                        />
                      ) : (
                        bill.workBreakdownStructure
                      )}
                    </div>
                  </div>
                ))}
                {isAdding && (
                  <div className="account-bills-card">
                    <div className="account-bills-list-column">
                      <span className="account-bills-label-mobile">RA Number:</span>
                      RA{accountData.bills.length + 1}
                    </div>
                    <div className="account-bills-list-column">
                      <span className="account-bills-label-mobile">Date:</span>
                      <input
                        type="date"
                        value={newRA.date}
                        onChange={(e) => handleNewRAChange(e, 'date')}
                        className="account-bills-input"
                      />
                    </div>
                    <div className="account-bills-list-column">
                      <span className="account-bills-label-mobile">Bill Amount:</span>
                      <input
                        type="number"
                        value={newRA.billAmount}
                        onChange={(e) => handleNewRAChange(e, 'billAmount')}
                        className="account-bills-input"
                        placeholder="Enter bill amount"
                      />
                    </div>
                    <div className="account-bills-list-column">
                      <span className="account-bills-label-mobile">Cumulative Amount:</span>
                      {(() => {
                        const previousBills = [...accountData.bills];
                        const amount = parseFloat(newRA.billAmount) || 0;
                        const total = previousBills.reduce((sum, bill) => {
                          const billAmount = parseFloat(bill.billAmount.replace(/[^0-9.-]+/g, '')) || 0;
                          return sum + billAmount;
                        }, 0) + amount;
                        return `₹${total.toLocaleString('en-IN')}`;
                      })()}
                    </div>
                    <div className="account-bills-list-column">
                      <span className="account-bills-label-mobile">Work Breakdown Structure:</span>
                      <input
                        type="text"
                        value={newRA.workBreakdownStructure}
                        onChange={(e) => handleNewRAChange(e, 'workBreakdownStructure')}
                        className="account-bills-input"
                        placeholder="Enter work breakdown structure"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="account-bills-actions">
              {!(isAdding || isEditing) ? (
                <>
                  <button
                    className="account-bills-btn account-bills-add-btn"
                    onClick={handleAddToggle}
                  >
                    Add RA
                  </button>
                  <button
                    className="account-bills-btn account-bills-edit-btn"
                    onClick={handleEditToggle}
                    disabled={accountData.bills.length === 0}
                  >
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="account-bills-btn account-bills-save-btn"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="account-bills-btn account-bills-cancel-btn"
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

export default Account;