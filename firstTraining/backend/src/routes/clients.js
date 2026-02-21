const express = require("express");
const router = express.Router();
const db = require("../database");

function validateClientName(raw) {
    const name = String(raw ?? "").trim();

    if (name.length === 0) {
        return {ok: false, status: 400, error: "Name is required"};
    }

    if (name.length < 2) {
        return {ok: false, status: 400, error: "Name must be at least 2 characters"};
    }

    if (name.length > 50) {
        return {ok: false, status: 400, error: "Name is too long (max 50)"};
    }

    return {ok: true, value: name};
}

function parseId(raw) {
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
        return {ok: false, status: 400, error: "Invalid ID"};
    }
    return {ok: true, value: id};
}

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
    const check = validateClientName(req.body?.name);
    if (!check.ok) return res.status(check.status).json({error: check.error});
        
    db.run(
        "INSERT INTO clients (name) VALUES (?)",
        [check.value],
        function(err) {
            if (err) return res.status(500).json({error: err.message});
            return res.status(201).json({id: this.lastID, name: check.value});
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
    const idCheck = parseId(req.params.id);
    if (!idCheck.ok) return res.status(idCheck.status).json({error: idCheck.error});

    const nameCheck = validateClientName(req.body?.name);
    if (!nameCheck.ok) return res.status(nameCheck.status).json({error: nameCheck.error});

    db.run("UPDATE clients SET name = ? WHERE id = ?", 
        [nameCheck.value, idCheck.value],
        function (err) {
            if (err) return res.status(500).json({error : err.message});
            // this.changes = nombre de lignes modifiés
            if (this.changes === 0) {
                return res.status(404).json({error : "Client Not Found"});
            }
            return res.json({id: idCheck.value, name: nameCheck.value});
        }
    );
});

module.exports = router