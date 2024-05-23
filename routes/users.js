const express = require("express");
const router = express.Router();
const db = require("../config/config");

// Endpoint untuk membaca semua data
router.get("/", async (req, res, next) => {
  try {
    const [rows, fields] = await db.query("SELECT * FROM employees");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Endpoint untuk membaca data berdasarkan ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows, fields] = await db.query(
      "SELECT * FROM employees WHERE id = ?",
      [id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    next(err);
  }
});

// Endpoint untuk membuat data baru
router.post("/", async (req, res, next) => {
  try {
    const { name, position } = req.body;
    const [result] = await db.query(
      "INSERT INTO employees (name, position) VALUES (?, ?)",
      [name, position]
    );
    res.json({ id: result.insertId, name, position });
  } catch (err) {
    next(err);
  }
});

// Endpoint untuk memperbarui data
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, position } = req.body;
    await db.query("UPDATE employees SET name = ?, position = ? WHERE id = ?", [
      name,
      position,
      id,
    ]);
    res.json({ id, name, position });
  } catch (err) {
    next(err);
  }
});

// Endpoint untuk menghapus data
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM employees WHERE id = ?", [id]);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
