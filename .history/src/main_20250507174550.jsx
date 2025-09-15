import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './screens/Login'
import Home from './screens/Home'
import Bidders from './screens/Bidders'
import FormDetails from './screens/FormDetails'
import Extension from './screens/Extension'
import BidderDetails from './screens/BidderDetails'
import Milestone from './screens/Milestone'
import Task from './screens/Task'
import BidderTaskList from './screens/BidderTaskList'
import Project from './screens/project/Project'
import ProjectForms from './screens/project/ProjectForms'
import ProjectCompletionDates from './screens/project/ProjectCompletionDates'
import ProjectRunningAccount from './screens/project/ProjectRunningAccount'
import ProjectExpenses from './screens/project/ProjectExpenses'
import ProjectVariations from './screens/project/ProjectVariations'
import ProjectNotes from './screens/project/ProjectNotes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bidders" element={<Bidders />} />
        <Route path="/bidders/:id" element={<FormDetails />} />
        <Route path="/extension-dates/:id" element={<Extension />} />
        <Route path="/bidder-details/:id" element={<BidderDetails />} />
        <Route path="/milestone-tracker/:id" element={<Milestone />} />
        <Route path="/bidder-tasklist" element={<BidderTaskList />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/projects/:id" element={<ProjectForms />} />
        <Route path="/project-completion-dates/:id" element={<ProjectCompletionDates />} />
        <Route path="/project-running-account/:id" element={<ProjectRunningAccount />} />
        <Route path="/project-expenses/:id" element={<ProjectExpenses />} />
        <Route path="/project-variations/:id" element={<ProjectVariations />} />
        <Route path="/project-notes/:id" element={<ProjectNotes />} />
        <Route path="/tasks" element={<Task />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)