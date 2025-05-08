const Folder = require("../models/Folder");
const History = require("../models/History");
const SubFolder = require("../models/SubFolder");
// CREATE a new Folder
exports.createFolder = async (req, res) => {
  try {
    // Extract the required properties from the request body
    const { FolderName } = req.body;
    const userId = req.user.id;
    console.log("f", FolderName, userId);
    // Validate the input
    if (!FolderName) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      });
    }

    // Create a new Folder with the given name
    const newFolder = await Folder.create({ FolderName });

    // Add the new Folder to the History's content array
    const updatedHistory = await History.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          Folders: newFolder._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "Folders",
        populate: {
          path: "subFolder",
        },
      })
      .exec();

    // Return the updated History object in the response
    res.status(200).json({
      success: true,
      message: "Folder created successfully",
      updatedHistory,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// UPDATE a Folder
exports.updateFolder = async (req, res) => {
  try {
    const { FolderName, FolderId } = req.body;
    const userId = req.user.id;

    const folder = await Folder.findByIdAndUpdate(
      { _id: FolderId },
      { FolderName },
      { new: true }
    );
    const His = await History.findOneAndUpdate({ user: userId })
      .populate({
        path: "Folders",
        populate: {
          path: "subFolder",
        },
      })
      .exec();
    console.log(History);
    res.status(200).json({
      success: true,
      message: folder,
      data: His,
    });
  } catch (error) {
    console.error("Error updating Folder:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// DELETE a Folder
exports.deleteFolder = async (req, res) => {
  try {
    const { FolderId } = req.body;
    const userId = req.user.id;

    const folder = await Folder.findById(FolderId);
    console.log(FolderId, userId);
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    await History.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          Folders: FolderId,
        },
      },
      { new: true }
    );

    // Delete the associated subFolders
    await SubFolder.deleteMany({ _id: { $in: folder.subFolder } });

    await Folder.findByIdAndDelete(FolderId);

    // find the updated History and return it
    const His = await History.findOne({ user: userId })
      .populate({
        path: "Folders",
        populate: {
          path: "subFolder",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Folder deleted",
      data: His,
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
