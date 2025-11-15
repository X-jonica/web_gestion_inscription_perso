const db = require("../config/db");

function trouverParEmail(email, password) {
    const stmt = db.prepare(
        "SELECT * FROM admin WHERE email = ? AND mot_de_passe = ?"
    );
    return stmt.get(email, password);
}

module.exports = { trouverParEmail };
