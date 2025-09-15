import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Home from './screens/Home.jsx'
import Bidders from './screens/Bidders.jsx'
import Projects from './screens/Projects.jsx'
import Tasks from './screens/Tasks.jsx'
import Extension from './screens/Extension.jsx'
import BidderDetails from './screens/BidderDetails.jsx'
import Milestone from './screens/Milestone.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bidders" element={<Bidders />} />
        <Route path="/bidders/:id" element={<Bidders />} />
        <Route path="/extension-dates/:id" element={<Extension />} />
        <Route path="/bidder-details/:id" element={<BidderDetails />} />
        <Route path="/milestone-tracker/:id" element={<Milestone />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  </React.StrictMode>
)