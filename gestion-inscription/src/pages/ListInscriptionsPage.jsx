import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/ListInscription.css";
import axios from "axios";

const ListInscriptionsPage = () => {
    const [inscriptions, setInscriptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedInscription, setSelectedInscription] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredData, setFilteredData] = useState([]);

    // Récupération des données depuis l'API
    useEffect(() => {
        const fetchInscriptions = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await axios.get(
                    "http://localhost:4000/api/inscriptions/details"
                );

                if (response.data && Array.isArray(response.data)) {
                    setInscriptions(response.data);
                    console.log(response.data);
                } else {
                    throw new Error("Format de données inattendu");
                }
            } catch (err) {
                console.error("Erreur API:", err);
                setError("Erreur lors du chargement des inscriptions");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInscriptions();
    }, []);

    // Recherche + filtre
    useEffect(() => {
        // Filtrage combiné par statut et recherche
        const filtered = inscriptions.filter((item) => {
            // Filtre par statut
            const statusMatch = statusFilter
                ? item.statut === statusFilter
                : true;

            // Filtre par recherche (nom, prénom ou concours)
            const searchMatch = searchTerm
                ? (
                      item.candidat_nom +
                      " " +
                      item.candidat_prenom +
                      " " +
                      item.concours_mention
                  )
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                : true;

            return statusMatch && searchMatch;
        });

        setFilteredData(filtered);
    }, [statusFilter, searchTerm, inscriptions]);

    // Gérer l'affichage du modal
    const handleShowModal = (inscription) => {
        setSelectedInscription(inscription);
        setShowModal(true);
    };

    // Gérer la fermeture du modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Gérer la mise à jour du statut
    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const inscriptionId = formData.get("inscription_id");
        const newStatus = formData.get("statut");

        try {
            const response = await axios.put(
                `http://localhost:4000/api/inscriptions/${inscriptionId}`,
                { statut: newStatus }
            );

            if (response.data.success) {
                setInscriptions(
                    inscriptions.map((inscription) =>
                        inscription.id === parseInt(inscriptionId)
                            ? { ...inscription, statut: newStatus }
                            : inscription
                    )
                );
                setShowModal(false);
            } else {
                throw new Error(
                    response.data.message || "Échec de la mise à jour"
                );
            }
        } catch (err) {
            console.error("Erreur mise à jour:", err);
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="d-flex">
            {/* Sidebar réutilisable */}
            <Sidebar />

            {/* Main content */}
            <div className="main-content">
                <h1 className="page-header">
                    <span>Liste des Inscriptions</span>
                </h1>

                {/* Formulaire de recherche et filtre */}
                <div className="search-container">
                    <div className="row g-3">
                        <div className="col-md-9 search-box">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher par nom, prénom ou concours..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3 d-flex justify-content-end">
                            <select
                                className="form-select status-filter"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >
                                <option value="">Tous les statuts</option>
                                <option value="en_attente">En attente</option>
                                <option value="valide">Validé</option>
                                <option value="rejete">Rejeté</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tableau des inscriptions */}
                <div className="table-container">
                    <div className="table-responsive">
                        <table className="table table-hover table-sm">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Candidat</th>
                                    <th>Concours</th>
                                    <th className="text-nowrap">
                                        Date Inscription
                                    </th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4"
                                        >
                                            Aucune inscription trouvée
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((inscription) => {
                                        let badgeClass = "";
                                        switch (inscription.statut) {
                                            case "valide":
                                                badgeClass = "bg-success";
                                                break;
                                            case "rejete":
                                                badgeClass = "bg-danger";
                                                break;
                                            default:
                                                badgeClass =
                                                    "bg-warning text-dark";
                                        }

                                        return (
                                            <tr key={inscription.id}>
                                                <td>{inscription.id}</td>
                                                <td>
                                                    {inscription.candidat_nom}{" "}
                                                    {
                                                        inscription.candidat_prenom
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        inscription.concours_mention
                                                    }
                                                </td>
                                                <td>
                                                    {new Date(
                                                        inscription.date_inscription
                                                    ).toLocaleDateString(
                                                        "fr-FR"
                                                    )}{" "}
                                                    à{" "}
                                                    {new Date(
                                                        inscription.date_inscription
                                                    ).toLocaleTimeString(
                                                        "fr-FR",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${badgeClass}`}
                                                    >
                                                        {inscription.statut}
                                                    </span>
                                                </td>
                                                <td className="action-btns">
                                                    <button
                                                        className="btn btn-sm btn-primary me-2"
                                                        onClick={() =>
                                                            handleShowModal(
                                                                inscription
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-pencil"></i>{" "}
                                                        Modifier
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal pour modifier le statut */}
            {selectedInscription && (
                <div
                    className={`modal fade ${showModal ? "show d-block" : ""}`}
                    style={{
                        backgroundColor: showModal
                            ? "rgba(0,0,0,0.5)"
                            : "transparent",
                    }}
                    tabIndex="-1"
                    aria-labelledby="inscriptionModalLabel"
                    aria-hidden={!showModal}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleUpdateStatus}>
                                <div className="modal-header">
                                    <h5
                                        className="modal-title"
                                        id="inscriptionModalLabel"
                                    >
                                        Modifier le statut
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseModal}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <input
                                        type="hidden"
                                        name="inscription_id"
                                        value={selectedInscription.id}
                                    />
                                    <input
                                        type="hidden"
                                        name="update_status"
                                        value="1"
                                    />

                                    <div className="mb-3">
                                        <label className="form-label modal-detail-label">
                                            Candidat
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={`${selectedInscription.candidat_nom} ${selectedInscription.candidat_prenom}`}
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label modal-detail-label">
                                            Concours
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                selectedInscription.concours_mention
                                            }
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label modal-detail-label">
                                            Date Inscription
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={new Date(
                                                selectedInscription.date_inscription
                                            ).toLocaleString("fr-FR")}
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            htmlFor="modal-statut"
                                            className="form-label modal-detail-label"
                                        >
                                            Statut
                                        </label>
                                        <select
                                            className="form-select"
                                            id="modal-statut"
                                            name="statut"
                                            defaultValue={
                                                selectedInscription.statut
                                            }
                                        >
                                            <option value="en_attente">
                                                En attente
                                            </option>
                                            <option value="valide">
                                                Validé
                                            </option>
                                            <option value="rejete">
                                                Rejeté
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListInscriptionsPage;
