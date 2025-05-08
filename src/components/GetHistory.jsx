import React from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import { historyEndpoints } from "../services/apis";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchhistoryDetails } from "../services/operations/historyAPI";
import { deleteFOLDER } from "../services/operations/historyAPI";

const GetHistory = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [subLinks, setSubLinks] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   (async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetchhistoryDetails(token);
  //       setSubLinks(res.data.data);
  //     } catch (error) {
  //       console.log("Could not fetch Investment.", error);
  //     }
  //     setLoading(false);
  //   })();
  // }, [subLinks]);

  const handleDeleteFolder = async (FolderId) => {
    try {
      await deleteFOLDER(FolderId, token);
      toast.success("Deleted Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteSubFolder = async (FolderId, subFolderId) => {
    try {
      await deleteFOLDER(FolderId, subFolderId, token);
      toast.success("Deleted Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateFolder = async (FolderName) => {
    try {
      await createFOLDER(FolderName, token);
      toast.success("Created Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateSubFolder = async (FolderId, title, language, code) => {
    try {
      await createSubFOLDER(FolderId, title, language, code, token);
      toast.success("Created Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFolder = async (fname, fid) => {
    try {
      await updateFOLDER(FolderName, FolderId, token);
      toast.success("Updated Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateSubFolder = async (FolderId, subFolderId, title) => {
    try {
      await updateSubFOLDER(FolderId, subFolderId, title, token);
      toast.success("Updated Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div></div>
    </div>
  );
};

export default GetHistory;
