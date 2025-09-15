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
import Forms from './screens/project/Forms'
import Dates from './screens/project/Dates'
import Account from './screens/project/Account'
import Expenses from './screens/project/Expenses'
import Variations from './screens/project/Variations'
import Notes from './screens/project/Notes'

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
        <Route path="/forms/:id" element={<Forms />} />
        <Route path="/dates/:id" element={<Dates />} />
        <Route path="/account/:id" element={<Account />} />
        <Route path="/expenses/:id" element={<Expenses />} />
        <Route path="/variations/:id" element={<Variations />} />
        <Route path="/notes/:id" element={<Notes />} />
        <Route path="/tasks" element={<Task />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)