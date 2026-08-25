import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AddLead = () => {
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    source: "Website",
    salesAgent: "",
    status: "New",
    priority: "Medium",
    timeToClose: "",
    tags: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    fetch("https://anvaya-crm-phase-2.vercel.app/api/agents")
      .then((res) => res.json())
      .then((data) => {
        setAgents(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching sales agents:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

   
    const formattedTags = formData.tags
      ? formData.tags.split(",").map((t) => t.trim())
      : [];

    const payload = {
      name: formData.name,
      source: formData.source,
      salesAgent: formData.salesAgent || undefined,
      status: formData.status,
      priority: formData.priority,
      timeToClose: Number(formData.timeToClose),
      tags: formattedTags,
    };

    fetch("https://anvaya-crm-phase-2.vercel.app/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Lead created successfully!");
        navigate("/leads"); 
      })
      .catch((err) => {
        console.error("Error creating lead:", err);
        alert("Failed to create lead.");
        setSubmitting(false);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
      
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse py-3 border-end min-vh-100">
          <div className="position-sticky">
            <h5 className="sidebar-heading px-3 text-muted">Anvaya CRM</h5>
            <ul className="nav flex-column mt-3">
              <li className="nav-item mb-1"><Link className="nav-link" to="/">Dashboard</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link" to="/leads">Lead List</Link></li>
              <li className="nav-item mb-1"><Link className="nav-link active fw-bold text-primary" to="/leads/new">Add New Lead</Link></li>
            </ul>
          </div>
        </nav>

        
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Add New Lead</h1>
          </div>

          <div className="card shadow-sm p-4 col-md-8">
            <form onSubmit={handleSubmit}>
              {/* Lead Name */}
              <div className="mb-3">
                <label className="form-label fw-bold">Lead Name:</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Acme Corp"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Lead Source */}
              <div className="mb-3">
                <label className="form-label fw-bold">Lead Source:</label>
                <select
                  name="source"
                  className="form-select"
                  value={formData.source}
                  onChange={handleChange}
                >
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Sales Agent Selection */}
              <div className="mb-3">
                <label className="form-label fw-bold">Sales Agent:</label>
                <select
                  name="salesAgent"
                  className="form-select"
                  value={formData.salesAgent}
                  onChange={handleChange}
                >
                  <option value="">Select Sales Agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lead Status */}
              <div className="mb-3">
                <label className="form-label fw-bold">Lead Status:</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Priority */}
              <div className="mb-3">
                <label className="form-label fw-bold">Priority:</label>
                <select
                  name="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Time to Close */}
              <div className="mb-3">
                <label className="form-label fw-bold">Time to Close (Number of Days):</label>
                <input
                  type="number"
                  name="timeToClose"
                  className="form-control"
                  placeholder="e.g. 30"
                  min="1"
                  value={formData.timeToClose}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Tags */}
              <div className="mb-3">
                <label className="form-label fw-bold">Tags (comma-separated):</label>
                <input
                  type="text"
                  name="tags"
                  className="form-control"
                  placeholder="High Value, Follow-up"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>

          
              <button type="submit" className="btn btn-primary btn-primary" disabled={submitting}>
                {submitting ? "Creating..." : "Create Lead"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddLead;