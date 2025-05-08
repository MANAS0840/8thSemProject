import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { problemEndpoints } from "../services/apis";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const UpdateProblem = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const initialData = {
    title: "tHREE Sum",
    difficulty: "Easy",
    tags: [],
    problemStatement:
      "<p class='mt-3'> Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to</em> <code>target</code>.</p><p class='mt-3'> You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p><p class='mt-3'>You can return the answer in any order.</p>",
    category: "arrays",
    examples: [
      {
        inputText: "size of nums=4, nums = [2,7,11,15], target = 9",
        input: "4 2 7 11 15 9",
        outputText: "0 1",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        inputText: "size of nums=3, nums = [3,2,4], target = 6",
        input: "3 3 2 4 6",
        outputText: "1 2",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
      {
        inputText: "size of nums=2, nums = [3,3], target = 6",
        input: "2 3 3 6",
        outputText: "0 1",
      },
    ],
    constraints:
      "<li class='mt-2'><code>2 ≤ nums.length ≤ 10</code></li> <li class='mt-2'><code>-10 ≤ nums[i] ≤ 10</code></li> <li class='mt-2'><code>-10 ≤ target ≤ 10</code></li><li class='mt-2 text-sm'><strong>Only one valid answer exists.</strong></li>",
    correctCode: "",
  };
  const [problem, setProblem] = useState([]);
  const [formData, setFormData] = useState(initialData);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    (async () => {
      let result = null;
      try {
        const response = await apiConnector(
          "GET",
          problemEndpoints.PROBLEM_DETAIL_API,
          null,
          {
            probid: data.ProblemId,
            Authorization: `Bearer ${token}`,
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }
        result = response.data;

        setProblem(result.data);
        result = result.data[0];
        console.log("res", result.difficulty);
        setFormData({
          title: result.title,
          difficulty: result.difficulty,
          tags: result.tags || [],
          problemStatement: result.problemStatement,
          category: result.category,
          examples: result.examples,
          constraints: result.constraints,
          correctCode: result.correctCode,
        });
      } catch (error) {
        console.log("Problem_DETAIL_API API ERROR............", error);
        result = error.response.data;

        // toast.error(error.response.data.message);
      }
    })();
  }, [data?.ProblemId]);

  //   // Initial default values

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleExampleChange = (index, e) => {
    const { name, value } = e.target;
    const newExamples = [...formData.examples];
    newExamples[index][name] = value;
    setFormData({ ...formData, examples: newExamples });
  };

  const addExample = () => {
    setFormData({
      ...formData,
      examples: [
        ...formData.examples,
        { inputText: "", input: "", outputText: "", explanation: "" },
      ],
    });
  };

  const handleTagChange = (e) => {
    setTagInput(e.target.value);
  };

  const addTag = () => {
    if (tagInput.trim() !== "") {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result = null;
    try {
      const response = await apiConnector(
        "POST",
        problemEndpoints.UPDATE_PROBLEM_API,
        { ...formData, ProblemId: data.ProblemId },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Problem Updated!");
      navigate("/problems");
    } catch (error) {
      console.log("UPDATE_PROBLEM_API API ERROR............", error);
      result = error.response.data;
      toast.error("Something Went Wrong!");
    }
  };
  if (user?.accountType !== "Admin" || data === null) {
    return (
      <div className="text-lg m-4">This is protected Route for Admin!</div>
    );
  }

  return (
    <div className="bg-dark-layer-2 text-white m-0 p-4">
      <div className=" w-[95vw] mx-auto flex gap-4 h-[100vh] overflow-y-scroll ">
        <form onSubmit={handleSubmit}>
          <div className="m-2 inline-block">
            <label htmlFor="title">Title:</label>
            <input
              className="ainput bg-slate-500"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="inline-block m-2">
            <label className="m-2">Difficulty:</label>
            <label className="m-2">
              <input
                className="m-1"
                type="radio"
                name="difficulty"
                value="Easy"
                checked={formData.difficulty === "Easy"}
                onChange={handleChange}
              />
              Easy
            </label>
            <label className="m-2">
              <input
                className="m-1"
                type="radio"
                name="difficulty"
                value="Medium"
                checked={formData.difficulty === "Medium"}
                onChange={handleChange}
              />
              Medium
            </label>
            <label className="m-2">
              <input
                className="m-1"
                type="radio"
                name="difficulty"
                value="Hard"
                checked={formData.difficulty === "Hard"}
                onChange={handleChange}
              />
              Hard
            </label>
          </div>
          <div className="inline-block m-2 ml-7">
            <label htmlFor="category">Category:</label>
            <input
              className="w-[200px] p-1 m-2 bg-slate-500"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="m-2 inline-block mr-[200px]">
            <label htmlFor="tags" className="mb-2">
              Tags:
            </label>
            <div>
              {formData.tags.map((tag, index) => (
                <span key={index} style={{ marginRight: "8px" }}>
                  {tag}
                </span>
              ))}
            </div>
            <input
              type="text"
              className="p-1 w-[200px] m-2 bg-slate-500"
              value={tagInput}
              onChange={handleTagChange}
              placeholder="Add a tag"
            />
            <button
              type="button"
              className="border-2 p-1 border-r-2 bg-slate-600 text-white"
              onClick={addTag}
            >
              Add Tag
            </button>
          </div>

          <div className="flex items-center">
            <label className="m-2" htmlFor="problemStatement">
              Problem Statement:
            </label>
            <textarea
              className="m-2 border-2 bg-slate-500"
              rows="8"
              cols="50"
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="m-2 p-2">
            <label className="m-2">Examples:</label>
            {formData.examples.map((example, index) => (
              <div key={index} className="border-2 flex-col mb-4">
                <p className="m-2">Example{index + 1}</p>
                <div className="flex items-center">
                  <label className="m-2" htmlFor="inputText">
                    Input Text:
                  </label>
                  <textarea
                    rows="5"
                    cols="50"
                    className="m-2  p-1 border-2 bg-slate-500"
                    type="text"
                    name="inputText"
                    value={example.inputText}
                    onChange={(e) => handleExampleChange(index, e)}
                  ></textarea>
                  <label className="ml-[70px] m-2" htmlFor="input">
                    Input:
                  </label>
                  <textarea
                    rows="5"
                    cols="50"
                    className="m-2  p-1 border-2 bg-slate-500"
                    type="text"
                    name="input"
                    value={example.input}
                    onChange={(e) => handleExampleChange(index, e)}
                  ></textarea>
                </div>
                <div className="flex items-center mt-4">
                  <label className="m-2" htmlFor="outputText">
                    Output Text:
                  </label>
                  <textarea
                    rows="5"
                    cols="50"
                    className="m-2  p-1 border-2 bg-slate-500"
                    type="text"
                    name="outputText"
                    value={example.outputText}
                    onChange={(e) => handleExampleChange(index, e)}
                  ></textarea>
                  <label className="ml-11" htmlFor="explanation">
                    Explanation:
                  </label>
                  <textarea
                    rows="5"
                    cols="50"
                    className="m-2  p-1 border-2 bg-slate-500"
                    type="text"
                    name="explanation"
                    value={example.explanation}
                    onChange={(e) => handleExampleChange(index, e)}
                  ></textarea>
                </div>
              </div>
            ))}
            <button
              className="border-2 p-1 border-r-2 bg-slate-600 text-white"
              type="button"
              onClick={addExample}
            >
              Add Example
            </button>
          </div>
          <div className="flex items-center">
            <div className="m-2 flex items-center w-[50%]">
              <label htmlFor="constraints">Constraints:</label>
              <textarea
                rows="5"
                cols="50"
                className="m-2  p-1 border-2 bg-slate-500"
                name="constraints"
                value={formData.constraints}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="m-2 flex items-center w-[50%]">
              <label htmlFor="correctCode">Correct Code:</label>
              <textarea
                rows="5"
                cols="50"
                className="m-2  p-1 border-2 bg-slate-500"
                name="correctCode"
                value={formData.correctCode}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="">
            <button
              className="border-2 p-1 border-r-2 bg-slate-600 text-white"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProblem;
