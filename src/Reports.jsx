import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Reports = () => {
  const [leads, setLeads] = useState([]);
  const [pipelineCount, setPipelineCount] = useState(0);
  const [lastWeekLeads, setLastWeekLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const fetchLeadsData = fetch("https://anvaya-crm-phase-2.vercel.app/api/leads").then((res) => res.json());
    
    const fetchPipelineData = fetch("https://anvaya-crm-phase-2.vercel.app/api/report/pipeline").then((res) => res.json());

    const fetchLastWeekData = fetch("https://anvaya-crm-phase-2.vercel.app/api/report/last-week").then((res) => res.json());

    Promise.all([fetchLeadsData, fetchPipelineData, fetchLastWeekData])
      .then(([leadsRes, pipelineRes, lastWeekRes]) => {
        setLeads(leadsRes.data?.leads || []);
        setPipelineCount(pipelineRes.totalLeadsInPipeline || 0);
        setLastWeekLeads(Array.isArray(lastWeekRes) ? lastWeekRes : lastWeekRes.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching report data:", err);
        setLoading(false);
      });
  }, []);


  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const closedCount = statusCounts["Closed"] || 0;


  const closedByAgent = leads
    .filter((lead) => lead.status === "Closed")
    .reduce((acc, lead) => {
      const agentName = lead.salesAgent?.name || "Unassigned";
      acc[agentName] = (acc[agentName] || 0) + 1;
      return acc;
    }, {});

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading Reports...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
       
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse py-3 border-end min-vh-100">
          <div className="position-sticky">
            <h5 className="sidebar-heading px-3 text-muted">Anvaya CRM</h5>
            <ul className="nav flex-column mt-3">
              <li className="nav-item mb-1">
                <Link className="nav-link" to="/">Dashboard</Link>
              </li>
              <li className="nav-item mb-1">
                <Link className="nav-link" to="/leads">Lead List</Link>
              </li>
              <li className="nav-item mb-1">
                <Link className="nav-link" to="/agents">Sales Agents</Link>
              </li>
              <li className="nav-item mb-1">
                <Link className="nav-link active fw-bold text-primary" to="/reports">Reports</Link>
              </li>
            </ul>
          </div>
        </nav>

   
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Anvaya CRM Reports</h1>
          </div>

          {/* Pipeline & Closed Overview */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <div className="card shadow-sm h-100 border-primary">
                <div className="card-body">
                  <h5 className="card-title text-muted">Total Leads in Pipeline</h5>
                  <h2 className="display-4 fw-bold text-primary">{pipelineCount}</h2>
                  <p className="card-text small text-muted">Active leads across all stages (excluding Closed).</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="card shadow-sm h-100 border-success">
                <div className="card-body">
                  <h5 className="card-title text-muted">Total Closed Leads</h5>
                  <h2 className="display-4 fw-bold text-success">{closedCount}</h2>
                  <p className="card-text small text-muted">Leads successfully brought to closure.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leads Closed Last Week */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="card-title mb-3">Leads Closed Last Week (Last 7 Days)</h4>
              {lastWeekLeads.length === 0 ? (
                <p className="text-muted">No leads were closed in the last 7 days.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                        <th>Lead Name</th>
                        <th>Sales Agent</th>
                        <th>Closed Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastWeekLeads.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td>{item.name}</td>
                          <td>{item.salesAgent?.name || item.salesAgent || "N/A"}</td>
                          <td>{new Date(item.closedAt || item.updatedAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          
          <div className="row">
            {/* Lead Status Distribution */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h4 className="card-title mb-3">Lead Status Distribution</h4>
                  <ul className="list-group list-group-flush">
                    {Object.entries(statusCounts).map(([status, count]) => (
                      <li key={status} className="list-group-item d-flex justify-content-between align-items-center">
                        {status}
                        <span className="badge bg-secondary rounded-pill">{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Leads Closed by Sales Agent */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h4 className="card-title mb-3">Leads Closed by Sales Agent</h4>
                  {Object.keys(closedByAgent).length === 0 ? (
                    <p className="text-muted">No closed leads data available for agents.</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {Object.entries(closedByAgent).map(([agent, count]) => (
                        <li key={agent} className="list-group-item d-flex justify-content-between align-items-center">
                          {agent}
                          <span className="badge bg-success rounded-pill">{count} Closed</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;