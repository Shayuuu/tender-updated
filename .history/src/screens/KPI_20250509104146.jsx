import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './KPI.css';

const KPI = () => {
  // Updated mock data for Bidder Section (more realistic)
  const bidderData = [
    {
      bidderName: 'Tata Projects Ltd.',
      bidderCode: 'TPL-2023-001',
      projectName: 'Mumbai Metro Line 4',
      tenderAmount: '₹1,25,00,00,000',
      bgEdrDueDate: '2025-06-30',
      alerts: 'Due in 45 days',
      bgEdrDueAmount: '₹12,50,00,000',
      bgEdrReturned: 'No'
    },
    {
      bidderName: 'Larsen & Toubro',
      bidderCode: 'LNT-2024-015',
      projectName: 'Delhi-Agra Expressway',
      tenderAmount: '₹2,50,00,00,000',
      bgEdrDueDate: '2025-05-15',
      alerts: 'Overdue',
      bgEdrDueAmount: '₹25,00,00,000',
      bgEdrReturned: 'Yes'
    },
    {
      bidderName: 'Gammon India',
      bidderCode: 'GI-2023-008',
      projectName: 'Chennai Port Expansion',
      tenderAmount: '₹80,00,00,000',
      bgEdrDueDate: '2025-08-01',
      alerts: 'Due in 75 days',
      bgEdrDueAmount: '₹8,00,00,000',
      bgEdrReturned: 'No'
    }
  ];

  // Updated mock data for Project Section (more realistic)
  const projectData = [
    {
      projectName: 'Mumbai Metro Line 4',
      projectCode: 'MM4-2023-001',
      edCompleted: true,
      fdCompleted: false,
      bgCompleted: true,
      progress: 78.5,
      status: 'In Progress',
      amountToGive: '₹15,75,00,000',
      amountToBeReceived: '₹22,30,00,000',
      revenue: '₹1,40,00,00,000',
      profit: '₹28,50,00,000',
      loss: '₹3,20,00,000',
      expenditure: '₹1,08,30,00,000'
    },
    {
      projectName: 'Delhi-Agra Expressway',
      projectCode: 'DAE-2022-003',
      edCompleted: false,
      fdCompleted: true,
      bgCompleted: false,
      progress: 42.3,
      status: 'In Progress',
      amountToGive: '₹32,10,00,000',
      amountToBeReceived: '₹45,60,00,000',
      revenue: '₹2,10,00,00,000',
      profit: '₹36,80,00,000',
      loss: '₹9,50,00,000',
      expenditure: '₹1,63,70,00,000'
    },
    {
      projectName: 'Chennai Port Expansion',
      projectCode: 'CPE-2021-007',
      edCompleted: true,
      fdCompleted: true,
      bgCompleted: true,
      progress: 100,
      status: 'Done',
      amountToGive: '₹6,40,00,000',
      amountToBeReceived: '₹9,80,00,000',
      revenue: '₹95,00,00,000',
      profit: '₹19,20,00,000',
      loss: '₹0',
      expenditure: '₹75,80,00,000'
    }
  ];

  const [view, setView] = useState('Bidder'); // Toggle between 'Bidder' and 'Project'

  const handleToggleView = (selectedView) => {
    setView(selectedView);
  };

  return (
    <div className="kpi-page">
      <Sidebar />
      <div className="kpi-main">
        <div className="kpi-content">
          <h1>KPI Dashboard</h1>

          {/* New Slider for Bidder/Project */}
          <div className="kpi-slider-section">
            <div className="kpi-slider">
              <div
                className={`kpi-slider-option ${view === 'Bidder' ? 'active' : ''}`}
                onClick={() => handleToggleView('Bidder')}
              >
                Bidder
              </div>
              <div
                className={`kpi-slider-option ${view === 'Project' ? 'active' : ''}`}
                onClick={() => handleToggleView('Project')}
              >
                Project
              </div>
              <div
                className="kpi-slider-background"
                style={{
                  transform: view === 'Bidder' ? 'translateX(0)' : 'translateX(100%)',
                }}
              />
            </div>
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
                  <div className="kpi-table-column project-name">Project Name</div>
                  <div className="kpi-table-column project-code">Project Code</div>
                  <div className="kpi-table-column ed-column">ED</div>
                  <div className="kpi-table-column fd-column">FD</div>
                  <div className="kpi-table-column bg-column">BG</div>
                  <div className="kpi-table-column progress-column">Progress (%)</div>
                  <div className="kpi-table-column status-column">Status</div>
                  <div className="kpi-table-column amount-column">Amount To Give</div>
                  <div className="kpi-table-column amount-column">Amount to be Received</div>
                  <div className="kpi-table-column amount-column">Revenue</div>
                  <div className="kpi-table-column amount-column">Profit</div>
                  <div className="kpi-table-column amount-column">Loss</div>
                  <div className="kpi-table-column amount-column">Expenditure</div>
                </div>
                <div className="kpi-table-body">
                  {projectData.length === 0 ? (
                    <div className="kpi-empty">No project data available.</div>
                  ) : (
                    projectData.map((project, index) => (
                      <div key={index} className="kpi-table-row">
                        <div className="kpi-table-column project-name">
                          <span className="kpi-label-mobile">Project Name:</span>
                          {project.projectName}
                        </div>
                        <div className="kpi-table-column project-code">
                          <span className="kpi-label-mobile">Project Code:</span>
                          {project.projectCode}
                        </div>
                        <div className="kpi-table-column ed-column">
                          <span className="kpi-label-mobile">ED:</span>
                          <span className={`kpi-checkbox ${project.edCompleted ? 'checked' : ''}`}>
                            {project.edCompleted ? '✔' : '✖'}
                          </span>
                        </div>
                        <div className="kpi-table-column fd-column">
                          <span className="kpi-label-mobile">FD:</span>
                          <span className={`kpi-checkbox ${project.fdCompleted ? 'checked' : ''}`}>
                            {project.fdCompleted ? '✔' : '✖'}
                          </span>
                        </div>
                        <div className="kpi-table-column bg-column">
                          <span className="kpi-label-mobile">BG:</span>
                          <span className={`kpi-checkbox ${project.bgCompleted ? 'checked' : ''}`}>
                            {project.bgCompleted ? '✔' : '✖'}
                          </span>
                        </div>
                        <div className="kpi-table-column progress-column">
                          <span className="kpi-label-mobile">Progress (%):</span>
                          {project.progress}
                        </div>
                        <div className="kpi-table-column status-column">
                          <span className="kpi-label-mobile">Status:</span>
                          <span className={`kpi-status ${project.status === 'Done' ? 'done' : 'in-progress'}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="kpi-table-column amount-column">
                          <span className="kpi-label-mobile">Amount To Give:</span>
                          {project.amountToGive}
                        </div>
                        <div className="kpi-table-column amount-column">
                          <span className="kpi-label-mobile">Amount to be Received:</span>
                          {project.amountToBeReceived}
                        </div>
                        <div className="kpi-table-column amount-column">
                          <span className="kpi-label-mobile">Revenue:</span>
                          {project.revenue}
                        </div>
                        <div className="kpi-table-column amount-column">
                          <span className="kpi-label-mobile">Profit:</span>
                          {project.profit}
                        </div>
                        <div className="kpi-table-column amount-column">
                          <span className="kpi-label-mobile">Loss:</span>
                          {project.loss}
                        </div>
                        <div className="kpi-table-column amount-column">
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