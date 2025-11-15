const db = require("../config/db");

const Inscription = {
    getAll: () => {
        const stmt = db.prepare("SELECT * FROM Inscriptions");
        return stmt.all();
    },

    getById: (id) => {
        const stmt = db.prepare("SELECT * FROM Inscriptions WHERE id = ?");
        return stmt.get(id);
    },

    add: ({ candidat_id, concours_id, date_inscription, statut }) => {
        const stmt = db.prepare(`
            INSERT INTO Inscriptions (candidat_id, concours_id, date_inscription, statut)
            VALUES (?, ?, ?, ?)
        `);

        const result = stmt.run(
            candidat_id,
            concours_id,
            date_inscription,
            statut || "en_attente"
        );

        return result.lastInsertRowid; // équivalent à insertId
    },

    update: (id, { candidat_id, concours_id, date_inscription, statut }) => {
        const stmt = db.prepare(`
            UPDATE Inscriptions
            SET candidat_id = ?, concours_id = ?, date_inscription = ?, statut = ?
            WHERE id = ?
        `);

        const result = stmt.run(
            candidat_id,
            concours_id,
            date_inscription,
            statut,
            id
        );

        if (result.changes === 0) {
            throw new Error("Aucune mise à jour effectuée (ID introuvable)");
        }
    },

    delete: (id) => {
        const stmt = db.prepare("DELETE FROM Inscriptions WHERE id = ?");
        stmt.run(id);
    },

    getAllWithDetails: () => {
        const stmt = db.prepare(`
            SELECT i.*,
                   c.nom AS candidat_nom, c.prenom AS candidat_prenom,
                   co.mention AS concours_mention
            FROM Inscriptions i
            JOIN Candidats c ON i.candidat_id = c.id
            JOIN Concours co ON i.concours_id = co.id
        `);
        return stmt.all();
    },

    search: (searchTerm, statutFilter = null) => {
        let sql = `
            SELECT i.*,
                   c.nom AS candidat_nom, c.prenom AS candidat_prenom,
                   co.mention AS concours_mention
            FROM Inscriptions i
            JOIN Candidats c ON i.candidat_id = c.id
            JOIN Concours co ON i.concours_id = co.id
            WHERE (c.nom LIKE ? OR c.prenom LIKE ? OR co.mention LIKE ?)
        `;

        const params = [
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
        ];

        if (statutFilter) {
            sql += " AND i.statut = ?";
            params.push(statutFilter);
        }

        const stmt = db.prepare(sql);
        return stmt.all(...params);
    },

    getCandidatsValides: () => {
        const stmt = db.prepare(`
            SELECT c.*,
                   i.statut AS statut_inscription,
                   co.mention AS concours_mention
            FROM Candidats c
            JOIN Inscriptions i ON c.id = i.candidat_id
            JOIN Concours co ON i.concours_id = co.id
            WHERE i.statut = 'valide'
        `);
        return stmt.all();
    },

    updateStatus: (id, statut) => {
        const stmt = db.prepare(
            "UPDATE Inscriptions SET statut = ? WHERE id = ?"
        );
        stmt.run(statut, id);
    },

    count: () => {
        const stmt = db.prepare("SELECT COUNT(*) AS total FROM Inscriptions");
        const row = stmt.get();
        return row.total;
    },

    countInscrit: () => {
        const stmt = db.prepare(`
            SELECT c.*
            FROM Candidats c
            JOIN Inscriptions i ON c.id = i.candidat_id
            WHERE i.statut = 'valide'
        `);
        return stmt.all();
    },
};

module.exports = Inscription;
