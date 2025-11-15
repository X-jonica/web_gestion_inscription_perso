const db = require("../config/db");

const Concours = {
    // Ajoute une inscription au concours
    addInscription: (candidatId, concoursId) => {
        const stmt = db.prepare(
            `INSERT INTO inscriptions (candidat_id, concours_id) VALUES (?, ?)`
        );
        stmt.run(candidatId, concoursId);
    },

    // Récupère tous les concours ouverts
    getConcoursOuverts: () => {
        const stmt = db.prepare(`SELECT * FROM concours`);
        return stmt.all(); // retourne toutes les lignes
    },

    // Récupère tous les concours
    getAll: () => {
        const stmt = db.prepare(`SELECT * FROM concours`);
        return stmt.all();
    },

    // Compte le nombre total de concours
    count: () => {
        const stmt = db.prepare(`SELECT COUNT(*) as total FROM concours`);
        const row = stmt.get();
        return row.total;
    },
};

module.exports = Concours;
