import React, { useState, useEffect } from "react";
import "../styles/InscriptionPage.css";
import { Link } from "react-router-dom";
import axios from "axios";

const InscriptionPage = () => {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        type_bacc: "",
        annee_bacc: "",
        recu_paiement: "",
        concours_id: "",
    });
    const [candidat_Id, setCandidat_Id] = useState(null);
    const [concours, setConcours] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // recuperation des concours dans la tables concours
    useEffect(() => {
        const fetchConcours = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/concours/ouverts"
                );
                console.log("Données reçues :", response.data);
                // Si la réponse est { data: [...] }
                setConcours(response.data.data || []);
            } catch (error) {
                console.error("Erreur:", error);
                setErrorMessage("Impossible de charger la liste des concours");
            }
        };

        fetchConcours();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCandidatRegistration = async () => {
        // 1. Vérification des champs du candidat
        if (
            !formData.nom ||
            !formData.prenom ||
            !formData.email ||
            !formData.telephone ||
            !formData.type_bacc ||
            !formData.annee_bacc
        ) {
            throw new Error(
                "Tous les champs du candidat doivent être remplis."
            );
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            throw new Error("L'email n'est pas valide.");
        }

        if (!formData.recu_paiement) {
            throw new Error("Veuillez confirmer votre paiement.");
        }

        const candidatData = {
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            telephone: formData.telephone,
            type_bacc: formData.type_bacc,
            annee_bacc: formData.annee_bacc,
            recu_paiement: formData.recu_paiement,
        };

        const response = await axios.post(
            "http://localhost:4000/api/candidats",
            candidatData
        );

        const candidatId = response.data?.id;
        setCandidat_Id(candidatId);
        if (!candidatId) {
            throw new Error(
                "Échec de récupération de l'identifiant du candidat."
            );
        }

        return candidatId;
    };

    // inscription
    const handleInscription = async (candidatId) => {
        if (!formData.concours_id) {
            throw new Error("Veuillez sélectionner un concours.");
        }

        const inscriptionData = {
            candidat_id: candidatId,
            concours_id: formData.concours_id,
            date_inscription: new Date().toISOString().split("T")[0],
            statut: "en_attente",
        };

        await axios.post(
            "http://localhost:4000/api/inscriptions",
            inscriptionData
        );
    };

    // melanger les deux
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(true);

        try {
            // Étape 1 : Enregistrement du candidat
            const candidatId = await handleCandidatRegistration();

            // Étape 2 : Enregistrement de l'inscription
            await handleInscription(candidatId);

            setSuccessMessage(
                "Inscription réussie ! Vous êtes maintenant enregistré comme candidat."
            );

            // Réinitialisation
            setFormData({
                nom: "",
                prenom: "",
                email: "",
                telephone: "",
                type_bacc: "",
                annee_bacc: "",
                recu_paiement: "",
                concours_id: "",
            });
        } catch (error) {
            console.error(error);
            const message =
                error.response?.data?.message ||
                error.message ||
                "Une erreur s'est produite.";
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="inscription-container">
            <section className="welcome-section">
                <div className="welcome-content">
                    <h1>Inscrivez-vous</h1>
                    <h2>
                        <span className="highlight">
                            au Concours d'entrée L1 à l'EMIT
                        </span>
                    </h2>
                    <p>
                        Rejoignez l'élite académique et donnez une nouvelle
                        dimension à votre parcours éducatif. Notre institution,
                        reconnue pour son excellence, ouvre ses portes aux
                        esprits les plus brillants.
                    </p>
                    <p>
                        Que vous soyez en Droit, Economie ou Multimédia, nous
                        avons conçu des programmes d'études qui répondent aux
                        exigences du monde contemporain.
                    </p>
                    <div className="deadline-box">
                        <i className="bi bi-calendar-check"></i>
                        <span>Date limite : 20 octobre 2025</span>
                    </div>
                </div>
            </section>

            <div className="form-scrollable">
                <div className="form-container">
                    <div className="form-card">
                        <div className="form-header">
                            <h1 className="form-title">
                                <i className="bi bi-pencil-square"></i>{" "}
                                Formulaire d'inscription
                            </h1>
                            <p className="form-subtitle">
                                Veuillez remplir tous les champs obligatoires
                                (*)
                            </p>
                            <p
                                className="form-subtitle"
                                style={{ display: "none" }}
                            >
                                id : {candidat_Id}
                            </p>
                        </div>

                        {successMessage && (
                            <div className="alert alert-success">
                                <i className="bi bi-check-circle-fill"></i>{" "}
                                {successMessage}
                                <button
                                    className="close-btn"
                                    onClick={() => setSuccessMessage("")}
                                >
                                    &times;
                                </button>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="alert alert-danger">
                                <i className="bi bi-exclamation-triangle-fill"></i>{" "}
                                {errorMessage}
                                <button
                                    className="close-btn"
                                    onClick={() => setErrorMessage("")}
                                >
                                    &times;
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group floating">
                                    <input
                                        type="text"
                                        id="nom"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        required
                                        placeholder=" "
                                    />
                                    <label htmlFor="nom">Nom *</label>
                                    <div className="invalid-feedback">
                                        Ce champ est obligatoire
                                    </div>
                                </div>

                                <div className="form-group floating">
                                    <input
                                        type="text"
                                        id="prenom"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        required
                                        placeholder=" "
                                    />
                                    <label htmlFor="prenom">Prénom *</label>
                                    <div className="invalid-feedback">
                                        Ce champ est obligatoire
                                    </div>
                                </div>

                                <div className="form-group floating">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder=" "
                                    />
                                    <label htmlFor="email">Email *</label>
                                    <div className="invalid-feedback">
                                        Veuillez entrer un email valide
                                    </div>
                                </div>

                                <div className="form-group floating">
                                    <input
                                        type="tel"
                                        id="telephone"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        required
                                        placeholder=" "
                                    />
                                    <label htmlFor="telephone">
                                        Téléphone *
                                    </label>
                                    <div className="invalid-feedback">
                                        Ce champ est obligatoire
                                    </div>
                                </div>

                                <div className="form-group floating">
                                    <select
                                        id="type_bacc"
                                        name="type_bacc"
                                        value={formData.type_bacc}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value=""></option>
                                        <option value="Scientifique">
                                            Scientifique
                                        </option>
                                        <option value="Littéraire">
                                            Littéraire
                                        </option>
                                        <option value="Technique">
                                            Technique
                                        </option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                    <label htmlFor="type_bacc">
                                        Type de Baccalauréat *
                                    </label>
                                    <div className="invalid-feedback">
                                        Veuillez sélectionner une option
                                    </div>
                                </div>

                                <div className="form-group floating">
                                    <input
                                        type="number"
                                        id="annee_bacc"
                                        name="annee_bacc"
                                        value={formData.annee_bacc}
                                        onChange={handleChange}
                                        required
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        placeholder=" "
                                    />
                                    <label htmlFor="annee_bacc">
                                        Année du Bac *
                                    </label>
                                    <div className="invalid-feedback">
                                        Année invalide
                                    </div>
                                </div>

                                <div className="form-group floating">
                                    <input
                                        type="text"
                                        id="recu_paiement"
                                        name="recu_paiement"
                                        value={formData.recu_paiement}
                                        onChange={handleChange}
                                        required
                                        placeholder=" "
                                    />
                                    <label htmlFor="recu_paiement">
                                        N° de Paiement *
                                    </label>
                                    <div className="invalid-feedback">
                                        Ce champ est obligatoire
                                    </div>
                                </div>

                                <div className="form-group floating">
                                    <select
                                        name="concours_id"
                                        value={formData.concours_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value=""></option>
                                        {(Array.isArray(concours)
                                            ? concours
                                            : []
                                        ).map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.mention} (
                                                {new Date(
                                                    c.date_concours
                                                ).toLocaleDateString("fr-FR")}
                                                )
                                            </option>
                                        ))}
                                    </select>
                                    <label>Concours choisi *</label>
                                    <div className="invalid-feedback">
                                        Veuillez sélectionner un concours
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <i className="bi bi-arrow-repeat"></i>{" "}
                                        En cours...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-send-fill"></i>{" "}
                                        Envoyer l'inscription
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="back-link-container">
                            <Link to="/" className="back-link">
                                <i className="bi bi-arrow-left"></i> Retour à
                                l'accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InscriptionPage;
