const { success } = require("../config/helper");
const Candidat = require("../models/candidatModel");

exports.getAll = async (req, res) => {
    try {
        const candidats = await Candidat.getAll();
        const message = "Données candidats reçu avec success 👍!";
        res.json(success(message, candidats));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.getById = async (req, res) => {
    try {
        const candidat = await Candidat.getById(req.params.id);
        if (!candidat) return res.json({ message: "Candidat non trouvé" });
        const message = "Candidat recuperé 👍";
        res.json(success(message, candidat));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.add = async (req, res) => {
    try {
        const id = await Candidat.add(req.body);
        res.status(201).json({ id });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de l'enregistrement du candidat.",
        });
    }
};

exports.update = async (req, res) => {
    try {
        const updatedCandidat = await Candidat.update(req.params.id, req.body);
        if (!updatedCandidat)
            return res.json({ message: "Candidat non trouvé" });
        const message = "Candidat modifié avec succes !👍";
        res.json(success(message, updatedCandidat));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.delete = async (req, res) => {
    try {
        await Candidat.delete(req.params.id);
        res.json({ message: "Candidat supprimé" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.search = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const results = await Candidat.search(keyword);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.getCount = async (req, res) => {
    try {
        const total = await Candidat.count();
        const message = "Statistiques candidats récupérées";
        res.json(success(message, total));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
