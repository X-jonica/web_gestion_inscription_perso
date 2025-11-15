const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");

let db;

try {
    db = new Database(dbPath);
    console.log("✅ SQLite connecté :", dbPath);
} catch (error) {
    console.error("❌ Erreur de connexion SQLite :", error.message);
    process.exit(1);
}

module.exports = db;
