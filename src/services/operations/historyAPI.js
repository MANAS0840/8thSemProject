import { toast } from "react-hot-toast";

import { apiConnector } from "../apiConnector";
import { historyEndpoints } from "../apis";
import { useSelector } from "react-redux";

const {
  HISTORY_DETAILS_API,
  CREATE_FOLDER_API,
  CREATE_SUBFOLDER_API,
  UPDATE_FOLDER_API,
  UPDATE_SUBFOLDER_API,
  SAVE_SUBFOLDER_API,
  DELETE_FOLDER_API,
  DELETE_SUBFOLDER_API,
} = historyEndpoints;

export const fetchhistoryDetails = async (token) => {
  const toastId = toast.loading("Loading...");
  //   dispatch(setLoading(true));
  let result = null;
  try {
    const response = await apiConnector("GET", HISTORY_DETAILS_API, null, {
      Authorization: `Bearer ${token}`,
    });
    // console.log("HISTORY_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data;
  } catch (error) {
    console.log("HISTORY_DETAILS_API API ERROR............", error);
    result = error.response.data;
    // toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
  //   dispatch(setLoading(false));
  return result;
};

// create a FOLDER
export const createFOLDER = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_FOLDER_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE FOLDER API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Create FOLDER");
    }
    toast.success("HISTORY FOLDER Created");
    result = response?.data?.updatedHISTORY;
  } catch (error) {
    console.log("CREATE FOLDER API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// create a subFOLDER
export const createSubFOLDER = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_SUBFOLDER_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE SUB-FOLDER API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture");
    }
    toast.success("Lecture Added");
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE SUB-FOLDER API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// update a FOLDER
export const updateFOLDER = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", UPDATE_FOLDER_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE FOLDER API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Update FOLDER");
    }
    toast.success("HISTORY FOLDER Updated");
    result = response?.data?.data;
  } catch (error) {
    console.log("UPDATE FOLDER API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// update a subFOLDER
export const updateSubFOLDER = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", UPDATE_SUBFOLDER_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE SUB-FOLDER API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture");
    }
    toast.success("Lecture Updated");
    result = response?.data?.data;
  } catch (error) {
    console.log("UPDATE SUB-FOLDER API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
export const saveSubFOLDER = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", SAVE_SUBFOLDER_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("SAVE SUB-FOLDER API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture");
    }
    toast.success("Lecture Updated");
    result = response?.data?.data;
  } catch (error) {
    console.log("SAVE SUB-FOLDER API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// delete a FOLDER
export const deleteFOLDER = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", DELETE_FOLDER_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE FOLDER API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete FOLDER");
    }
    toast.success("HISTORY FOLDER Deleted");
    result = response?.data?.data;
  } catch (error) {
    console.log("DELETE FOLDER API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
// delete a subFOLDER
export const deleteSubFOLDER = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", DELETE_SUBFOLDER_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE SUB-FOLDER API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture");
    }
    toast.success("Lecture Deleted");
    result = response?.data?.data;
  } catch (error) {
    console.log("DELETE SUB-FOLDER API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
