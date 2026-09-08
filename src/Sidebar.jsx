import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/leads", label: "Lead List" },
    { to: "/leads/status", label: "Leads by Status" },
    { to: "/agents/view", label: "Sales Agent View" },
    { to: "/agents", label: "Sales Agents" },
    { to: "/reports", label: "Reports" },
  ];

  return (
    <>
      <div className="d-md-none bg-light p-2 border-bottom d-flex align-items-center justify-content-between">
        <Link to="/" className="fw-bold text-muted text-decoration-none">
          Anvaya CRM
        </Link>
        <button
          className="btn btn-outline-secondary btn-sm"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">&#9776;</span>
        </button>
      </div>

      <nav
        className={`col-md-3 col-lg-2 d-md-block bg-light sidebar border-end min-vh-100 py-3 ${
          isOpen ? "d-block" : "d-none"
        }`}
      >
        <div className="position-sticky">
          <h5 className="sidebar-heading px-3 text-muted d-none d-md-block">
            <Link to="/" className="text-muted text-decoration-none">
              Anvaya CRM
            </Link>
          </h5>
          <ul className="nav flex-column mt-3">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <li className="nav-item mb-1" key={link.to}>
                  <Link
                    className={`nav-link ${isActive ? "active fw-bold text-primary" : "text-dark"}`}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;