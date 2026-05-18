const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

router.get("/users", auth, (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.post("/add-user", auth, (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO users (name) VALUES (?)", [name], (err) => {
    if (err) throw err;
    res.send("User added");
  });
});

router.put("/update-user/:id", auth, (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  db.query("UPDATE users SET name=? WHERE id=?", [name, id], (err) => {
    if (err) throw err;
    res.send("User updated");
  });
});

router.patch("/disable-user/:id", auth, (req, res) => {
  const { id } = req.params;
  db.query("UPDATE users SET status='disabled' WHERE id=?", [id], (err) => {
    if (err) throw err;
    res.json({ message: "User disabled" });
  });
});

router.patch("/enable-user/:id", auth, (req, res) => {
  const { id } = req.params;
  db.query("UPDATE users SET status='active' WHERE id=?", [id], (err) => {
    if (err) throw err;
    res.json({ message: "User enabled" });
  });
});

module.exports = router;