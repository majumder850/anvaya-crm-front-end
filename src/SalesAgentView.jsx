import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SalesAgentView = () => {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("timeToClose");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = fetch("https://anvaya-crm-phase-2.vercel.app/api/leads").then((res) => res.json());
    const fetchAgents = fetch("https://anvaya-crm-phase-2.vercel.app/api/agents").then((res) => res.json());

    Promise.all([fetchLeads, fetchAgents])
      .then(([leadsData, agentsData]) => {
        const leadList = leadsData.data?.leads || [];
        const agentList = Array.isArray(agentsData) ? agentsData : agentsData.data?.agents || [];
        
        setLeads(leadList);
        setAgents(agentList);

        if (agentList.length > 0) {
          setSelectedAgentId(agentList[0].id || agentList[0]._id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data for Sales Agent View:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = leads.filter((lead) => {
      const agentId = lead.salesAgent?._id || lead.salesAgent;
      return agentId === selectedAgentId;
    });

    if (statusFilter) {
      result = result.filter((lead) => lead.status === statusFilter);
    }

    if (priorityFilter) {
      result = result.filter((lead) => lead.priority === priorityFilter);
    }

    if (sortBy === "timeToClose") {
      result.sort((a, b) => (a.timeToClose || 0) - (b.timeToClose || 0));
    } else if (sortBy === "priority") {
      const priorityWeight = { High: 1, Medium: 2, Low: 3 };
      result.sort((a, b) => (priorityWeight[a.priority] || 4) - (priorityWeight[b.priority] || 4));
    }

    setFilteredLeads(result);
  }, [selectedAgentId, statusFilter, priorityFilter, sortBy, leads]);

  if (loading) {
    return <div className="container mt-4"><p>Loading Sales Agent View...</p></div>;
  }

  const currentAgent = agents.find((a) => (a.id || a._id) === selectedAgentId);

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse py-3 border-end min-vh-100">
          <div className="position-sticky">
            <h5 className="sidebar-heading px-3 text-muted">Anvaya CRM</h5>
            <ul className="nav flex-column mt-3">
              <li className="nav-item mb-1"><Link className="nav-link" to="/">Dashboard</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/leads">Lead List</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/leads/status">Leads by Status</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link active fw-bold text-primary" to="/agents/view">Sales Agent View</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/agents">Sales Agents</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/reports">Reports</Link></li>
            </ul>
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Leads by Sales Agent: {currentAgent?.name || "Agent"}</h1>
            <button className="btn btn-primary" onClick={() => navigate("/leads/new")}>
              Add New Lead
            </button>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Select Sales Agent:</label>
            <select
              className="form-select w-50"
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
            >
              {agents.map((agent) => (
                <option key={agent.id || agent._id} value={agent.id || agent._id}>
                  {agent.name} ({agent.email})
                </option>
              ))}
            </select>
          </div>

          <div className="card bg-light p-3 mb-4 shadow-sm">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-bold">Filter by Status:</label>
                <select
                  className="form-select form-select-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">Filter by Priority:</label>
                <select
                  className="form-select form-select-sm"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">Sort by:</label>
                <select
                  className="form-select form-select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="timeToClose">Time to Close (Ascending)</option>
                  <option value="priority">Priority (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="list-group shadow-sm">
            {filteredLeads.length === 0 ? (
              <div className="p-4 text-center bg-white border rounded">
                <p className="text-muted mb-0">No leads assigned to this sales agent matching your filters.</p>
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/leads/${lead._id}`)}
                >
                  <div>
                    <h5 className="mb-1 text-primary">{lead.name}</h5>
                    <p className="mb-1 text-muted small">
                      Source: <strong>{lead.source}</strong> | Priority: <strong>{lead.priority}</strong> | Close Time: <strong>{lead.timeToClose} Days</strong>
                    </p>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-info text-dark">{lead.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalesAgentView;