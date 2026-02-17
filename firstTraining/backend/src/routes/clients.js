const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {
    db.all("SELECT * FROM clients", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});


router.post("/", (req, res) => {
    const {name} = req.body;
    
    db.run(
        "INSERT INTO clients (name) VALUES (?)",
        [name],
        function(err) {
            if (err) {
                res.status(500).send(err.message); 
            } else {
                res.json({
                    id: this.lastID,
                    name: name
                });
            }
        }
    );
});

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    db.run("DELETE FROM clients WHERE id = ?", [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({ deleted: this.changes })
    });
});

module.exports = router