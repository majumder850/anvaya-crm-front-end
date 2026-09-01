import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://anvaya-crm-phase-2.vercel.app/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data.data?.leads || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching leads:", err);
        setLoading(false);
      });
  }, []);

  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const displayedLeads = selectedFilter
    ? leads.filter((lead) => lead.status === selectedFilter)
    : leads.slice(0, 3); 

  return (
    <div className="container-fluid">
      <div className="row">
        <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse py-3 border-end min-vh-100">
          <div className="position-sticky">
            <h5 className="sidebar-heading px-3 text-muted">Anvaya CRM</h5>
            <ul className="nav flex-column mt-3">
              <li className="nav-item mb-1"><Link className="nav-link active fw-bold" to="/">Dashboard</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/leads">Lead List</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/leads/status">Leads by Status</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/agents/view">Sales Agent View</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/agents">Sales Agents</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/reports">Reports</Link></li>
            </ul>
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Anvaya CRM Dashboard</h1>
            <button className="btn btn-primary" onClick={() => navigate("/leads/new")}>
              Add New Lead 
            </button>
          </div>

          {loading ? (
            <p>Loading dashboard data...</p>
          ) : (
            <div>
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h4 className="card-title">Lead Status Overview</h4>
                  <ul className="list-group list-group-flush mt-3">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      New Leads <span className="badge bg-primary rounded-pill">{statusCounts["New"] || 0} Leads</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Contacted <span className="badge bg-secondary rounded-pill">{statusCounts["Contacted"] || 0} Leads</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Qualified <span className="badge bg-info text-dark rounded-pill">{statusCounts["Qualified"] || 0} Leads</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Proposal Sent <span className="badge bg-warning text-dark rounded-pill">{statusCounts["Proposal Sent"] || 0} Leads</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Closed <span className="badge bg-success rounded-pill">{statusCounts["Closed"] || 0} Leads</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0 me-2">Quick Filters:</h5>
                  <div className="btn-group" role="group">
                    {["New", "Contacted", "Qualified"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`btn btn-sm ${selectedFilter === status ? "btn-secondary" : "btn-outline-secondary"}`}
                        onClick={() => setSelectedFilter(selectedFilter === status ? null : status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  {selectedFilter && (
                    <button 
                      className="btn btn-link btn-sm text-decoration-none text-danger p-0 ms-2"
                      onClick={() => setSelectedFilter(null)}
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>

              <div className="row">
                <h5>
                  {selectedFilter ? `Filtered Leads (${selectedFilter})` : "Recent Leads"} (Click a card to view Lead Management)
                </h5>
                {displayedLeads.length === 0 ? (
                  <p className="text-muted">No leads found for status: {selectedFilter}</p>
                ) : (
                  displayedLeads.map((lead) => (
                    <div className="col-md-4 mb-3" key={lead._id}>
                      <div 
                        className="card h-100 shadow-sm" 
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/leads/${lead._id}`)}
                      >
                        <div className="card-body">
                          <h5 className="card-title">{lead.name}</h5>
                          <p className="card-text text-muted mb-1">Source: {lead.source}</p>
                          <span className="badge bg-dark">{lead.status}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;