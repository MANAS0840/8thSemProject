import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "./EditorFooter";
import toast from "react-hot-toast";
import useLocalStorage from "../hooks/useLocalStorage";
import { useSelector } from "react-redux";
import axios from "axios";
import { apiConnector } from "../services/apiConnector";
import { problemEndpoints } from "../services/apis";

const WPlayground = ({
  issubmf,
  setissubmf,
  problem,
  setSuccess,
  setSolved,
}) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("java");
  const [isrun, setisrun] = useState(false);
  const [t1, sett1] = useState(false);
  const [t2, sett2] = useState(false);
  const [t3, sett3] = useState(false);
  const [t4, sett4] = useState(false);
  const [output1, setoutput1] = useState("");
  const [output2, setoutput2] = useState("");
  const [output3, setoutput3] = useState("");
  const [output4, setoutput4] = useState("");
  const [expout, setexpout] = useState("");
  const [expouta, setexpouta] = useState("");
  const [iscust, setiscust] = useState(false);

  let [userCode, setUserCode] = useState("");

  const { token } = useSelector((state) => state.auth);
  const [isloading, setisloading] = useState(true);
  const [isload, setisload] = useState(false);
  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");

  const [settings, setSettings] = useState({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });

  useEffect(() => {
    (async () => {
      let result = null;
      try {
        const response = await apiConnector(
          "GET",
          problemEndpoints.GET_CODE_API,
          null,
          {
            probid: problem._id,
            Authorization: `Bearer ${token}`,
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }
        result = response.data;
        setUserCode(result.data.code[currentLanguage]);
      } catch (error) {
        console.log("get_code_API API ERROR............", error);
        result = error.response.data;
        // toast.error(error.response.data.message);
      }
    })();
  }, [currentLanguage]);

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

  const custsubmit = async () => {
    try {
      let stdin = inputValue;
      let correct_code = problem.correctCode;
      const result2 = await postSubmission(
        currentLanguage,
        correct_code,
        stdin
      );
      const { run } = result2;
      if (!run || !run.output) {
        console.error("No output received from postSubmission");
        setexpout(""); // Handle the error case appropriately
        return;
      }
      let output = run.output.split("\n");
      if (!(output.length > 1)) {
        output = output.join("\n").trim();
      } else {
        for (let i = 0; i < output.length; i++) {
          if (!(output[i] === "")) {
            output[i] = output[i].trim();
          } else {
            output.splice(i, 1);
          }
        }
        output = output.join("\n").trim();
      }
      if (!output) {
        console.warn("Processed output is empty:", output);
      }
      setexpout(output);

      console.log("Final expout:", output);
      return output;
    } catch (err) {
      console.error("Error in custsubmit:", err);
      setexpout("");
    }
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
  // const waitForExpout = (exp) => {
  //   return new Promise((resolve) => {
  //     const checkExpout = setInterval(() => {
  //       if (exp !== "") {
  //         clearInterval(checkExpout);
  //         resolve();
  //       }
  //     }, 500); // Check every 500ms
  //   });
  // };
  // useEffect(() => {
  //   console.log(expout);
  //   toast.success("expout changed");
  //   setexpouta(expout);
  // }, [expout]);
  const runCode = async () => {
    try {
      setisrun(true);
      setisloading(true); // Start loading
      setisload(true);
      const loadingToastId = toast.loading("Running your code...");

      let source_code = userCode;

      let allTestsPassed = true; // Flag to track if all tests passed

      for (let i = 0; i < 4; i++) {
        let stdin;
        if (i == 3) {
          stdin = inputValue;
        } else {
          stdin = problem.examples[i].input;
        }
        let exp;
        if (i == 3) {
          exp = await custsubmit();

          // await waitForExpout(exp);
        }
        const result = await postSubmission(
          currentLanguage,
          source_code,
          stdin
        );

        const { run } = result;

        let output = run.output.split("\n");
        let serr = run.stderr;

        if (!(output.length > 1)) {
          output = output.join("\n").trim();
        } else {
          for (let i = 0; i < output.length; i++) {
            if (!(output[i] === "")) {
              output[i] = output[i].trim();
            } else {
              output.splice(i, 1);
            }
          }
          output = output.join("\n").trim();
        }

        if (
          i != 3
            ? output === problem.examples[i].outputText && serr === ""
            : output === exp && serr === ""
        ) {
          if (i === 0) {
            setoutput1(output);
            sett1(true);
          } else if (i === 1) {
            setoutput2(output);
            sett2(true);
          } else if (i === 2) {
            setoutput3(output);
            sett3(true);
          } else {
            setoutput4(output);
            sett4(true);
          }
        } else {
          allTestsPassed = false; // If any test case fails, set to false
          if (i === 0) {
            setoutput1(output);
            sett1(false);
          } else if (i === 1) {
            setoutput2(output);
            sett2(false);
          } else if (i === 2) {
            setoutput3(output);
            sett3(false);
          } else {
            setoutput4(output);
            sett4(false);
          }
        }
      }

      setisloading(false); // End loading
      setisload(false);

      // Save the user code in starter code
      try {
        const response = await apiConnector(
          "POST",
          problemEndpoints.UPDATE_CODE_API,
          { probid: problem._id, newCode: userCode, lang: currentLanguage },
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.log("update_code_API API ERROR............", error);
        // toast.error(error.response.data.message);
      }

      // Display result toast
      if (allTestsPassed) {
        toast.success("Congrats! All testCase passed!", {
          position: "top-center",
          autoClose: 3000,
          id: loadingToastId,
          theme: "dark",
        });
      } else {
        toast.error("Cannot Pass all TestCases!", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          id: loadingToastId,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitCode = async () => {
    try {
      setisrun(true);
      setisloading(true); // Start loading
      setisload(true);
      const loadingToastId = toast.loading("Running your code...");
      const source_code = userCode;
      let allTestsPassed = true; // Flag to track if all tests passed

      for (let i = 0; i < 4; i++) {
        let stdin;
        if (i == 3) {
          stdin = inputValue;
        } else {
          stdin = problem.examples[i].input;
        }
        let exp;
        if (i == 3) {
          exp = await custsubmit();

          // await waitForExpout(exp);
        }
        const result = await postSubmission(
          currentLanguage,
          source_code,
          stdin
        );

        const { run } = result;
        let output = run.output.split("\n");
        let serr = run.stderr;

        output = output.join("\n").trim();
        console.log(i + 1, output);

        if (
          i != 3
            ? output === problem.examples[i].outputText && serr === ""
            : output === exp && serr === ""
        ) {
          if (i === 0) {
            setoutput1(output);
            sett1(true);
          } else if (i === 1) {
            setoutput2(output);
            sett2(true);
          } else if (i === 2) {
            setoutput3(output);
            sett3(true);
          } else {
            setoutput4(output);
            sett4(true);
          }
        } else {
          allTestsPassed = false; // If any test case fails, set to false
          if (i === 0) {
            setoutput1(output);
            sett1(false);
          } else if (i === 1) {
            setoutput2(output);
            sett2(false);
          } else if (i === 2) {
            setoutput3(output);
            sett3(false);
          } else {
            setoutput4(output);
            sett4(false);
          }
        }
      }

      setisloading(false); // End loading
      setisload(false);

      // Save the user code in starter code
      try {
        if (allTestsPassed) {
          const response = await apiConnector(
            "POST",
            problemEndpoints.SAVE_CODE_API,
            { probid: problem._id, newCode: userCode, lang: currentLanguage },
            {
              Authorization: `Bearer ${token}`,
            }
          );

          if (!response.data.success) {
            throw new Error(response.data.message);
          }
          setissubmf((prev) => !prev);
        } else {
          const response = await apiConnector(
            "POST",
            problemEndpoints.UPDATE_CODE_API,
            { probid: problem._id, newCode: userCode, lang: currentLanguage },
            {
              Authorization: `Bearer ${token}`,
            }
          );

          if (!response.data.success) {
            throw new Error(response.data.message);
          }
        }
      } catch (error) {
        console.log("update_code_API API ERROR............", error);
        // toast.error(error.response.data.message);
      }

      // Display result toast
      if (allTestsPassed) {
        toast.success("Congrats! All testCase passed!", {
          position: "top-center",
          autoClose: 3000,
          id: loadingToastId,
          theme: "dark",
        });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 4000);
      } else {
        toast.error("Cannot Pass all TestCases!", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          id: loadingToastId,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onChange = (value) => {
    setUserCode(value);
    localStorage.setItem(`code-${problem._id}`, JSON.stringify(value));
  };
  const [inputValue, setInputValue] = useState(problem.examples[0].input);

  return (
    <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden ">
      <PreferenceNav
        runCode={runCode}
        submitCode={submitCode}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        settings={settings}
        setSettings={setSettings}
      />

      <Split
        className="h-[100vh] overflow-y-scroll"
        direction="vertical"
        sizes={[60, 40]}
        minSize={60}
      >
        <div className="w-full overflow-auto">
          <CodeMirror
            className="source-code-pro-scp"
            value={userCode}
            theme={vscodeDark}
            onChange={onChange}
            extensions={[javascript()]}
            style={{
              fontSize: settings.fontSize,
            }}
          />
        </div>
        <div className="w-full  relative px-5 overflow-y-scroll">
          {/* testcase heading */}
          {isload ? (
            <>
              <div class=" h-[85%] flex justify-center items-center">
                <span className="loader"></span>
              </div>
            </>
          ) : (
            <div className={!isloading && `term`}>
              <div className="flex h-10 items-center  space-x-6">
                <div className="relative flex h-full flex-col justify-center cursor-pointer">
                  <div className="text-sm font-medium leading-5 text-white">
                    Testcases
                  </div>
                  <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white" />
                </div>
              </div>
              <div className="flex">
                {problem.examples.map((example, index) => (
                  <div
                    className="mr-2 items-start mt-2 "
                    key={example._id}
                    onClick={() => {
                      setActiveTestCaseId(index);
                      setiscust(false);
                    }}
                  >
                    {example.inputText === "" ? (
                      ""
                    ) : (
                      <div className="flex flex-wrap items-center gap-y-4">
                        <div
                          className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
                      ${
                        activeTestCaseId === index
                          ? "text-white"
                          : "text-gray-500"
                      }
                    `}
                        >
                          {index == 0 && t1 ? (
                            <span class="dot"></span>
                          ) : index == 0 && isrun ? (
                            <span class="rdot"></span>
                          ) : (
                            ""
                          )}
                          {index == 1 && t2 ? (
                            <span class="dot"></span>
                          ) : index == 1 && isrun ? (
                            <span class="rdot"></span>
                          ) : (
                            ""
                          )}
                          {index == 2 && t3 ? (
                            <span class="dot"></span>
                          ) : index == 2 && isrun ? (
                            <span class="rdot"></span>
                          ) : (
                            ""
                          )}
                          Case {index + 1}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div
                  onClick={() => {
                    setiscust(true);
                    setActiveTestCaseId(4);
                  }}
                  className={`font-medium mt-2 h-[30px] items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${iscust ? "text-white" : "text-gray-500"}  
									`}
                >
                  {t4 && isrun ? (
                    <span class="dot"></span>
                  ) : isrun ? (
                    <span class="rdot"></span>
                  ) : (
                    ""
                  )}
                  Custom Input
                </div>
              </div>
              {iscust ? (
                <>
                  <div className="font-semibold my-8 ">
                    <p className="text-sm font-medium mt-4 text-white">
                      {"Input:"}
                    </p>
                    <input
                      type="text"
                      name="input"
                      className="w-full  rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>
                  {isrun && (
                    <>
                      <p className="text-sm font-medium mt-4 text-white">
                        {"Output:"}
                      </p>
                      <div className="w-full  rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
                        {output4}
                      </div>
                      <p className="text-sm font-medium mt-6 text-white">
                        {"Expected:"}
                      </p>
                      <div className="w-full  rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
                        {expout}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="font-semibold my-4 ">
                  <p className="text-sm font-medium mt-4 text-white">
                    {isrun ? "Output:" : "Input:"}
                  </p>
                  <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
                    {!isrun && problem.examples[activeTestCaseId].inputText}
                    {isrun &&
                      (activeTestCaseId == 0
                        ? output1
                        : activeTestCaseId == 1
                        ? output2
                        : output3)}
                  </div>
                  <p className="text-sm font-medium mt-4 text-white">
                    {isrun ? "Expected:" : "Output:"}
                  </p>
                  <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
                    {problem.examples[activeTestCaseId].outputText}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Split>
      {/* <EditorFooter /> */}
    </div>
  );
};
export default WPlayground;
