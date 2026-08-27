import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const LeadManagement = () => {
  const { leadId } = useParams();
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    status: "",
    priority: "",
    timeToClose: "",
  });

  const currentLeadId = leadId || "64c34512f7a60e36df44";

  useEffect(() => {
    setLoading(true);
    
    fetch(`https://anvaya-crm-phase-2.vercel.app/api/leads`)
      .then((res) => res.json())
      .then((data) => {
        const leadsList = data.data?.leads || [];
        const foundLead = leadsList.find((l) => l._id === currentLeadId) || leadsList[0];
        if (foundLead) {
          setLead(foundLead);
          setEditFormData({
            name: foundLead.name || "",
            status: foundLead.status || "New",
            priority: foundLead.priority || "Medium",
            timeToClose: foundLead.timeToClose || "",
          });
        }
      })
      .catch((err) => console.error("Error fetching lead details:", err));

    fetch(`https://anvaya-crm-phase-2.vercel.app/api/leads/${currentLeadId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        const commentList = Array.isArray(data) ? data : data.data || [];
        setComments(commentList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setLoading(false);
      });
  }, [currentLeadId]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const agentId = lead?.salesAgent?._id || lead?.salesAgent;

    if (!agentId) {
      alert("Error: Cannot add comment because this lead has no valid sales agent ID assigned.");
      return;
    }

    const payload = {
      commentText: newCommentText,
      author: agentId,
    };

    fetch(`https://anvaya-crm-phase-2.vercel.app/api/leads/${lead?._id || currentLeadId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to post comment");
        return res.json();
      })
      .then((savedComment) => {
        const newEntry = savedComment.data || savedComment;
        setComments([newEntry, ...comments]);
        setNewCommentText("");
      })
      .catch((err) => {
        console.error("Error adding comment:", err);
        alert("Failed to submit comment. Check console for details.");
      });
  };

  const handleUpdateLead = (e) => {
    e.preventDefault();
    const targetId = lead?._id || currentLeadId;

    const payload = {
      name: editFormData.name,
      source: lead?.source || "Website",
      salesAgent: lead?.salesAgent?._id || lead?.salesAgent || undefined,
      status: editFormData.status,
      priority: editFormData.priority,
      timeToClose: Number(editFormData.timeToClose),
      tags: lead?.tags || [],
    };

    fetch(`https://anvaya-crm-phase-2.vercel.app/api/leads/${targetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update lead");
        return res.json();
      })
      .then((data) => {
        const updatedLead = data.data?.lead || data.lead || data;
        setLead(updatedLead);
        setIsEditing(false);
        alert("Lead updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating lead:", err);
        alert("Failed to update lead details.");
      });
  };

  if (loading) {
    return <div className="container mt-4"><p>Loading lead management data...</p></div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse py-3 border-end min-vh-100">
          <div className="position-sticky">
            <h5 className="sidebar-heading px-3 text-muted">Anvaya CRM</h5>
            <ul className="nav flex-column mt-3">
              <li className="nav-item">
                <Link className="nav-link fw-bold text-primary" to="/">
                  &larr; Back to Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Lead Management: {lead?.name || "Selected Lead"}</h1>
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
                  <div className="mb-3">
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
                        <p className="card-text mb-0">Comment: {comment.commentText}</p>
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