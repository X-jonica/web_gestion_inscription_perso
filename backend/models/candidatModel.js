const db = require("../config/db");

const Candidat = {
    getAll: () => {
        const sql = `SELECT * FROM candidats`;
        const rows = db.prepare(sql).all();
        return rows;
    },

    getById: (id) => {
        const sql = `SELECT * FROM candidats WHERE id = ?`;
        const row = db.prepare(sql).get(id);
        return row;
    },

    add: (candidat) => {
        const {
            nom,
            prenom,
            email,
            telephone,
            type_bacc,
            annee_bacc,
            recu_paiement,
            password_hash,
        } = candidat;

        const sql = `
            INSERT INTO candidats (
                nom, prenom, email, telephone,
                type_bacc, annee_bacc, recu_paiement, password_hash
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = db
            .prepare(sql)
            .run(
                nom,
                prenom,
                email,
                telephone,
                type_bacc,
                annee_bacc,
                recu_paiement,
                password_hash
            );

        // SQLite renvoie lastInsertRowid
        return result.lastInsertRowid;
    },

    update: (id, candidat) => {
        const {
            nom,
            prenom,
            email,
            telephone,
            type_bacc,
            annee_bacc,
            recu_paiement,
            password_hash,
        } = candidat;

        const sql = `
            UPDATE candidats SET
                nom = ?,
                prenom = ?,
                email = ?,
                telephone = ?,
                type_bacc = ?,
                annee_bacc = ?,
                recu_paiement = ?,
                password_hash = ?
            WHERE id = ?
        `;

        const result = db
            .prepare(sql)
            .run(
                nom,
                prenom,
                email,
                telephone,
                type_bacc,
                annee_bacc,
                recu_paiement,
                password_hash,
                id
            );

        if (result.changes === 0) {
            throw new Error("Aucune mise à jour effectuée (ID introuvable)");
        }

        return db.prepare("SELECT * FROM candidats WHERE id = ?").get(id);
    },

    delete: (id) => {
        const sql = `DELETE FROM candidats WHERE id = ?`;
        db.prepare(sql).run(id);
    },

    search: (keyword) => {
        const sql = `
            SELECT * FROM candidats
            WHERE nom LIKE ? COLLATE NOCASE
               OR prenom LIKE ? COLLATE NOCASE
               OR email LIKE ? COLLATE NOCASE
        `;

        const term = `%${keyword}%`;

        return db.prepare(sql).all(term, term, term);
    },

    count: () => {
        const sql = `SELECT COUNT(*) AS total FROM candidats`;
        const row = db.prepare(sql).get();
        return row.total;
    },
};

module.exports = Candidat;
