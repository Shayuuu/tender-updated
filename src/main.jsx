import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './screens/Login'
import Home from './screens/Home'
import Bidders from './screens/Bidders'
import FormManager from './screens/FormManger'
import Extension from './screens/Extension'
import BidderDetails from './screens/BidderDetails'
import Milestone from './screens/Milestone'
import Task from './screens/Task'
import TaskList from './screens/TaskList'
import Project from './screens/project/Project'
import Forms from './screens/project/Forms'
import TaskSummary from './screens/TaskSummary'
import KPI from './screens/KPI'
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />

        {/* Bidder Section */}
        <Route path="/bidders" element={<Bidders />} />
        <Route path="/bidders/:id" element={<FormManager />} />
        <Route path="/extension-dates/:id" element={<Extension />} />
        <Route path="/bidder-details/:id" element={<BidderDetails />} />
        <Route path="/milestone-tracker/:id" element={<Milestone />} />

        {/* Project Section (only Combined Form tab visible in sidebar) */}
        <Route path="/projects" element={<Project />} />
        <Route path="/forms/:id" element={<Forms />} />

        {/* Tasks */}
        <Route path="/tasklist" element={<TaskList />} />
        <Route path="/tasks" element={<Task />} />

        {/* Misc */}
        <Route path="/task-summary" element={<TaskSummary />} />
        <Route path="/kpi" element={<KPI />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  </StrictMode>
)
