import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SalesAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAgents = () => {
    fetch("https://anvaya-crm-phase-2.vercel.app/api/agents")
      .then((res) => res.json())
      .then((data) => {
        const agentList = Array.isArray(data) ? data : data.data?.agents || [];
        setAgents(agentList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sales agents:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAgent = (e) => {
    e.preventDefault();
    setSubmitting(true);

    fetch("https://anvaya-crm-phase-2.vercel.app/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create agent");
        return res.json();
      })
      .then(() => {
        alert("Sales Agent added successfully!");
        setFormData({ name: "", email: "" });
        setShowAddForm(false);
        setSubmitting(false);
        fetchAgents();
      })
      .catch((err) => {
        console.error("Error creating agent:", err);
        alert("Failed to add sales agent. Email might already exist.");
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading Sales Agents...</p>
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
                <Link className="nav-link active fw-bold text-primary" to="/agents">Sales Agents</Link>
              </li>
              <li className="nav-item mb-1">
                <Link className="nav-link" to="/reports">Reports</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Sales Agent Management</h1>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? "Cancel" : "Add New Agent"}
            </button>
          </div>

          {showAddForm && (
            <div className="card shadow-sm p-4 mb-4 col-md-8 bg-light">
              <h4 className="card-title mb-3">Add New Sales Agent</h4>
              <form onSubmit={handleCreateAgent}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Agent Name:</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email Address:</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create Agent"}
                </button>
              </form>
            </div>
          )}

          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Sales Agent List</h4>
              {agents.length === 0 ? (
                <p className="text-muted">No sales agents found.</p>
              ) : (
                <div className="list-group">
                  {agents.map((agent) => (
                    <div
                      key={agent.id || agent._id}
                      className="list-group-item d-flex justify-content-between align-items-center py-3"
                    >
                      <div>
                        <h5 className="mb-1 text-primary">{agent.name}</h5>
                        <p className="mb-0 text-muted small">
                          Email: <strong>{agent.email}</strong>
                        </p>
                      </div>
                      <span className="badge bg-secondary">
                        Joined: {new Date(agent.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalesAgents;