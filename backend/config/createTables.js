const db = require("./db");

// Activer les foreign keys (SQLite)
db.pragma("foreign_keys = ON");

function createTables() {
    // Création des tables
    db.prepare(
        `
        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            mot_de_passe TEXT NOT NULL
        )
    `
    ).run();

    db.prepare(
        `
        CREATE TABLE IF NOT EXISTS candidats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            telephone TEXT,
            type_bacc TEXT,
            annee_bacc TEXT,
            recu_paiement TEXT,
            password_hash TEXT
        )
    `
    ).run();

    db.prepare(
        `
        CREATE TABLE IF NOT EXISTS concours (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mention TEXT NOT NULL,
            description TEXT,
            date_concours TEXT
        )
    `
    ).run();

    db.prepare(
        `
        CREATE TABLE IF NOT EXISTS inscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            candidat_id INTEGER NOT NULL,
            concours_id INTEGER NOT NULL,
            date_inscription TEXT NOT NULL,
            statut TEXT DEFAULT 'en_attente',
            FOREIGN KEY (candidat_id) REFERENCES candidats(id),
            FOREIGN KEY (concours_id) REFERENCES concours(id)
        )
    `
    ).run();

    console.log("✅ Toutes les tables ont été créées.");

    // Ajouter un admin test si aucun n'existe
    const adminExists = db
        .prepare("SELECT COUNT(*) AS count FROM admin")
        .get().count;
    if (adminExists === 0) {
        db.prepare(
            `
            INSERT INTO admin (email, mot_de_passe)
            VALUES (?, ?)
        `
        ).run("admin@example.com", "admin123"); // mot de passe simple pour test
        console.log("✅ Admin de test créé : admin@example.com / admin123");
    }

    // Ajouter les parcours concours si aucun n'existe
    const concoursExists = db
        .prepare("SELECT COUNT(*) AS count FROM concours")
        .get().count;
    if (concoursExists === 0) {
        const insertConcours = db.prepare(`
            INSERT INTO concours (mention, description, date_concours)
            VALUES (?, ?, ?)
        `);

        insertConcours.run(
            "DAII",
            "Developpement d'Application Internet-Intranet",
            "2025-10-25"
        );
        insertConcours.run(
            "RPM",
            "Relation Public et Multimedia",
            "2025-10-26"
        );
        insertConcours.run(
            "AES",
            "Administration Economique et Social",
            "2025-10-27"
        );

        console.log("✅ Parcours concours ajoutés : DAII, RPM, AES");
    }
}

// Exporter la fonction pour l'utiliser ailleurs
module.exports = createTables;

// Exécution directe si on lance le fichier
if (require.main === module) {
    createTables();
}
