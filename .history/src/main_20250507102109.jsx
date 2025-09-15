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
        <Route path="/projects" element={<Home />} />
        <Route path="/tasks" element={<Task />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)