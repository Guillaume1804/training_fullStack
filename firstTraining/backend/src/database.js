const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection error :", err.message);
    } else {
        console.log("Connected to SQLite database at :", dbPath);

        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS clients (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL
                )
            `);
            db.get("SELECT COUNT(*) AS count FROM clients", [], (err, row) => {
                if (err) {
                    console.error("Count error :", err.message);
                    return;
                }

                if (row.count === 0) {
                    db.run(
                        `INSERT INTO clients (name) VALUES (?), (?), (?)`, 
                        ["Jean", "Marie", "Paul"],
                        (insertErr) => {
                            if (insertErr) console.error("Seed error :", insertErr.message);
                            else console.log("Seed inserted (Jean, Marie, Paul)");
                        }
                    );
                } else {
                    console.log("Seed skipped (clients already exist)")
                }
            });
        });
    }
});

module.exports = db;