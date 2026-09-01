import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import LeadManagement from "./LeadManagement";
import LeadList from "./LeadList";
import AddLead from "./AddLead";
import LeadStatusView from "./LeadStatusView";
import SalesAgentView from "./SalesAgentView";
import SalesAgents from "./SalesAgents";
import Reports from "./Reports";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<LeadList />} />
          <Route path="/leads/new" element={<AddLead />} />
          <Route path="/leads/status" element={<LeadStatusView />} />
          <Route path="/agents/view" element={<SalesAgentView />} />
          <Route path="/leads/:leadId" element={<LeadManagement />} />
          <Route path="/agents" element={<SalesAgents />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
