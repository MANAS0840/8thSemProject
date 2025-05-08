
const Folder = require("../models/Folder");
const SubFolder = require("../models/SubFolder");


exports.createSubFolder = async (req, res) => {
  try {
    const { FolderId, title, language, code } = req.body;

    if (!FolderId || !title || !language || !code) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" });
    }
    console.log(code);


    const SubFolderDetails = await SubFolder.create({
      title: title,
      language: language,
      code: code,
    });

    const updatedFolder = await Folder.findByIdAndUpdate(
      { _id: FolderId },
      { $push: { subFolder: SubFolderDetails._id } },
      { new: true }
    ).populate("subFolder");


    return res.status(200).json({ success: true, data: updatedFolder });
  } catch (error) {

    console.error("Error creating new sub-Folder:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateSubFolder = async (req, res) => {
  try {
    const { FolderId, subFolderId, title } = req.body;
    const subFolder = await SubFolder.findById(subFolderId);

    if (!subFolder) {
      return res.status(404).json({
        success: false,
        message: "SubFolder not found",
      });
    }

    if (title !== undefined) {
      subFolder.title = title;
    }

    await subFolder.save();

    const updatedFolder = await Folder.findById(FolderId).populate("subFolder");

    console.log("updated Folder", updatedFolder);

    return res.json({
      success: true,
      message: "Folder updated successfully",
      data: updatedFolder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the Folder",
    });
  }
};
exports.saveSubFolder = async (req, res) => {
  try {
    const { folderId, cardId, newCode, newLanguage } = req.body;

    const subFolder = await SubFolder.findByIdAndUpdate(
      { _id: cardId },
      {
        code: newCode,
        language: newLanguage,
      },
      { new: true }
    );


    const updatedFolder = await Folder.findById(folderId).populate("subFolder");

    console.log("updated Folder", updatedFolder);

    return res.json({
      success: true,
      message: "Folder updated successfully",
      data: updatedFolder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the Folder",
    });
  }
};

exports.deleteSubFolder = async (req, res) => {
  try {
    const { subFolderId, FolderId } = req.body;
    await Folder.findByIdAndUpdate(
      { _id: FolderId },
      {
        $pull: {
          subFolder: subFolderId,
        },
      }
    );
    const subFolder = await SubFolder.findByIdAndDelete({ _id: subFolderId });

    if (!subFolder) {
      return res
        .status(404)
        .json({ success: false, message: "SubFolder not found" });
    }

    const updatedFolder = await Folder.findById(FolderId).populate("subFolder");

    return res.json({
      success: true,
      message: "SubFolder deleted successfully",
      data: updatedFolder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubFolder",
    });
  }
};
