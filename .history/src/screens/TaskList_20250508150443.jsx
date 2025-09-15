import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Tasklist.css';

// Mock data for Project and Bidder Tasklists
const mockProjectTasks = [
  {
    taskName: 'PFEPL Boomerang Office Expansion',
    assignee: 'Karthik Nambiar',
    assigner: 'Elon Musk',
    dueDate: '2025-05-15T14:00:00',
    priority: 'High',
    project: 'MMRDC',
    actualCompletionDate: '2025-05-16T10:00:00',
    overDueDays: 1
  },
  {
    taskName: 'Budget Approval',
    assignee: 'Chris Hemsworth',
    assigner: 'Robert Downy Jr',
    dueDate: '2025-05-20T09:00:00',
    priority: 'Medium',
    project: 'Avengers',
    actualCompletionDate: '2025-05-08T10:00:00',
    overDueDays: null
  },
  {
    taskName: 'Bidding War with Russia',
    assignee: 'Ian Nepo',
    assigner: 'Putin',
    dueDate: '2025-05-10T16:00:00',
    priority: 'Low',
    project: 'Russian Takeover',
    actualCompletionDate: '2025-05-12T12:00:00',
    overDueDays: 2
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
    overDueDays: 0
  },
  {
    taskName: 'Attend Pre-Bid Meeting',
    assignee: 'Ivy Chen',
    assigner: 'Jack White',
    dueDate: '2025-05-12T10:00:00',
    priority: 'Medium',
    project: 'Project Beta',
    actualCompletionDate: '2025-05-12T10:00:00',
    overDueDays: 0
  },
  {
    taskName: 'Financial Bid Review',
    assignee: 'Kelly Adams',
    assigner: 'Liam Brown',
    dueDate: '2025-05-22T13:00:00',
    priority: 'High',
    project: 'Project Gamma',
    actualCompletionDate: null,
    overDueDays: null
  }
];

const Tasklist = () => {
  const [tasklistType, setTasklistType] = useState('project'); // 'project' or 'bidder'
  const navigate = useNavigate();

  const tasks = tasklistType === 'project' ? mockProjectTasks : mockBidderTasks;

  const handleTabChange = (type) => {
    setTasklistType(type);
  };

  const handleNavigateToTaskSummary = () => {
    navigate('/task-summary');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
  };

  const calculateOverDueDays = (dueDate, actualCompletionDate) => {
    if (!actualCompletionDate) {
      const today = new Date();
      const due = new Date(dueDate);
      if (today > due) {
        const diffTime = today - due;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      return 0;
    }
    const due = new Date(dueDate);
    const completed = new Date(actualCompletionDate);
    if (completed > due) {
      const diffTime = completed - due;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  return (
    <div className="tasklist-page">
      <Sidebar />
      <div className="tasklist-main">
        <div className="tasklist-content">
          <h1>Tasklist</h1>
          <div className="tasklist-header">
            <div className="tasklist-tabs">
              <button
                className={`tasklist-tab ${tasklistType === 'project' ? 'active' : ''}`}
                onClick={() => handleTabChange('project')}
              >
                Project Tasklist
              </button>
              <button
                className={`tasklist-tab ${tasklistType === 'bidder' ? 'active' : ''}`}
                onClick={() => handleTabChange('bidder')}
              >
                Bidder Tasklist
              </button>
            </div>
            <button
              className="tasklist-btn tasklist-summary-btn"
              onClick={handleNavigateToTaskSummary}
            >
              Task Summary
            </button>
          </div>

          {/* Task Table */}
          <div className="tasklist-table-container">
            {tasks.length === 0 ? (
              <div className="tasklist-empty">
                No tasks available.
              </div>
            ) : (
              <table className="tasklist-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Assignee</th>
                    <th>Assigner</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Project</th>
                    <th>Actual Completion Date</th>
                    <th>OverDue Days</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={index}>
                      <td>{task.taskName}</td>
                      <td>{task.assignee}</td>
                      <td>{task.assigner}</td>
                      <td>{formatDateTime(task.dueDate)}</td>
                      <td>
                        <span className={`priority-label priority-${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>{task.project}</td>
                      <td>{formatDateTime(task.actualCompletionDate)}</td>
                      <td>
                        {task.overDueDays !== null
                          ? task.overDueDays
                          : calculateOverDueDays(task.dueDate, task.actualCompletionDate)}
                      </td>
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

export default Tasklist;