import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgClass = type === "error" ? "bg-danger" : "bg-success";

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1100 }}
    >
      <div className={`toast show text-white ${bgClass} border-0 shadow`} role="alert">
        <div className="d-flex align-items-center justify-content-between p-2 px-3">
          <div className="toast-body p-0 fw-semibold">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white ms-3"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Toast;