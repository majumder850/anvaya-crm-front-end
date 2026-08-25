import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import LeadManagement from "./LeadManagement";
import LeadList from "./LeadList";
import AddLead from "./AddLead";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/leads" element={<LeadList />} />

          <Route path="/leads/new" element={<AddLead />} />

          <Route path="/leads/:leadId" element={<LeadManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
