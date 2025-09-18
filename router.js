const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

// Middleware check token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("Access denied.");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
}

// Get tasks
router.get("/", verifyToken, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Add task
router.post("/", verifyToken, async (req, res) => {
  const newTask = new Task({ title: req.body.title, userId: req.user.id });
  await newTask.save();
  res.json(newTask);
});

// Toggle task
router.put("/:id", verifyToken, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).send("Task not found");
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// Delete task
router.delete("/:id", verifyToken, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

module.exports = router;
