const History = require("../models/History");

exports.getHistoryDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("user", userId);
    const HistoryDetails = await History.findOne({
      user: userId,
    })
      .populate({
        path: "Folders",
        populate: {
          path: "subFolder",
        },
      })
      .exec();

    if (!HistoryDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find History with userid: ${userId}`,
      });
    }
    console.log("hist", HistoryDetails);
    return res.status(200).json({
      success: true,
      data: HistoryDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
