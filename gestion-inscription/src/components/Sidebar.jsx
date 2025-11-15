import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/Sidebar.css";

const Sidebar = ({ adminName }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            // Nettoyage du local storage
            localStorage.clear();

            // Redirection
            navigate("/");
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-brand">
                <i className="bi bi-speedometer2 sidebar-icon"></i>
                <span>Admin Dashboard</span>
                {adminName && (
                    <div className="admin-info">
                        <i className="bi bi-person-circle fs-2"></i>
                        <span>{adminName}</span>
                    </div>
                )}
            </div>

            <nav className="sidebar-nav">
                <Link to="/admin/dashboard" className="nav-item">
                    <i className="bi bi-house-door sidebar-icon"></i>
                    <span>Accueil</span>
                </Link>

                <Link to="/admin/candidats" className="nav-item">
                    <i className="bi bi-people sidebar-icon"></i>
                    <span>Candidats</span>
                </Link>

                <Link to="/admin/inscriptions" className="nav-item">
                    <i className="bi bi-file-earmark-text sidebar-icon"></i>
                    <span>Inscriptions</span>
                </Link>

                <Link to="/admin/concours" className="nav-item">
                    <i className="bi bi-trophy sidebar-icon"></i>
                    <span>Concours</span>
                </Link>

                <button onClick={handleLogout} className="nav-item logout-btn">
                    <i className="bi bi-box-arrow-left sidebar-icon"></i>
                    <span>Déconnexion</span>
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
