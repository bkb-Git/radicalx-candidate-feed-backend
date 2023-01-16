// @desc Get candidate list
// @route GET /api/candidates
// @access Private

const getAllCandidates = (req, res) =>
  res.status(200).json({ message: "Get all candidates" });

// @desc Create candidate
// @route POST /api/createCandidate
// @access Private

const addCandidate = (req, res) =>
  res.status(200).json({ message: "Add candidate" });

// @desc Update candidate info
// @route PUT /api/candidates/:id
// @access Private

const updateCandidate = (req, res) =>
  res.status(200).json({ message: `Update Candidate ${req.params.id}` });

// @desc Delete candidate
// @route DELETE /api/candidates/:id
// @access Private

const deleteCandidate = (req, res) =>
  res.status(200).json({ message: `Delete Candidate ${req.params.id}` });

const CandidatesController = {
  getAllCandidates,
  addCandidate,
  updateCandidate,
  deleteCandidate,
};

module.exports = CandidatesController;
