import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

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

  const totalLeadsCount = leads.length || 1;
  const statusConfig = [
    { label: "New", color: "#0d6efd", count: statusCounts["New"] || 0 },
    { label: "Contacted", color: "#6c757d", count: statusCounts["Contacted"] || 0 },
    { label: "Qualified", color: "#0dcaf0", count: statusCounts["Qualified"] || 0 },
    { label: "Proposal Sent", color: "#ffc107", count: statusCounts["Proposal Sent"] || 0 },
    { label: "Closed", color: "#198754", count: statusCounts["Closed"] || 0 },
  ];

  const agentEntries = Object.entries(closedByAgent);
  const maxAgentCount = Math.max(...agentEntries.map(([, count]) => count), 1);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const closedTimeline = last7Days.map((dateStr) => {
    const count = lastWeekLeads.filter((item) => {
      const itemDate = new Date(item.closedAt || item.updatedAt).toISOString().split("T")[0];
      return itemDate === dateStr;
    }).length;
    const parts = dateStr.split("-");
    return { label: `${parts[1]}/${parts[2]}`, count };
  });

  const maxTimelineCount = Math.max(...closedTimeline.map((item) => item.count), 1);

  if (loading) {
    return <div className="container mt-4"><p>Loading Reports...</p></div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Anvaya CRM Reports</h1>
          </div>

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

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">Leads Closed Last Week (Last 7 Days)</h4>
              <div className="d-flex align-items-end justify-content-between pt-4 pb-2 px-3 border-bottom" style={{ height: "220px" }}>
                {closedTimeline.map((item, idx) => {
                  const barHeight = Math.max((item.count / maxTimelineCount) * 150, item.count > 0 ? 16 : 4);
                  return (
                    <div key={idx} className="d-flex flex-column align-items-center flex-fill mx-1">
                      <span className="small fw-bold text-primary mb-1">{item.count}</span>
                      <div
                        style={{
                          height: `${barHeight}px`,
                          width: "36px",
                          backgroundColor: item.count > 0 ? "#0d6efd" : "#e9ecef",
                          borderRadius: "4px 4px 0 0",
                          transition: "height 0.3s ease",
                        }}
                      />
                      <span className="small text-muted mt-2">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h4 className="card-title mb-3">Lead Status Distribution</h4>
                  <div className="mt-3">
                    {statusConfig.map((item, idx) => {
                      const percentage = Math.round((item.count / totalLeadsCount) * 100);
                      return (
                        <div key={idx} className="mb-3">
                          <div className="d-flex justify-content-between small fw-bold mb-1">
                            <span>{item.label}</span>
                            <span>{item.count} ({percentage}%)</span>
                          </div>
                          <div className="progress" style={{ height: "10px" }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${percentage}%`, backgroundColor: item.color }}
                              aria-valuenow={percentage}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h4 className="card-title mb-3">Leads Closed by Sales Agent</h4>
                  {agentEntries.length === 0 ? (
                    <p className="text-muted mt-3">No closed leads data available for agents.</p>
                  ) : (
                    <div className="mt-3">
                      {agentEntries.map(([agent, count], idx) => {
                        const widthPct = Math.round((count / maxAgentCount) * 100);
                        return (
                          <div key={idx} className="mb-3">
                            <div className="d-flex justify-content-between small fw-bold mb-1">
                              <span>{agent}</span>
                              <span className="text-success">{count} Closed</span>
                            </div>
                            <div className="progress" style={{ height: "10px" }}>
                              <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${widthPct}%` }}
                                aria-valuenow={widthPct}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
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