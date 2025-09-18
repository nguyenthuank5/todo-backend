const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }, // thêm field này
  deadline: { type: Date }, // sau này bạn sẽ dùng
  priority: { type: String, enum: ["low", "medium", "high"], default: "low" }
});

module.exports = mongoose.model("Task", TaskSchema);
