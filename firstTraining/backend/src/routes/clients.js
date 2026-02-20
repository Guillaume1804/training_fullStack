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
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({error: "Invalid id"});
    }

    db.run("DELETE FROM clients WHERE id = ?", [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error : "Client not Found"});
        }
        return res.json({ deleted: this.changes });
    });
});

router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (Number.isNaN(id)) {
        return res.status(400).json({error: "invalid id"});
    }

    if (!name || typeof name !== "string") {
        return res.status(400).json({error : "name is required"});
    }

    db.run("UPDATE clients SET name = ? WHERE id = ?", 
        [name, id],
        function (err) {
            if (err) return res.status(500).json({error : err.message});
            // this.changes = nombre de lignes modifiés
            if (this.changes === 0) {
                return res.status(404).res.json({error : "Client Not Found"});
            }
            res.json({updated : this.changes, id, name});
        }
    );
});

module.exports = router