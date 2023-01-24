const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  // Add your schema here
  name: String,
  age: Number,
});

const Candidate = mongoose.model("candidates", CandidateSchema);

const CandidateModel = Candidate;

module.exports = CandidateModel;
