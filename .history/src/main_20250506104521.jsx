import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import Home from './screens/Home';
import Bidders from './screens/Bidders';
import FormDetails from './screens/FormDetails';
// Placeholder components
import ExtensionDates from './screens/ExtensionDates';
import BidderDetails from './screens/BidderDetails';
import MilestoneTracker from './screens/MilestoneTracker';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bidders" element={<Bidders />} />
        <Route path="/form-details" element={<FormDetails />} />
        <Route path="/extension-dates" element={<ExtensionDates />} />
        <Route path="/bidder-details" element={<BidderDetails />} />
        <Route path="/milestone-tracker" element={<MilestoneTracker />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;