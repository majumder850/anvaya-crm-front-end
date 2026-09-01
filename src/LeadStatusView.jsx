import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const LeadStatusView = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState("New");
  const [agentFilter, setAgentFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("timeToClose");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://anvaya-crm-phase-2.vercel.app/api/leads")
      .then((res) => res.json())
      .then((data) => {
        const leadsData = data.data?.leads || [];
        setLeads(leadsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching leads by status:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = leads.filter((lead) => lead.status === selectedStatus);

    if (agentFilter) {
      result = result.filter(
        (lead) =>
          lead.salesAgent?._id === agentFilter ||
          lead.salesAgent?.name?.toLowerCase().includes(agentFilter.toLowerCase())
      );
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
  }, [selectedStatus, agentFilter, priorityFilter, sortBy, leads]);

  if (loading) {
    return <div className="container mt-4"><p>Loading Leads by Status...</p></div>;
  }

  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse py-3 border-end min-vh-100">
          <div className="position-sticky">
            <h5 className="sidebar-heading px-3 text-muted">Anvaya CRM</h5>
            <ul className="nav flex-column mt-3">
              <li className="nav-item mb-1"><Link className="nav-link" to="/">Dashboard</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/leads">Lead List</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link active fw-bold text-primary" to="/leads/status">Leads by Status</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/agents">Sales Agents</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/reports">Reports</Link></li>
            </ul>
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Leads by Status: {selectedStatus}</h1>
            <button className="btn btn-primary" onClick={() => navigate("/leads/new")}>
              Add New Lead
            </button>
          </div>

          <div className="mb-4">
            <ul className="nav nav-pills">
              {statuses.map((status) => (
                <li className="nav-item me-2" key={status}>
                  <button
                    className={`btn btn-sm ${selectedStatus === status ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card bg-light p-3 mb-4 shadow-sm">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-bold">Filter by Sales Agent:</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Enter agent name..."
                  value={agentFilter}
                  onChange={(e) => setAgentFilter(e.target.value)}
                />
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
                <p className="text-muted mb-0">No leads found for status: {selectedStatus}</p>
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
                    <span className="badge bg-secondary">{lead.salesAgent?.name || "Unassigned"}</span>
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

export default LeadStatusView;