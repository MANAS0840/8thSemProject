
const express = require("express");
const router = express.Router();

const { getHistoryDetails } = require("../controllers/History");

const {
  createFolder,
  updateFolder,
  deleteFolder,
} = require("../controllers/Folder");

const {
  createSubFolder,
  updateSubFolder,
  saveSubFolder,
  deleteSubFolder,
} = require("../controllers/SubFolder");

const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middleware/auth");

router.post("/addFolder", auth, createFolder);

router.post("/updateFolder", auth, updateFolder);

router.post("/deleteFolder", auth, deleteFolder);

router.post("/updateSubFolder", auth, updateSubFolder);
router.post("/saveSubFolder", auth, saveSubFolder);

router.post("/deleteSubFolder", auth, deleteSubFolder);

router.post("/addSubFolder", auth, createSubFolder);

router.get("/gethistoryDetails", auth, getHistoryDetails);

module.exports = router;
