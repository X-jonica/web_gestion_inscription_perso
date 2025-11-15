const { success } = require("../config/helper");
const Inscription = require("../models/inscriptionModel");

exports.getAll = async (req, res) => {
    const data = await Inscription.getAll();
    const message = "tous les Inscriptions sont recuperés avec success 👍!";
    res.json(success(message, data));
};

exports.getById = async (req, res) => {
    const data = await Inscription.getById(req.params.id);
    const message = "Inscription recuperé avec success 👍!";
    if (data) res.json(success(message, data));
    else res.json({ message: "Inscription Non trouvé ❌" });
};

exports.add = async (req, res) => {
    const id = await Inscription.add(req.body);
    const message = "Inscription ajouté avec success";
    res.json({ id });
};

exports.delete = async (req, res) => {
    await Inscription.delete(req.params.id);
    res.json({ message: "Deleted successfully" });
};

exports.getAllWithDetails = async (req, res) => {
    const data = await Inscription.getAllWithDetails();
    res.json(data);
};

exports.search = async (req, res) => {
    const { q, statut } = req.query;
    const data = await Inscription.search(q || "", statut);
    res.json(data);
};

exports.getCandidatsValides = async (req, res) => {
    try {
        const data = await Inscription.getCandidatsValides();
        const message = "Candidats validés récupérés avec succès 👍!";
        res.json(success(message, data));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de la récupération des candidats validés",
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { statut } = req.body;

        // Validation du statut
        const statutsValides = ["en_attente", "valide", "rejete"];
        if (!statutsValides.includes(statut)) {
            return res.status(400).json({ message: "Statut invalide" });
        }

        await Inscription.updateStatus(req.params.id, statut);
        res.json({ success: true, message: "Statut mis à jour avec succès" });
    } catch (error) {
        console.error("Erreur update:", error);
        res.status(500).json({
            success: false,
            message: "Échec de la mise à jour",
            error: error.message,
        });
    }
};

exports.getCount = async (req, res) => {
    try {
        const total = await Inscription.count();
        const message = "Nombre d'inscriptions récupéré avec succès";
        res.json(success(message, total)); // data sera { total: X }
    } catch (error) {
        console.error("Erreur dans getCount :", error);
        res.status(500).json({ message: "Erreur serveur lors du comptage" });
    }
};

exports.getInscrit = async (req, res) => {
    try {
        const totalInscrit = await Inscription.countInscrit();
        const message = "Etudiant inscrit recupere avec succees!";
        res.json(success(message, totalInscrit));
    } catch (error) {
        console.error(
            `Erreur de recuperation des candidats inscrit , ${error}`
        );
        res.status(500).json({
            message:
                "Erreur du serveur lors de la recuperation des candidats inscrit",
        });
    }
};
