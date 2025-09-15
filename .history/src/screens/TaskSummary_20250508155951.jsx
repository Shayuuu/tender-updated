import { useState } from 'react';
import Sidebar from './Sidebar';
import './TaskSummary.css';

const mockProjectTasks = [
  {
    taskName: 'Design Phase Review',
    assignee: 'Alice Johnson',
    assigner: 'Bob Smith',
    dueDate: '2025-05-15T14:00:00',
    priority: 'High',
    project: 'Project Alpha',
    actualCompletionDate: '2025-05-16T10:00:00',
    overDueDays: 1,
    status: 'completed'
  },
  {
    taskName: 'Budget Approval',
    assignee: 'Charlie Brown',
    assigner: 'David Wilson',
    dueDate: '2025-05-20T09:00:00',
    priority: 'Medium',
    project: 'Project Beta',
    actualCompletionDate: null,
    overDueDays: null,
    status: 'pending'
  },
  {
    taskName: 'Resource Allocation',
    assignee: 'Eve Davis',
    assigner: 'Frank Miller',
    dueDate: '2025-05-10T16:00:00',
    priority: 'Low',
    project: 'Project Gamma',
    actualCompletionDate: '2025-05-12T12:00:00',
    overDueDays: 2,
    status: 'completed'
  },
  {
    taskName: 'Site Inspection',
    assignee: 'Charlie Brown',
    assigner: 'David Wilson',
    dueDate: '2025-05-25T14:00:00',
    priority: 'High',
    project: 'Project Beta',
    actualCompletionDate: null,
    overDueDays: null,
    status: 'in-progress'
  }
];

const mockBidderTasks = [
  {
    taskName: 'Submit Bid Documents',
    assignee: 'Grace Lee',
    assigner: 'Henry Taylor',
    dueDate: '2025-05-18T11:00:00',
    priority: 'High',
    project: 'Project Alpha',
    actualCompletionDate: '2025-05-17T15:00:00',
    overDueDays: 0,
    status: 'completed'
  },
  {
    taskName: 'Attend Pre-Bid Meeting',
    assignee: 'Ivy Chen',
    assigner: 'Jack White',
    dueDate: '2025-05-12T10:00:00',
    priority: 'Medium',
    project: 'Project Beta',
    actualCompletionDate: '2025-05-12T10:00:00',
    overDueDays: 0,
    status: 'completed'
  },
  {
    taskName: 'Financial Bid Review',
    assignee: 'Kelly Adams',
    assigner: 'Liam Brown',
    dueDate: '2025-05-22T13:00:00',
    priority: 'High',
    project: 'Project Gamma',
    actualCompletionDate: null,
    overDueDays: null,
    status: 'pending'
  },
  {
    taskName: 'Clarification Meeting',
    assignee: 'Grace Lee',
    assigner: 'Henry Taylor',
    dueDate: '2025-05-20T09:00:00',
    priority: 'Medium',
    project: 'Project Alpha',
    actualCompletionDate: null,
    overDueDays: null,
    status: 'in-progress'
  }
];

// Mock overtime data for employees
const mockOvertimeData = {
  'Alice Johnson': 5,  // hours
  'Charlie Brown': 8,
  'Eve Davis': 3,
  'Grace Lee': 6,
  'Ivy Chen': 2,
  'Kelly Adams': 4
};

