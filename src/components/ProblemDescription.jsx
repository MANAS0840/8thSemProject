import CircleSkeleton from "./CircleSkeleton";
import RectangleSkeleton from "./RectangleSkeleton";
import { useEffect, useState } from "react";
import {
  AiFillLike,
  AiFillDislike,
  AiOutlineLoading3Quarters,
  AiFillStar,
} from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { toast } from "react-hot-toast";
import { problemEndpoints } from "../services/apis";
import { apiConnector } from "../services/apiConnector";
import { useSelector } from "react-redux";
import { json } from "react-router";

const ProblemDescription = ({ issubmf, setissubmf, problem, _solved }) => {
  const problemDifficultyClass =
    problem.difficulty === "Easy"
      ? "bg-olive text-olive"
      : problem.difficulty === "Medium"
      ? "bg-dark-yellow text-dark-yellow"
      : " bg-dark-pink text-dark-pink";

  const [isdesc, setisdesc] = useState(true);
  const [subm, setsubm] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [visibleCards, setVisibleCards] = useState({});

  const fn = async () => {
    let result = null;
    try {
      const response = await apiConnector(
        "GET",
        problemEndpoints.GET_SUBM_API,
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
      setsubm(result.data);
      setissubmf((prev) => !prev);
    } catch (error) {
      console.log("get_subm_API API ERROR............", error);
      result = error.response.data;
      // toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    fn();
  }, []);
  useEffect(() => {
    fn();
  }, [issubmf]);
  const convDate = (iodate) => {
    const date = new Date(iodate);

    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    return formattedDate;
  };
  const toggleVisibility = (id) => {
    setVisibleCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  return (
    // <>problem is {problem.difficulty + problemDifficultyClass}</>
    <div className="bg-dark-layer-1 h-[100vh] overflow-y-scroll">
      {/* TAB */}
      <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
        <div
          onClick={() => setisdesc(true)}
          className={
            "bg-dark-layer-1 mr-3 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
          }
        >
          Description
        </div>
        <div
          onClick={() => setisdesc(false)}
          className={
            "bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
          }
        >
          Submissions
        </div>
      </div>

      <div className="flex px-0 py-4 ">
        <div className=" w-full px-5 ">
          {/* Problem heading */}
          {!isdesc && (
            <div className="w-full ">
              {subm.length === 0 && (
                <div className="text-white text-lg m-5">No Submissions!</div>
              )}

              {subm.length > 0 && (
                <div className="w-full">
                  {subm.map((sub, idx) => (
                    <div className="flex-col">
                      <div
                        key={sub._id}
                        className={`flex sub p-1 border-b-2  justify-between cursor-pointer gap-10 text-white text-md`}
                        onClick={() => toggleVisibility(sub._id)}
                      >
                        <div className=" flex-col gap-2">
                          <div className="text-green-500">Accepted</div>
                          <div className="text-gray-500">
                            {convDate(sub.submittedAt)}
                          </div>
                        </div>
                        <p>{sub.language}</p>
                      </div>
                      {visibleCards[sub._id] && (
                        <div className="example-card">
                          <pre className="text-white  text-md p-2">
                            {sub.code}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {isdesc && (
            <div className="w-full mb-4 desc">
              <div className="flex space-x-4">
                <div className="flex-1 mr-2 text-lg text-white font-medium">
                  {problem?.title}
                </div>
              </div>
              {problem && (
                <div className="flex items-center mt-3">
                  <div
                    className={`${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                  >
                    {problem.difficulty}
                  </div>
                  {_solved && (
                    <div className="rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s">
                      <BsCheck2Circle />
                    </div>
                  )}
                </div>
              )}

              {/* {loading && (
              <div className="mt-3 flex space-x-2">
                <RectangleSkeleton />
                <CircleSkeleton />
                <RectangleSkeleton />
                <RectangleSkeleton />
                <CircleSkeleton />
              </div>
            )} */}

              {/* Problem Statement(paragraphs) */}
              <div className="text-white text-sm">
                <div
                  dangerouslySetInnerHTML={{ __html: problem.problemStatement }}
                />
              </div>

              {/* Examples */}
              <div className="mt-4">
                {problem.examples.map((example, index) => (
                  <div key={example._id}>
                    {example.inputText !== "" && (
                      <>
                        <p className="font-medium text-white ">
                          Example {index + 1}:{" "}
                        </p>

                        <div className="example-card">
                          <pre>
                            <strong className="text-white">Input: </strong>{" "}
                            {example.inputText}
                            <br />
                            <strong>Output: </strong>
                            {/* <span
                              dangerouslySetInnerHTML={{
                                __html: example.outputText,
                              }}
                            />{" "} */}
                            {example.outputText.split("\n").length > 1
                              ? `\n${example.outputText}`
                              : example.outputText}
                            {/* {`\n${example.outputText}`} */}
                            <br />
                            {example.explanation && (
                              <>
                                <strong>Explanation:</strong>{" "}
                                {example.explanation}
                              </>
                            )}
                          </pre>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="my-8 pb-4">
                <div className="text-white text-sm font-medium">
                  Constraints:
                </div>
                <ul className="text-white ml-5 list-disc ">
                  <div
                    dangerouslySetInnerHTML={{ __html: problem.constraints }}
                  />
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProblemDescription;
