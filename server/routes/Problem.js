// Import the required modules
const express = require("express");
const router = express.Router();

const {
  createProblem,
  updateProblem,
  deleteProblem,
  getAllProblems,
  getAllSolvedProblems,
  getProblem,
  getUserCode,
  updateCode,
  saveCode,
  getSubmissions,
} = require("../controllers/Problem");

const { auth, isAdmin } = require("../middleware/auth");


router.post("/addProblem", auth, isAdmin, createProblem);

router.post("/updateProblem", auth, isAdmin, updateProblem);

router.post("/deleteProblem", auth, isAdmin, deleteProblem);
router.get("/getUserCode", auth, getUserCode);
router.post("/updateCode", auth, updateCode);
router.post("/saveCode", auth, saveCode);
router.get("/getSubmissions", auth, getSubmissions);

router.get("/getAllProblems", auth, getAllProblems);
router.get("/getProblem", auth, getProblem);

router.get("/getAllSolvedProblems", auth, getAllSolvedProblems);

module.exports = router;