const TaskSummary = () => {
  const [tab, setTab] = useState('employee'); // 'employee', 'project', or 'summary'

  // Helper function to calculate task counts
  const calculateTaskCounts = (tasks, groupBy, groupValue) => {
    const filteredTasks = groupValue
      ? tasks.filter(task => task[groupBy] === groupValue)
      : tasks;
    
    const pending = filteredTasks.filter(task => task.status === 'pending').length;
    const inProgress = filteredTasks.filter(task => task.status === 'in-progress').length;
    const completed = filteredTasks.filter(task => task.status === 'completed').length;
    
    return { pending, inProgress, completed };
  };

  // Data for Project Tab
  const projectData = [];
  const allProjects = [...new Set([...mockProjectTasks, ...mockBidderTasks].map(task => task.project))];
  
  allProjects.forEach(project => {
    // Project Tasks
    const projectTasks = calculateTaskCounts(mockProjectTasks, 'project', project);
    if (projectTasks.pending > 0 || projectTasks.inProgress > 0 || projectTasks.completed > 0) {
      projectData.push({
        section: 'Project',
        projectName: project,
        ...projectTasks
      });
    }
    
    // Bidder Tasks
    const bidderTasks = calculateTaskCounts(mockBidderTasks, 'project', project);
    if (bidderTasks.pending > 0 || bidderTasks.inProgress > 0 || bidderTasks.completed > 0) {
      projectData.push({
        section: 'Bidder',
        projectName: project,
        ...bidderTasks
      });
    }
  });

  // Data for Employee Tab
  const employeeData = [];
  const allEmployees = [...new Set([...mockProjectTasks, ...mockBidderTasks].map(task => task.assignee))];
  
  allEmployees.forEach(employee => {
    const employeeProjects = [...new Set(
      [...mockProjectTasks, ...mockBidderTasks]
        .filter(task => task.assignee === employee)
        .map(task => task.project)
    )];
    
    employeeProjects.forEach(project => {
      // Project Tasks
      const projectTasks = calculateTaskCounts(
        mockProjectTasks.filter(task => task.assignee === employee),
        'project',
        project
      );
      if (projectTasks.pending > 0 || projectTasks.inProgress > 0 || projectTasks.completed > 0) {
        employeeData.push({
          section: 'Project',
          projectName: project,
          ...projectTasks,
          overtime: mockOvertimeData[employee] || 0
        });
      }
      
      // Bidder Tasks
      const bidderTasks = calculateTaskCounts(
        mockBidderTasks.filter(task => task.assignee === employee),
        'project',
        project
      );
      if (bidderTasks.pending > 0 || bidderTasks.inProgress > 0 || bidderTasks.completed > 0) {
        employeeData.push({
          section: 'Bidder',
          projectName: project,
          ...bidderTasks,
          overtime: mockOvertimeData[employee] || 0
        });
      }
    });
  });

  // Data for Summary Tab
  const summaryData = [
    {
      section: 'Project',
      ...calculateTaskCounts(mockProjectTasks)
    },
    {
      section: 'Bidder',
      ...calculateTaskCounts(mockBidderTasks)
    }
  ];

  const handleTabChange = (selectedTab) => {
    setTab(selectedTab);
  };

  // Select data based on active tab
  const tableData = tab === 'project' ? projectData : tab === 'employee' ? employeeData : summaryData;

  return (
    <div className="task-summary-page">
      <Sidebar />
      <div className="task-summary-main">
        <div className="task-summary-content">
          <h1>Task Summary</h1>
          <div className="task-summary-tabs">
            <button
              className={`task-summary-tab ${tab === 'employee' ? 'active' : ''}`}
              onClick={() => handleTabChange('employee')}
            >
              Employee
            </button>
            <button
              className={`task-summary-tab ${tab === 'project' ? 'active' : ''}`}
              onClick={() => handleTabChange('project')}
            >
              Project
            </button>
            <button
              className={`task-summary-tab ${tab === 'summary' ? 'active' : ''}`}
              onClick={() => handleTabChange('summary')}
            >
              Summary
            </button>
          </div>

          {/* Task Table */}
          <div className="task-summary-table-container">
            {tableData.length === 0 ? (
              <div className="task-summary-empty">
                No data available.
              </div>
            ) : (
              <table className="task-summary-table">
                <thead>
                  <tr>
                    <th>Section</th>
                    {tab !== 'summary' && <th>Project Name</th>}
                    <th>Pending Tasks</th>
                    <th>In Progress Tasks</th>
                    <th>Completed Tasks</th>
                    {tab === 'employee' && <th>Overtime (Hours)</th>}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.section}</td>
                      {tab !== 'summary' && <td>{row.projectName}</td>}
                      <td>{row.pending}</td>
                      <td>{row.inProgress}</td>
                      <td>{row.completed}</td>
                      {tab === 'employee' && <td>{row.overtime}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskSummary;