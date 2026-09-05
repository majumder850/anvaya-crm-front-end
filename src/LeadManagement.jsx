import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Toast from "./Toast";

const LeadManagement = () => {
  const { leadId } = useParams();
  const [lead, setLead] = useState(null);
  const [agents, setAgents] = useState([]);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    salesAgent: "",
    source: "Website",
    status: "",
    priority: "",
    timeToClose: "",
    tags: "",
  });

  const currentLeadId = leadId || "64c34512f7a60e36df44";

  useEffect(() => {
    setLoading(true);

    const fetchLeadPromise = fetch(`https://anvaya-crm-phase-2.vercel.app/api/leads`)
      .then((res) => res.json())
      .then((data) => {
        const leadsList = data.data?.leads || [];
        const foundLead = leadsList.find((l) => l._id === currentLeadId) || leadsList[0];
        if (foundLead) {
          setLead(foundLead);
          setEditFormData({
            name: foundLead.name || "",
            salesAgent: foundLead.salesAgent?._id || foundLead.salesAgent || "",
            source: foundLead.source || "Website",
            status: foundLead.status || "New",
            priority: foundLead.priority || "Medium",
            timeToClose: foundLead.timeToClose || "",
            tags: Array.isArray(foundLead.tags) ? foundLead.tags.join(", ") : "",
          });
        }
      });

    const fetchAgentsPromise = fetch("https://anvaya-crm-phase-2.vercel.app/api/agents")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data?.agents || [];
        setAgents(list);
      });

    const fetchCommentsPromise = fetch(`https://anvaya-crm-phase-2.vercel.app/api/leads/${currentLeadId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        const commentList = Array.isArray(data) ? data : data.data || [];
        setComments(commentList);
      });

    Promise.all([fetchLeadPromise, fetchAgentsPromise, fetchCommentsPromise])
      .then(() => setLoading(false))
      .catch((err) => {
        console.error("Error loading lead management data:", err);
        setToast({ message: "Failed to load lead details.", type: "error" });
        setLoading(false);
      });
  }, [currentLeadId]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const agentId = lead?.salesAgent?._id || lead?.salesAgent;

    if (!agentId) {
      setToast({
        message: "Cannot add comment: No sales agent is assigned to this lead.",
        type: "error",
      });
      return;
    }

    const payload = {
      commentText: newCommentText.trim(),
      author: agentId,
    };

    fetch(`https://anvaya-crm-phase-2.vercel.app/api/leads/${lead?._id || currentLeadId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || data.message || `HTTP ${res.status}: Failed to post comment`);
        }
        return data;
      })
      .then((savedComment) => {
        const newEntry = savedComment.data || savedComment;
        setComments([newEntry, ...comments]);
        setNewCommentText("");
        setToast({ message: "Comment added successfully.", type: "success" });
      })
      .catch((err) => {
        console.error("Error adding comment:", err);
        setToast({ message: err.message || "Failed to submit comment.", type: "error" });
      });
  };

  const handleUpdateLead = (e) => {
    e.preventDefault();
    const targetId = lead?._id || currentLeadId;

    const formattedTags = editFormData.tags
      ? editFormData.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      name: editFormData.name,
      source: editFormData.source,
      salesAgent: editFormData.salesAgent || undefined,
      status: editFormData.status,
      priority: editFormData.priority,
      timeToClose: Number(editFormData.timeToClose),
      tags: formattedTags,
    };

    fetch(`https://anvaya-crm-phase-2.vercel.app/api/leads/${targetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || data.message || "Failed to update lead");
        }
        return data;
      })
      .then((data) => {
        const updatedLead = data.data?.lead || data.lead || data;
        setLead(updatedLead);
        setEditFormData({
          name: updatedLead.name || "",
          salesAgent: updatedLead.salesAgent?._id || updatedLead.salesAgent || "",
          source: updatedLead.source || "Website",
          status: updatedLead.status || "New",
          priority: updatedLead.priority || "Medium",
          timeToClose: updatedLead.timeToClose || "",
          tags: Array.isArray(updatedLead.tags) ? updatedLead.tags.join(", ") : "",
        });
        setIsEditing(false);
        setToast({ message: "Lead updated successfully!", type: "success" });
      })
      .catch((err) => {
        console.error("Error updating lead:", err);
        setToast({ message: err.message || "Failed to update lead details.", type: "error" });
      });
  };

  if (loading) {
    return <div className="container mt-4"><p>Loading lead management data...</p></div>;
  }

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
            <h1 className="h2">Lead Management: {lead?.name || "Selected Lead"}</h1>
            <Link className="btn btn-outline-secondary btn-sm" to="/leads">
              &larr; Back to Lead List
            </Link>
          </div>

          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Lead Details</h4>

              {!isEditing ? (
                <div>
                  <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item"><strong>Lead Name:</strong> {lead?.name}</li>
                    <li className="list-group-item"><strong>Sales Agent:</strong> {lead?.salesAgent?.name || "Unassigned"}</li>
                    <li className="list-group-item"><strong>Lead Source:</strong> {lead?.source}</li>
                    <li className="list-group-item"><strong>Lead Status:</strong> <span className="badge bg-primary">{lead?.status}</span></li>
                    <li className="list-group-item"><strong>Priority:</strong> <span className="badge bg-secondary">{lead?.priority}</span></li>
                    <li className="list-group-item"><strong>Time to Close:</strong> {lead?.timeToClose} Days</li>
                    <li className="list-group-item d-flex align-items-center flex-wrap">
                      <strong className="me-2">Tags:</strong>
                      {Array.isArray(lead?.tags) && lead.tags.length > 0 ? (
                        lead.tags.map((tag, idx) => (
                          <span key={idx} className="badge bg-secondary me-1 my-1">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted small">No tags assigned</span>
                      )}
                    </li>
                  </ul>
                 
                  <button className="btn btn-outline-primary" onClick={() => setIsEditing(true)}>
                    Edit Lead Details
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateLead}>
                  <div className="mb-2">
                    <label className="form-label small fw-bold">Lead Name:</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-bold">Sales Agent:</label>
                    <select
                      className="form-select form-select-sm"
                      value={editFormData.salesAgent}
                      onChange={(e) => setEditFormData({ ...editFormData, salesAgent: e.target.value })}
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

                  <div className="mb-2">
                    <label className="form-label small fw-bold">Lead Source:</label>
                    <select
                      className="form-select form-select-sm"
                      value={editFormData.source}
                      onChange={(e) => setEditFormData({ ...editFormData, source: e.target.value })}
                      required
                    >
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Cold Call">Cold Call</option>
                      <option value="Advertisement">Advertisement</option>
                      <option value="Email">Email</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-bold">Lead Status:</label>
                    <select
                      className="form-select form-select-sm"
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-bold">Priority:</label>
                    <select
                      className="form-select form-select-sm"
                      value={editFormData.priority}
                      onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-bold">Time to Close (Days):</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      min="1"
                      value={editFormData.timeToClose}
                      onChange={(e) => setEditFormData({ ...editFormData, timeToClose: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Tags (comma-separated):</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. High Value, Follow-up"
                      value={editFormData.tags}
                      onChange={(e) => setEditFormData({ ...editFormData, tags: e.target.value })}
                    />
                  </div>
                
                  <button type="submit" className="btn btn-success me-2">Save Changes</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
              )}
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Comments Section</h4>
              
              <form onSubmit={handleAddComment} className="mb-4">
                <div className="mb-3">
                  <label htmlFor="commentInput" className="form-label text-muted small">Add New Comment</label>
                  <input
                    type="text"
                    id="commentInput"
                    className="form-control"
                    placeholder="Type an update or comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    required
                  />
                </div>
              
                <button type="submit" className="btn btn-success">
                  Submit Comment
                </button>
              </form>

              <hr />

              <div className="comments-list mt-3">
                {comments.length === 0 ? (
                  <p className="text-muted">No comments found for this lead yet.</p>
                ) : (
                  comments.map((comment, index) => (
                    <div className="card mb-2 bg-light border-0" key={comment.id || comment._id || index}>
                      <div className="card-body py-2">
                        <div className="d-flex justify-content-between text-muted small mb-1">
                          <span><strong>{comment.author?.name || comment.author || "Sales Agent"}</strong></span>
                          <span>{new Date(comment.createdAt || Date.now()).toLocaleString()}</span>
                        </div>
                        <p className="card-text mb-0">{comment.commentText}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadManagement;