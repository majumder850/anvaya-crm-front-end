import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://anvaya-crm-phase-2.vercel.app/api/leads")
      .then((res) => res.json())
      .then((data) => {
        const leadsData = data.data?.leads || [];
        setLeads(leadsData);
        setFilteredLeads(leadsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching lead list:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...leads];

    if (statusFilter) {
      result = result.filter((lead) => lead.status === statusFilter);
    }

    if (agentFilter) {
      result = result.filter(
        (lead) =>
          lead.salesAgent?._id === agentFilter ||
          lead.salesAgent?.name?.toLowerCase().includes(agentFilter.toLowerCase())
      );
    }

    if (sortBy === "priority") {
      const priorityWeight = { High: 1, Medium: 2, Low: 3 };
      result.sort((a, b) => (priorityWeight[a.priority] || 4) - (priorityWeight[b.priority] || 4));
    } else if (sortBy === "timeToClose") {
      result.sort((a, b) => a.timeToClose - b.timeToClose);
    }

    setFilteredLeads(result);
  }, [statusFilter, agentFilter, sortBy, leads]);

  if (loading) {
    return <div className="container mt-4"><p>Loading Lead List...</p></div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse py-3 border-end min-vh-100">
          <div className="position-sticky">
            <h5 className="sidebar-heading px-3 text-muted">Anvaya CRM</h5>
            <ul className="nav flex-column mt-3">
              <li className="nav-item mb-1"><Link className="nav-link" to="/">Dashboard</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link active fw-bold text-primary" to="/leads">Lead List</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/agents">Sales Agents</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/reports">Reports</Link></li>
            </ul>
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Lead List Overview</h1>
            <button className="btn btn-primary" onClick={() => navigate("/leads/new")}>
              Add New Lead 
            </button>
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
                <label className="form-label small fw-bold">Sort by:</label>
                <select 
                  className="form-select form-select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="priority">Priority (High to Low)</option>
                  <option value="timeToClose">Time to Close (Ascending)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="list-group shadow-sm">
            {filteredLeads.length === 0 ? (
              <div className="p-4 text-center bg-white border rounded">
                <p className="text-muted mb-0">No leads match your filter criteria.</p>
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
                    <span className="badge bg-info text-dark me-2">{lead.status}</span>
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

export default LeadList;