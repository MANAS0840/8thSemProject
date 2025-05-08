const mongoose = require("mongoose");

// Define the Folder schema
const exampleSchema = new mongoose.Schema({
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Problem",
  },
  inputText: {
    type: String,
    required: true,
    trim: true,
  },
  outputText: {
    type: String,
    required: true,
    trim: true,
  },
  explanation: {
    type: String,
    required: true,
    trim: true,
  },
});

// Export the Folder model
module.exports = mongoose.model("Example", exampleSchema);
