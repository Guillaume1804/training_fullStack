const express = require("express");
const db = require("./database")
const clientsRoutes = require("./routes/clients");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/clients", clientsRoutes)

app.get("/", (req, res) => {
    res.send("Backend is working");
});

app.get("/test-db", (req, res) => {
    db.all("SELECT 1 as test", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});