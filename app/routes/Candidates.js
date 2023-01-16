const express = require("express");
const { CandidatesController } = require("../controllers");

const router = express.Router();

// GET and POST requests made here

router
  .get("/", CandidatesController.getAllCandidates)
  .post("/add", CandidatesController.addCandidate);

// PUT and DELETE requests made here

router
  .route("/:id")
  .put("/:id", CandidatesController.updateCandidate)
  .delete(CandidatesController.deleteCandidate);

module.exports = router;
