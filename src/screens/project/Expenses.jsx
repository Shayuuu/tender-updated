import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import projectData from '../../data/Projectdata';
import Sidebar from '../Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Expenses.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Expenses = () => {
  const { id } = useParams();
  const [expensesData, setExpensesData] = useState([]);
  const [raBills, setRaBills] = useState([]);
  const [reportData, setReportData] = useState([]); // Store reportData from account
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newExpense, setNewExpense] = useState({ raNumber: '', date: '', billAmount: '', workBreakdownStructure: '' });
  const [editExpenses, setEditExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalExpenseIndex, setModalExpenseIndex] = useState(null); // null for overall report, number for row-specific
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    // Load data from projectData or localStorage, prioritizing localData for specific fields
    const localData = JSON.parse(localStorage.getItem('customProjectData')) || [];
    const localProject = localData.find((p) => p.id === parseInt(id));
    const project = projectData.find((p) => p.id === parseInt(id));

    // Merge projectData with localData, handling each field carefully
    const mergedData = {
      id: parseInt(id),
      forms: localProject?.forms || project?.forms || {},
      dates: localProject?.dates || project?.dates || [],
      account: localProject?.account || project?.account || {},
      expenses: Array.isArray(localProject?.expenses) && localProject.expenses.length > 0 
        ? localProject.expenses 
        : (project?.expenses || []),
      variations: localProject?.variations || project?.variations || [],
      notes: localProject?.notes || project?.notes || ""
    };

    // Initialize expensesData, raBills, and reportData
    setExpensesData(Array.isArray(mergedData.expenses) ? mergedData.expenses : []);
    setRaBills(mergedData.account && Array.isArray(mergedData.account.bills) ? mergedData.account.bills.map(bill => bill.raNumber) : []);
    setReportData(mergedData.account && Array.isArray(mergedData.account.reportData) ? mergedData.account.reportData : []);
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const calculateCumulativeAmount = (expenses, raNumber, currentIndex) => {
    const relevantExpenses = expenses.filter((exp, idx) => exp.raNumber === raNumber && idx <= currentIndex);
    return relevantExpenses.reduce((sum, exp) => {
      const amount = parseFloat(exp.billAmount.replace(/[^0-9.-]+/g, '')) || 0;
      return sum + amount;
    }, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const handleAddToggle = () => {
    setIsAdding(true);
    setIsEditing(false);
    setEditExpenses([]);
    setNewExpense({ raNumber: raBills[0] || '', date: '', billAmount: '', workBreakdownStructure: '' });
  };

  const handleEditToggle = () => {
    setIsEditing(true);
    setIsAdding(false);
    setNewExpense({ raNumber: '', date: '', billAmount: '', workBreakdownStructure: '' });
    setEditExpenses(expensesData.map(exp => ({ ...exp })));
  };

  const handleNewExpenseChange = (e, field) => {
    setNewExpense({ ...newExpense, [field]: e.target.value });
  };

  const handleEditExpenseChange = (index, field, value) => {
    const updatedEditExpenses = [...editExpenses];
    updatedEditExpenses[index] = { ...updatedEditExpenses[index], [field]: value };
    setEditExpenses(updatedEditExpenses);
  };

  const handleSave = () => {
    let updatedExpenses = [...expensesData];

    if (isAdding) {
      if (newExpense.raNumber && newExpense.date && newExpense.billAmount && newExpense.workBreakdownStructure) {
        const newExp = {
          raNumber: newExpense.raNumber,
          date: newExpense.date,
          billAmount: `₹${parseFloat(newExpense.billAmount).toLocaleString('en-IN')}`,
          workBreakdownStructure: newExpense.workBreakdownStructure
        };
        updatedExpenses.push(newExp);
      }
    } else if (isEditing) {
      updatedExpenses = editExpenses.map(exp => ({
        ...exp,
        billAmount: `₹${parseFloat(exp.billAmount.replace(/[^0-9.-]+/g, '') || 0).toLocaleString('en-IN')}`
      }));
    }

    // Recalculate cumulative amounts for each expense
    updatedExpenses = updatedExpenses.map((exp, index) => ({
      ...exp,
      cumulativeAmount: calculateCumulativeAmount(updatedExpenses, exp.raNumber, index)
    }));

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
      expenses: updatedExpenses,
      variations: existingLocalProject.variations || project?.variations || [],
      notes: existingLocalProject.notes || project?.notes || ""
    };

    if (projectIndex !== -1) {
      localData[projectIndex] = updatedProject;
    } else {
      localData.push(updatedProject);
    }
    localStorage.setItem('customProjectData', JSON.stringify(localData));

    setExpensesData(updatedExpenses);
    setIsAdding(false);
    setIsEditing(false);
    setNewExpense({ raNumber: '', date: '', billAmount: '', workBreakdownStructure: '' });
    setEditExpenses([]);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setNewExpense({ raNumber: '', date: '', billAmount: '', workBreakdownStructure: '' });
    setEditExpenses([]);
  };

  const openModal = (index) => {
    setModalExpenseIndex(index);
    setIsModalOpen(true);
    setUploadedFile(null);
    setShowReport(false);
  };

  const openOverallReport = () => {
    setModalExpenseIndex(null);
    setIsModalOpen(true);
    setUploadedFile(null);
    setShowReport(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalExpenseIndex(null);
    setUploadedFile(null);
    setShowReport(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const generateReport = () => {
    setShowReport(true);
  };

  // Filter report data based on modalExpenseIndex
  const filteredReportData = modalExpenseIndex !== null
    ? reportData.filter(item => item.raNumber === expensesData[modalExpenseIndex]?.raNumber)
    : reportData;

  const pieChartData = {
    labels: filteredReportData.map(item => item.raNumber),
    datasets: [
      {
        data: filteredReportData.map(item => parseFloat(item.amountBilled.replace(/[^0-9.-]+/g, ''))),
        backgroundColor: ['#4a22fa', '#5a32ff', '#6a42ff'],
        borderColor: '#333333',
        borderWidth: 1
      }
    ]
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#d3d3d3',
          font: { size: 12 }
        },
        position: 'top'
      },
      tooltip: {
        backgroundColor: '#2a2a2a',
        titleColor: '#ffffff',
        bodyColor: '#d3d3d3',
        borderColor: '#333333',
        borderWidth: 1
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="expenses-page">
      <Sidebar />
      <div className="expenses-main">
        <div className="expenses-content">
          <h1>Project Expenses</h1>

          {/* Expenses Section */}
          <div className="expenses-list-section">
            <h2>Expenses</h2>
            <div className="expenses-list-container">
              <div className="expenses-list-header">
                <div className="expenses-list-column">RA Number</div>
                <div className="expenses-list-column">Date</div>
                <div className="expenses-list-column">Bill Amount</div>
                <div className="expenses-list-column">Cumulative Amount</div>
                <div className="expenses-list-column">Work Breakdown Structure</div>
              </div>
              <div className="expenses-list">
                {expensesData.length === 0 && !isAdding && (
                  <div className="expenses-empty">
                    No expenses available.
                  </div>
                )}
                {expensesData.map((expense, index) => (
                  <div key={`${expense.raNumber}-${index}`} className="expenses-card">
                    <div className="expenses-list-column">
                      <span className="expenses-label-mobile">RA Number:</span>
                      {isEditing ? (
                        raBills.length > 0 ? (
                          <select
                            value={editExpenses[index]?.raNumber || ''}
                            onChange={(e) => handleEditExpenseChange(index, 'raNumber', e.target.value)}
                            className="expenses-input"
                          >
                            {raBills.map((ra) => (
                              <option key={ra} value={ra}>{ra}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={editExpenses[index]?.raNumber || ''}
                            onChange={(e) => handleEditExpenseChange(index, 'raNumber', e.target.value)}
                            className="expenses-input"
                            placeholder="Enter RA number"
                          />
                        )
                      ) : (
                        expense.raNumber
                      )}
                    </div>
                    <div className="expenses-list-column">
                      <span className="expenses-label-mobile">Date:</span>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editExpenses[index]?.date || ''}
                          onChange={(e) => handleEditExpenseChange(index, 'date', e.target.value)}
                          className="expenses-input"
                        />
                      ) : (
                        formatDate(expense.date)
                      )}
                    </div>
                    <div className="expenses-list-column">
                      <span className="expenses-label-mobile">Bill Amount:</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={(editExpenses[index]?.billAmount || '').replace(/[^0-9.-]+/g, '')}
                          onChange={(e) => handleEditExpenseChange(index, 'billAmount', e.target.value)}
                          className="expenses-input"
                          placeholder="Enter bill amount"
                        />
                      ) : (
                        expense.billAmount
                      )}
                    </div>
                    <div className="expenses-list-column">
                      <span className="expenses-label-mobile">Cumulative Amount:</span>
                      {expense.cumulativeAmount || calculateCumulativeAmount(expensesData, expense.raNumber, index)}
                    </div>
                    <div className="expenses-list-column">
                      <span className="expenses-label-mobile">Work Breakdown Structure:</span>
                      {(isEditing || isAdding) ? (
                        <button
                          className="expenses-wbs-btn"
                          onClick={() => openModal(index)}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      ) : (
                        <button
                          className="expenses-wbs-btn expenses-wbs-btn-view"
                          onClick={() => openModal(index)}
                        >
                          View Report
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isAdding && (
                  <div className="expenses-card">
                    <div className="expenses-list-column">
                      <span className="expenses-label-mobile">RA Number:</span>
                      {raBills.length > 0 ? (
                        <select
                          value={newExpense.raNumber}
                          onChange={(e) => handleNewExpenseChange(e, 'raNumber')}
                          className="expenses-input"
                        >
                          {raBills.map((ra) => (
                            <option key={ra} value={ra}>{ra}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={newExpense.raNumber}
                          onChange={(e) => handleNewExpenseChange(e, 'raNumber')}
                          className="expenses-input"
                          placeholder="Enter RA number"
                        />
                      )}
                    </div>
                    <div className="expenses-list-column">
                      <span className="expenses-label-mobile">Date:</span>
                      <input
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => handleNewExpenseChange(e, 'date')}
                        className="expenses-input"
                      />
                    </div>
                    <div className="expenses-list-column">
                      <span className="expenses-label-mobile">Bill Amount:</span>
                      <input
                        type="number"
                        value={newExpense.billAmount}
                        onChange={(e) => handleNewExpenseChange(e, 'billAmount')}
                        className="expenses-input"
                        placeholder="Enter bill amount"
                      />
                    </div>
                    <div className="expenses-list-column">
                      <span className="expenses-label-mobile">Cumulative Amount:</span>
                      {(() => {
                        const previousExpenses = expensesData.filter(exp => exp.raNumber === newExpense.raNumber);
                        const amount = parseFloat(newExpense.billAmount) || 0;
                        const total = previousExpenses.reduce((sum, exp) => {
                          const expAmount = parseFloat(exp.billAmount.replace(/[^0-9.-]+/g, '')) || 0;
                          return sum + expAmount;
                        }, 0) + amount;
                        return `₹${total.toLocaleString('en-IN')}`;
                      })()}
                    </div>
                    <div className="expenses-list-column">
                      <span className="expenses-label-mobile">Work Breakdown Structure:</span>
                      <button
                        className="expenses-wbs-btn"
                        onClick={() => openModal(expensesData.length)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="expenses-actions">
              {!(isAdding || isEditing) ? (
                <>
                  <button
                    className="expenses-btn expenses-add-btn"
                    onClick={handleAddToggle}
                  >
                    Add Expense
                  </button>
                  <button
                    className="expenses-btn expenses-edit-btn"
                    onClick={handleEditToggle}
                    disabled={expensesData.length === 0}
                  >
                    Edit
                  </button>
                  <button
                    className="expenses-btn expenses-report-btn"
                    onClick={openOverallReport}
                    disabled={expensesData.length === 0}
                  >
                    General Overall Report
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="expenses-btn expenses-save-btn"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="expenses-btn expenses-cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Modal for Work Breakdown Structure */}
          {isModalOpen && (
            <div className="expenses-modal-overlay">
              <div className="expenses-modal">
                <div className="expenses-modal-header">
                  <h2>
                    {modalExpenseIndex !== null
                      ? `Work Breakdown Structure - ${expensesData[modalExpenseIndex]?.raNumber}`
                      : 'General Overall Report'}
                  </h2>
                  <button className="expenses-modal-close-btn" onClick={closeModal}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <div className="expenses-modal-body">
                  {(isEditing || isAdding) && !showReport ? (
                    <div className="expenses-modal-upload-section">
                      <label htmlFor="wbs-upload" className="expenses-modal-upload-label">
                        Upload File (CSV, XLSX)
                      </label>
                      <input
                        id="wbs-upload"
                        type="file"
                        accept=".csv, .xlsx"
                        onChange={handleFileUpload}
                        className="expenses-modal-upload-input"
                      />
                      {uploadedFile && (
                        <div className="expenses-modal-file-info">
                          Uploaded: {uploadedFile.name}
                        </div>
                      )}
                      <button
                        className="expenses-modal-generate-btn"
                        onClick={generateReport}
                        disabled={!uploadedFile}
                      >
                        Generate Report
                      </button>
                    </div>
                  ) : (
                    <div className="expenses-modal-report-section">
                      <h3>{modalExpenseIndex !== null ? `Breakdown Report - ${expensesData[modalExpenseIndex]?.raNumber}` : 'Overall Breakdown Report'}</h3>
                      <div className="expenses-modal-report-table">
                        <div className="expenses-report-table-header">
                          <div className="expenses-report-table-column">Project Name</div>
                          <div className="expenses-report-table-column">Work Order Value</div>
                          <div className="expenses-report-table-column">RA No.</div>
                          <div className="expenses-report-table-column">Amount Billed</div>
                          <div className="expenses-report-table-column">Balance Amount</div>
                        </div>
                        <div className="expenses-report-table-body">
                          {filteredReportData.length > 0 ? (
                            filteredReportData.map((row, index) => (
                              <div key={index} className="expenses-report-table-row">
                                <div className="expenses-report-table-column">{row.projectName}</div>
                                <div className="expenses-report-table-column">{row.workOrderValue}</div>
                                <div className="expenses-report-table-column">{row.raNumber}</div>
                                <div className="expenses-report-table-column">{row.amountBilled}</div>
                                <div className="expenses-report-table-column">{row.balanceAmount}</div>
                              </div>
                            ))
                          ) : (
                            <div className="expenses-report-empty">
                              No report data available.
                            </div>
                          )}
                        </div>
                      </div>
                      {filteredReportData.length > 0 && (
                        <div className="expenses-modal-report-chart">
                          <Pie data={pieChartData} options={pieChartOptions} height={300} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;