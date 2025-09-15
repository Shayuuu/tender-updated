import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './KPI.css';

const KPI = () => {
  // Mock data for Bidder Section
  const bidderData = [
    {
      bidderName: 'Bidder A',
      bidderCode: 'B001',
      projectName: 'Project Alpha',
      tenderAmount: '₹50,00,000',
      bgEdrDueDate: '2025-06-15',
      alerts: 'Due in 30 days',
      bgEdrDueAmount: '₹5,00,000',
      bgEdrReturned: 'No'
    },
    {
      bidderName: 'Bidder B',
      bidderCode: 'B002',
      projectName: 'Project Beta',
      tenderAmount: '₹75,00,000',
      bgEdrDueDate: '2025-05-20',
      alerts: 'Overdue',
      bgEdrDueAmount: '₹7,50,000',
      bgEdrReturned: 'Yes'
    },
    {
      bidderName: 'Bidder C',
      bidderCode: 'B003',
      projectName: 'Project Gamma',
      tenderAmount: '₹30,00,000',
      bgEdrDueDate: '2025-07-10',
      alerts: 'Due in 60 days',
      bgEdrDueAmount: '₹3,00,000',
      bgEdrReturned: 'No'
    }
  ];

  // Mock data for Project Section
  const projectData = [
    {
      projectName: 'Project Alpha',
      projectCode: 'P001',
      edCompleted: true,
      fdCompleted: false,
      bgCompleted: true,
      progress: 80,
      status: 'In Progress',
      amountToGive: '₹10,00,000',
      amountToBeReceived: '₹15,00,000',
      revenue: '₹60,00,000',
      profit: '₹12,00,000',
      loss: '₹2,00,000',
      expenditure: '₹48,00,000'
    },
    {
      projectName: 'Project Beta',
      projectCode: 'P002',
      edCompleted: false,
      fdCompleted: true,
      bgCompleted: false,
      progress: 45,
      status: 'In Progress',
      amountToGive: '₹20,00,000',
      amountToBeReceived: '₹25,00,000',
      revenue: '₹80,00,000',
      profit: '₹15,00,000',
      loss: '₹5,00,000',
      expenditure: '₹65,00,000'
    },
    {
      projectName: 'Project Gamma',
      projectCode: 'P003',
      edCompleted: true,
      fdCompleted: true,
      bgCompleted: true,
      progress: 100,
      status: 'Done',
      amountToGive: '₹5,00,000',
      amountToBeReceived: '₹8,00,000',
      revenue: '₹40,00,000',
      profit: '₹10,00,000',
      loss: '₹0',
      expenditure: '₹30,00,000'
    }
  ];

  const [view, setView] = useState('Bidder'); // Toggle between 'Bidder' and 'Project'

  const handleToggleView = () => {
    setView(view === 'Bidder' ? 'Project' : 'Bidder');
  };

  return (
    <div className="kpi-page">
      <Sidebar />
      <div className="kpi-main">
        <div className="kpi-content">
          <h1>KPI Dashboard</h1>

          {/* Slider for Bidder/Project */}
          <div className="kpi-toggle-section">
            <span className={`kpi-toggle-label ${view === 'Bidder' ? 'active' : ''}`}>
              Bidder
            </span>
            <label className="kpi-toggle-switch">
              <input
                type="checkbox"
                checked={view === 'Project'}
                onChange={handleToggleView}
              />
              <span className="kpi-toggle-slider"></span>
            </label>
            <span className={`kpi-toggle-label ${view === 'Project' ? 'active' : ''}`}>
              Project
            </span>
          </div>

          {/* Bidder Section */}
          {view === 'Bidder' && (
            <div className="kpi-section">
              <h2>Bidder KPI</h2>
              <div className="kpi-table-container">
                <div className="kpi-table-header">
                  <div className="kpi-table-column">Bidder Name</div>
                  <div className="kpi-table-column">Bidder Code</div>
                  <div className="kpi-table-column">Project Name</div>
                  <div className="kpi-table-column">Tender Amount</div>
                  <div className="kpi-table-column">BG/EDR Due Date</div>
                  <div className="kpi-table-column">Alerts</div>
                  <div className="kpi-table-column">BG/EDR Due Amount</div>
                  <div className="kpi-table-column">BG/EDR Returned</div>
                </div>
                <div className="kpi-table-body">
                  {bidderData.length === 0 ? (
                    <div className="kpi-empty">No bidder data available.</div>
                  ) : (
                    bidderData.map((bidder, index) => (
                      <div key={index} className="kpi-table-row">
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Bidder Name:</span>
                          {bidder.bidderName}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Bidder Code:</span>
                          {bidder.bidderCode}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Project Name:</span>
                          {bidder.projectName}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Tender Amount:</span>
                          {bidder.tenderAmount}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">BG/EDR Due Date:</span>
                          {bidder.bgEdrDueDate}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Alerts:</span>
                          <span className={`kpi-alert ${bidder.alerts === 'Overdue' ? 'overdue' : ''}`}>
                            {bidder.alerts}
                          </span>
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">BG/EDR Due Amount:</span>
                          {bidder.bgEdrDueAmount}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">BG/EDR Returned:</span>
                          {bidder.bgEdrReturned}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Project Section */}
          {view === 'Project' && (
            <div className="kpi-section">
              <h2>Project KPI</h2>
              <div className="kpi-table-container">
                <div className="kpi-table-header">
                  <div className="kpi-table-column">Project Name</div>
                  <div className="kpi-table-column">Project Code</div>
                  <div className="kpi-table-column">ED</div>
                  <div className="kpi-table-column">FD</div>
                  <div className="kpi-table-column">BG</div>
                  <div className="kpi-table-column">Progress (%)</div>
                  <div className="kpi-table-column">Status</div>
                  <div className="kpi-table-column">Amount To Give</div>
                  <div className="kpi-table-column">Amount to be Received</div>
                  <div className="kpi-table-column">Revenue</div>
                  <div className="kpi-table-column">Profit</div>
                  <div className="kpi-table-column">Loss</div>
                  <div className="kpi-table-column">Expenditure</div>
                </div>
                <div className="kpi-table-body">
                  {projectData.length === 0 ? (
                    <div className="kpi-empty">No project data available.</div>
                  ) : (
                    projectData.map((project, index) => (
                      <div key={index} className="kpi-table-row">
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Project Name:</span>
                          {project.projectName}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Project Code:</span>
                          {project.projectCode}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">ED:</span>
                          <input
                            type="checkbox"
                            checked={project.edCompleted}
                            readOnly
                          />
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">FD:</span>
                          <input
                            type="checkbox"
                            checked={project.fdCompleted}
                            readOnly
                          />
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">BG:</span>
                          <input
                            type="checkbox"
                            checked={project.bgCompleted}
                            readOnly
                          />
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Progress (%):</span>
                          {project.progress}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Status:</span>
                          <span className={`kpi-status ${project.status === 'Done' ? 'done' : 'in-progress'}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Amount To Give:</span>
                          {project.amountToGive}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Amount to be Received:</span>
                          {project.amountToBeReceived}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Revenue:</span>
                          {project.revenue}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Profit:</span>
                          {project.profit}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Loss:</span>
                          {project.loss}
                        </div>
                        <div className="kpi-table-column">
                          <span className="kpi-label-mobile">Expenditure:</span>
                          {project.expenditure}
                        </div>
                      </div>
                    ))
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

export default KPI;