const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "congresoUTL",
});

db.connect((err) => {
    if (err) {
        console.log("Error al conectar a MySQL:", err);
        return;
    }
    console.log("Conectado a MySQL");
});


app.get("/api/listado", (req, res) => {
    db.query("SELECT * FROM participantes", (err, resultados) => {
        if (err) return res.status(500).json(err);
        res.json(resultados);
    });
});


app.get("/api/listado/search", (req, res) => {
    const q = req.query.q || "";
    db.query(
        "SELECT * FROM participantes WHERE CONCAT(nombre, ' ', apellidos) LIKE ?",
        [`%${q}%`],
        (err, resultados) => {
            if (err) return res.status(500).json(err);
            res.json(resultados);
        }
    );
});


app.get("/api/participante/:id", (req, res) => {
    db.query(
        "SELECT * FROM participantes WHERE id = ?",
        [req.params.id],
        (err, resultados) => {
            if (resultados.length === 0)
                return res.status(404).json({ error: "No encontrado" });
            res.json(resultados[0]);
        }
    );
});


app.post("/api/registro", (req, res) => {
    const { nombre, apellidos, email, twitter, ocupacion, avatar } = req.body;

    db.query(
        "INSERT INTO participantes (nombre, apellidos, email, twitter, ocupacion, avatar) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre, apellidos, email, twitter, ocupacion, avatar],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ mensaje: "Registrado correctamente", id: result.insertId });
        }
    );
});


app.listen(3000, () => {
    console.log("Servidor listo en http://localhost:3000");
});
