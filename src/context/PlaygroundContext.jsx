import { createContext, useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { fetchhistoryDetails } from "../services/operations/historyAPI";
import { deleteFOLDER } from "../services/operations/historyAPI";
import { updateSubFOLDER } from "../services/operations/historyAPI";
import { saveSubFOLDER } from "../services/operations/historyAPI";
import { createSubFOLDER } from "../services/operations/historyAPI";
import { updateFOLDER } from "../services/operations/historyAPI";
import { deleteSubFOLDER } from "../services/operations/historyAPI";
import { createFOLDER } from "../services/operations/historyAPI";
import { getUserDetails } from "../services/operations/profileAPI";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";

export const PlaygroundContext = createContext();

export const languageMap = {
  cpp: {
    id: 54,
    defaultCode:
      "#include <iostream>\n" +
      "using namespace std;\n\n" +
      "int main() {\n" +
      '\tcout << "Hello World!";\n' +
      "\treturn 0;\n" +
      "}",
  },
  java: {
    id: 62,
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
  },
  python: {
    id: 71,
    defaultCode: `print("Hello World!")`,
  },
  javascript: {
    id: 63,
    defaultCode: `console.log("Hello World!");`,
  },
};

const PlaygroundProvider = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [folders, setFolders] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(false);

  const [loading, setLoading] = useState(false);

  const initialItems = {
    [uuid()]: {
      title: "DSA",
      playgrounds: {
        [uuid()]: {
          title: "Stack Implementation",
          language: "cpp",
          code: languageMap["cpp"].defaultCode,
        },
        [uuid()]: {
          name: "Array",
          language: "javascript",
          code: languageMap["javascript"].defaultCode,
        },
      },
    },
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     const token = JSON.parse(localStorage.getItem("token"));
  //     dispatch(getUserDetails(token, navigate));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const fh = async () => {
    setLoading(true);
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"));
      dispatch(getUserDetails(token, navigate));
    }
    try {
      const res = await fetchhistoryDetails(token);
      setFolders(res.data.Folders);
      setFetchTrigger((prev) => !prev);
      console.log("set", folders);
    } catch (error) {
      console.log("Could not fetch History.", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fh();
  }, [token]);

  useEffect(() => {
    if (fetchTrigger) {
      fh();
    }
  }, [fetchTrigger]);

  const handleDeleteSubFolder = async (FolderId, subFolderId) => {
    try {
      await deleteSubFOLDER({ FolderId, subFolderId }, token);
      toast.success("Deleted Successfully");
      setFetchTrigger((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCard = (folderId, cardId) => {
    // setSubLinks((oldState) => {
    //   const newState = { ...oldState };
    //   delete newState[folderId].playgrounds[cardId];
    //   return newState;
    // });
    handleDeleteSubFolder(folderId, cardId);
  };

  const handleDeleteFolder = async (FolderId) => {
    try {
      await deleteFOLDER({ FolderId }, token);
      toast.success("Deleted Successfully");
      setFetchTrigger((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFolder = (folderId) => {
    // setSubLinks((oldState) => {
    //   const newState = { ...oldState };
    //   delete newState[folderId];
    //   return newState;
    // });
    handleDeleteFolder(folderId);
  };

  const handleCreateFolder = async (FolderName) => {
    try {
      await createFOLDER({ FolderName }, token);
      toast.success("Created Successfully");
      setFetchTrigger((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const addFolder = (folderName) => {
    // setSubLinks((oldState) => {
    //   const newState = { ...oldState };

    //   newState[uuid()] = {
    //     title: folderName,
    //     playgrounds: {},
    //   };

    //   return newState;
    // });
    handleCreateFolder(folderName);
  };

  const handleCreateSubFolder = async (FolderId, title, language, code) => {
    try {
      await createSubFOLDER({ FolderId, title, language, code }, token);
      toast.success("Created Successfully");
      setFetchTrigger((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const addPlayground = (folderId, playgroundName, language) => {
    // setSubLinks((oldState) => {
    //   const newState = { ...oldState };

    //   newState[folderId].playgrounds[uuid()] = {
    //     title: playgroundName,
    //     language: language,
    //     code: languageMap[language].defaultCode,
    //   };

    //   return newState;
    // });
    handleCreateSubFolder(
      folderId,
      playgroundName,
      language,
      languageMap[`${language}`].defaultCode
    );
  };

  const handleUpdateFolder = async (FolderName, FolderId) => {
    try {
      await updateFOLDER({ FolderName, FolderId }, token);
      toast.success("Updated Successfully");
      setFetchTrigger((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const editFolderTitle = (folderId, folderName) => {
    // setSubLinks((oldState) => {
    //   const newState = { ...oldState };
    //   newState[folderId].title = folderName;
    //   return newState;
    // });
    handleUpdateFolder(folderName, folderId);
  };

  const handleUpdateSubFolder = async (FolderId, subFolderId, title) => {
    try {
      await updateSubFOLDER({ FolderId, subFolderId, title }, token);
      toast.success("Updated Successfully");
      setFetchTrigger((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const editPlaygroundTitle = (folderId, cardId, PlaygroundTitle) => {
    // setSubLinks((oldState) => {
    //   const newState = { ...oldState };
    //   newState[folderId].playgrounds[cardId].title = PlaygroundTitle;
    //   return newState;
    // });
    handleUpdateSubFolder(folderId, cardId, PlaygroundTitle);
  };

  const handleSaveSubFolder = async (
    folderId,
    cardId,
    newCode,
    newLanguage
  ) => {
    try {
      await saveSubFOLDER({ folderId, cardId, newCode, newLanguage }, token);
      toast.success("Saved Successfully");
      setFetchTrigger((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const savePlayground = (folderId, cardId, newCode, newLanguage) => {
    // setSubLinks((oldState) => {
    //   const newState = { ...oldState };
    //   newState[folderId].playgrounds[cardId].code = newCode;
    //   newState[folderId].playgrounds[cardId].language = newLanguage;
    //   return newState;
    // });
    handleSaveSubFolder(folderId, cardId, newCode, newLanguage);
  };

  const PlayGroundFeatures = {
    folders: folders,
    deleteCard: deleteCard,
    deleteFolder: deleteFolder,
    addFolder: addFolder,
    addPlayground: addPlayground,
    editFolderTitle: editFolderTitle,
    editPlaygroundTitle: editPlaygroundTitle,
    savePlayground: savePlayground,
  };

  return (
    <PlaygroundContext.Provider value={PlayGroundFeatures}>
      {children}
    </PlaygroundContext.Provider>
  );
};

export default PlaygroundProvider;
