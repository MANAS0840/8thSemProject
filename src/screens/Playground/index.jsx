import React, { useContext, useState } from "react";
import EditorContainer from "./EditorContainer";
import InputConsole from "./InputConsole";
import OutputConsole from "./OutputConsole";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  languageMap,
  PlaygroundContext,
} from "../../context/PlaygroundContext";
import { ModalContext } from "../../context/ModalContext";
import Modal from "../../components/Modal";
import { Buffer } from "buffer";
import axios from "axios";
import toast from "react-hot-toast";
const MainContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ isFullScreen }) =>
    isFullScreen ? "1fr" : "2fr 1fr"};
  min-height: ${({ isFullScreen }) =>
    isFullScreen ? "100vh" : "calc(100vh - 4.5rem)"};
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Consoles = styled.div`
  display: grid;
  width: 100%;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr;
`;

const Playground = () => {
  const { folderId, playgroundId } = useParams();
  const { folders, savePlayground } = useContext(PlaygroundContext);
  const { isOpenModal, openModal, closeModal } = useContext(ModalContext);
  const [isError, setIsError] = useState(false);

  const folder = folders.find((folder) => folder._id === folderId);

  // Find the subfolder by subolderId within the found folder
  const subFolder = folder.subFolder.find(
    (subFolder) => subFolder._id === playgroundId
  );
  const { title, language, code } = subFolder;

  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentCode, setCurrentCode] = useState(code);
  const [currentInput, setCurrentInput] = useState("");
  const [currentOutput, setCurrentOutput] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);

  // all logic of the playground
  const saveCode = () => {
    savePlayground(folderId, playgroundId, currentCode, currentLanguage);
  };

  const encode = (str) => {
    return Buffer.from(str, "binary").toString("base64");
  };

  const decode = (str) => {
    return Buffer.from(str, "base64").toString();
  };

  const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
  });

  const LANGUAGE_VERSIONS = {
    javascript: "18.15.0",
    typescript: "5.0.3",
    python: "3.10.0",
    java: "15.0.2",
    cpp: "10.2.0",
  };

  const postSubmission = async (curl, source_code, stdin) => {
    const response = await API.post("/execute", {
      language: curl,
      version: LANGUAGE_VERSIONS[curl],
      files: [
        {
          content: source_code,
        },
      ],
      stdin: stdin,
    });
    return response.data;
  };
  // const postSubmission = async (language_id, source_code, stdin) => {
  //   const options = {
  //     method: "POST",
  //     url: "https://judge0-ce.p.rapidapi.com/submissions",
  //     params: { base64_encoded: "true", fields: "*" },
  //     headers: {
  //       "content-type": "application/json",
  //       "Content-Type": "application/json",
  //       "X-RapidAPI-Key": "81b75f2b37msh835a4407ec1b9dfp154cebjsnb765e3143f6d",
  //       "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  //     },
  //     data: JSON.stringify({
  //       language_id: language_id,
  //       source_code: source_code,
  //       stdin: stdin,
  //     }),
  //   };

  //   const res = await axios.request(options);
  //   return res.data.token;
  // };

  // const getOutput = async (token) => {
  //   // we will make api call here
  //   const options = {
  //     method: "GET",
  //     url: "https://judge0-ce.p.rapidapi.com/submissions/" + token,
  //     params: { base64_encoded: "true", fields: "*" },
  //     headers: {
  //       "X-RapidAPI-Key": "81b75f2b37msh835a4407ec1b9dfp154cebjsnb765e3143f6d",
  //       "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  //     },
  //   };

  // call the api
  //   const res = await axios.request(options);
  //   if (res.data.status_id <= 2) {
  //     const res2 = await getOutput(token);
  //     return res2.data;
  //   }
  //   return res.data;
  // };

  const runCode = async () => {
    try {
      openModal({
        show: true,
        modalType: 6,
        identifiers: {
          folderId: "",
          cardId: "",
        },
      });
      const language_id = languageMap[currentLanguage].id;
      const source_code = currentCode;
      const stdin = currentInput;

      // pass these things to Create Submissions
      // const token = await postSubmission(language_id, source_code, stdin);
      const result = await postSubmission(currentLanguage, source_code, stdin);

      const { run } = result;
      setCurrentOutput(run.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (err) {
      console.log(err);
      toast.error("Unable to run Code!");
      closeModal();
    }
    closeModal();
  };

  const getFile = (e, setState) => {
    const input = e.target;
    if ("files" in input && input.files.length > 0) {
      placeFileContent(input.files[0], setState);
    }
  };

  const placeFileContent = (file, setState) => {
    readFileContent(file)
      .then((content) => {
        setState(content);
      })
      .catch((error) => console.log(error));
  };

  function readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  return (
    <div>
      <MainContainer isFullScreen={isFullScreen}>
        <EditorContainer
          title={title}
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
          currentCode={currentCode}
          setCurrentCode={setCurrentCode}
          folderId={folderId}
          playgroundId={playgroundId}
          saveCode={saveCode}
          runCode={runCode}
          getFile={getFile}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
        />
        <Consoles>
          <InputConsole
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            getFile={getFile}
          />
          <OutputConsole currentOutput={currentOutput} />
        </Consoles>
      </MainContainer>
      {isOpenModal.show && <Modal />}
    </div>
  );
};

export default Playground;
