require("dotenv").config();
const BASE_URL = `https://code-master-api.vercel.app`;
// const BASE_URL = `http://localhost:4000`;

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
};

export const historyEndpoints = {
  HISTORY_DETAILS_API: BASE_URL + "/history/gethistoryDetails",
  CREATE_FOLDER_API: BASE_URL + "/history/addFolder",
  CREATE_SUBFOLDER_API: BASE_URL + "/history/addSubFolder",
  UPDATE_FOLDER_API: BASE_URL + "/history/updateFolder",
  UPDATE_SUBFOLDER_API: BASE_URL + "/history/updateSubFolder",
  SAVE_SUBFOLDER_API: BASE_URL + "/history/saveSubFolder",
  DELETE_FOLDER_API: BASE_URL + "/history/deleteFolder",
  DELETE_SUBFOLDER_API: BASE_URL + "/history/deleteSubFolder",
};
export const problemEndpoints = {
  PROBLEM_DETAILS_API: BASE_URL + "/problem/getAllProblems",
  PROBLEM_DETAIL_API: BASE_URL + "/problem/getProblem",
  CREATE_PROBLEM_API: BASE_URL + "/problem/addProblem",
  UPDATE_PROBLEM_API: BASE_URL + "/problem/updateProblem",
  UPDATE_CODE_API: BASE_URL + "/problem/updateCode",
  GET_CODE_API: BASE_URL + "/problem/getUserCode",
  SAVE_CODE_API: BASE_URL + "/problem/saveCode",
  GET_SUBM_API: BASE_URL + "/problem/getSubmissions",
  DELETE_PROBLEM_API: BASE_URL + "/problem/deleteProblem",
  SPROBLEM_DETAILS_API: BASE_URL + "/problem/getAllSolvedProblems",
};
