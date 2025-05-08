const Problem = require("../models/Problem");
const Example = require("../models/Example");
const User = require("../models/User");
const UserCode = require("../models/UserCode");

exports.createProblem = async (req, res) => {
  try {
    const {
      title,
      difficulty,
      tags,
      problemStatement,
      category,
      examples,
      constraints,
      correctCode,
    } = req.body;

    const userId = req.user.id;

    if (
      !title ||
      !difficulty ||
      !problemStatement ||
      !category ||
      !examples ||
      !constraints ||
      !correctCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      });
    }

    const newProblem = await Problem.create({
      title,
      difficulty,
      tags,
      problemStatement,
      category,
      examples,
      constraints,
      correctCode,
    });


    res.status(200).json({
      success: true,
      message: "Problem created successfully",
      newProblem,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const {
      title,
      difficulty,
      tags,
      problemStatement,
      category,
      examples,
      constraints,
      correctCode,
      ProblemId,
    } = req.body;

    const userId = req.user.id;

    const updproblem = await Problem.findByIdAndUpdate(
      { _id: ProblemId },
      {
        title,
        difficulty,
        tags,
        problemStatement,
        category,
        examples,
        constraints,
        correctCode,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "problem updated",
      data: updproblem,
    });
  } catch (error) {
    console.error("Error updating Problem:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const { ProblemId } = req.body;
    console.log("prob", ProblemId);

    const tprob = await Problem.findById(ProblemId);

    if (!tprob) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }



    await Problem.findByIdAndDelete(ProblemId);

    res.status(200).json({
      success: true,
      message: "Problem deleted",
    });
  } catch (error) {
    console.error("Error deleting Folder:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllProblems = async (req, res) => {
  try {
    const id = req.user.id;

    const aprob = await Problem.find({});

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      data: aprob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllSolvedProblems = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    res.status(200).json({
      success: true,
      message: "Solved Problems fetched successfully",
      data: user.solvedprob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProblem = async (req, res) => {
  try {
    // const { probid } = req.body;
    const probid = req.header("probid");
    console.log("probid", probid);
    const aprob = await Problem.findById(probid);

    res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      data: [aprob],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const probid = req.header("probid");
    console.log("hi", userId, probid);
    let userCode = await UserCode.findOne({ user: userId, problem: probid });

    if (!userCode) {
      
      const problem = await Problem.findById(probid);
      userCode = new UserCode({
        user: userId,
        problem: probid,
        code: problem.starterCode, 
      });
      await userCode.save(); 
    }
    res.status(200).json({
      success: true,
      message: "usercode fetched successfully",
      data: userCode,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }

};

exports.updateCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const { probid, newCode, lang } = req.body;
    let userCode = await UserCode.findOne({ user: userId, problem: probid });
    if (!userCode) {
      userCode = new UserCode({ user: userId, problem: probid });
    }
    userCode.code[lang] = newCode;
    await userCode.save();

    res.status(200).json({ message: "Starter code updated successfully" });
  } catch (err) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.saveCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const { probid, newCode, lang } = req.body;
    let user = await User.findById(userId);
    let userCode = await UserCode.findOne({ user: userId, problem: probid });
    if (!userCode) {
      userCode = new UserCode({ user: userId, problem: probid });
    }
    userCode.code[lang] = newCode;
    userCode.submissions.push({ language: lang, code: newCode });
    user.solvedprob.push(probid);
    await user.save();
    await userCode.save();

    res.status(200).json({ message: "Starter code updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const probid = req.header("probid");
    const userCode = await UserCode.findOne({ user: userId, problem: probid });

    if (!userCode) {
      return res.status(404).json({
        success: false,
        message: "No submissions found for this problem.",
      });
    }

    return res.status(200).json({ success: true, data: userCode.submissions });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Error retrieving submissions." });
  }
};
