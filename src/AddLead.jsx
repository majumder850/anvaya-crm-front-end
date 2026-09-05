import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Toast from "./Toast";

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
  const [toast, setToast] = useState({ message: "", type: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://anvaya-crm-phase-2.vercel.app/api/agents")
      .then((res) => res.json())
      .then((data) => {
        const agentList = Array.isArray(data) ? data : data.data?.agents || [];
        setAgents(agentList);
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
      ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
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
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || "Failed to create lead.");
        return data;
      })
      .then(() => {
        setToast({ message: "Lead created successfully!", type: "success" });
        setTimeout(() => navigate("/leads"), 1500);
      })
      .catch((err) => {
        console.error("Error creating lead:", err);
        setToast({ message: err.message || "Failed to create lead.", type: "error" });
        setSubmitting(false);
      });
  };

  return (
    <div className="container-fluid">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
      <div className="row">
        <Sidebar />

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Add New Lead</h1>
          </div>

          <div className="card shadow-sm p-4 col-md-8">
            <form onSubmit={handleSubmit}>
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

              <div className="mb-3">
                <label className="form-label fw-bold">Sales Agent:</label>
                <select
                  name="salesAgent"
                  className="form-select"
                  value={formData.salesAgent}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Sales Agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id || agent._id} value={agent.id || agent._id}>
                      {agent.name} ({agent.email})
                    </option>
                  ))}
                </select>
              </div>

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

              <button type="submit" className="btn btn-primary" disabled={submitting}>
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