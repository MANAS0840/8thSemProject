import React, { useContext, useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { IoTrashOutline } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { problemEndpoints } from "../services/apis";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../context/ModalContext";

const ProblemsTable = ({ setLoadingProblems }) => {
  const { openModal, closeModal } = useContext(ModalContext);
  const [problems, setProblems] = useState([]);
  const [sproblems, setsProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage] = useState(10); // Number of problems per page
  const [totalPages, setTotalPages] = useState(1);

  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tagsFilter, setTagsFilter] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const fetchProblems = async () => {
    try {
      const response = await apiConnector(
        "GET",
        problemEndpoints.PROBLEM_DETAILS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      const response2 = await apiConnector(
        "GET",
        problemEndpoints.SPROBLEM_DETAILS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success && !response2.data.success) {
        throw new Error(response.data.message);
      }
      setsProblems(response2.data.data);
      console.log("fe");
      setProblems(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / problemsPerPage));
    } catch (error) {
      console.log("PROBLEM_DETAILS_API API ERROR", error);
      toast.error("Error fetching problems");
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [token]);

  const handleDeleteProblem = async (ProblemId) => {
    try {
      const response = await apiConnector(
        "POST",
        problemEndpoints.DELETE_PROBLEM_API,
        { ProblemId },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response?.data?.success) {
        throw new Error("Could Not Delete problem");
      }
      fetchProblems();
      toast.success("Problem Deleted!");
    } catch (error) {
      console.log("DELETE FOLDER API ERROR", error);
      toast.error("Something Went Wrong!");
    }
  };

  const handleEditProblem = (ProblemId) => {
    navigate("/problems/editproblem", {
      state: { ProblemId: ProblemId },
    });
  };

  // Filtering logic
  const filteredProblems = problems.filter((problem) => {
    // Filter by difficulty
    if (difficultyFilter !== "All" && problem.difficulty !== difficultyFilter) {
      return false;
    }

    // Filter by status
    if (statusFilter === "Solved" && !sproblems.includes(problem._id)) {
      return false;
    } else if (statusFilter === "ToDo" && sproblems.includes(problem._id)) {
      return false;
    }

    // Filter by tags
    if (
      tagsFilter.length > 0 &&
      !tagsFilter.some((tag) => problem.tags.includes(tag))
    ) {
      return false;
    }

    // Filter by search term
    if (
      searchTerm &&
      !problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {/* Filter UI */}
      <div className="w-[85%] mt-8 mx-auto flex items-center justify-around">
        <select
          className="bg-gray-600 text-white h-[30px] w-[150px]"
          onChange={(e) => setDifficultyFilter(e.target.value)}
          value={difficultyFilter}
        >
          <option value="All">Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          className="bg-gray-600 text-white h-[30px] w-[150px]"
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilter}
        >
          <option value="All">Status</option>
          <option value="Solved">Solved</option>
          <option value="ToDo">ToDo</option>
        </select>
        <div>
          <select
            className="bg-gray-600 text-white h-[30px] w-[150px]"
            onChange={(e) => setTagsFilter([...tagsFilter, e.target.value])}
          >
            <option value="">Select Tag</option>
            <option value="arrays">Array</option>
            <option value="matrix">Matrix</option>
            <option value="string">String</option>
            <option value="Hash Table">Hash Table</option>
            {/* Add other tags as necessary */}
          </select>
        </div>

        <input
          className="bg-gray-600 text-white h-[30px] w-[220px]"
          type="text"
          placeholder="Search questions"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div
        className={`m-2 w-[85%] mx-auto p-2 ${
          tagsFilter.length === 0 && "hidden"
        }`}
      >
        {tagsFilter.map((tag, index) => (
          <span
            className="text-white m-2 border-2 p-1 cursor-pointer"
            key={index}
            onClick={() => setTagsFilter(tagsFilter.filter((t) => t !== tag))}
          >
            {tag} &times;
          </span>
        ))}
      </div>
      <table className="text-sm text-left text-gray-500 dark:text-gray-400 sm:w-10/12 w-full max-w-[1900px] mx-auto">
        {
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b ">
            <tr>
              <th scope="col" className="px-1 py-3 w-0 font-medium">
                Status
              </th>
              <th scope="col" className="px-6 py-3 w-0 font-medium">
                Title
              </th>
              <th scope="col" className="px-6 py-3 w-0 font-medium">
                Difficulty
              </th>

              <th scope="col" className="px-6 py-3 w-0 font-medium">
                Category
              </th>
              {user?.accountType === "Admin" && (
                <th scope="col" className="px-6 py-3 w-0 font-medium">
                  Operations
                </th>
              )}
            </tr>
          </thead>
        }
        <tbody className="text-white">
          {currentProblems.map((problem, idx) => {
            const difficultyColor =
              problem.difficulty === "Easy"
                ? "text-dark-green-s"
                : problem.difficulty === "Medium"
                ? "text-dark-yellow"
                : "text-dark-pink";
            return (
              <tr
                className={`${idx % 2 === 1 ? "bg-dark-layer-1" : ""}`}
                key={problem._id}
              >
                <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                  {sproblems.includes(problem._id) && (
                    <BsCheckCircle fontSize={"18"} width="18" />
                  )}
                </th>
                <td className="px-6 py-4">
                  {problem.link ? (
                    <Link
                      href={problem.link}
                      className="hover:text-blue-600 cursor-pointer"
                      target="_blank"
                    >
                      {problem.title}
                    </Link>
                  ) : (
                    <Link
                      className="hover:text-blue-600 text-[1rem] cursor-pointer"
                      to={`/problems/${problem._id}/${problem.title}`}
                    >
                      {problem.title}
                    </Link>
                  )}
                </td>
                <td className={`px-6 py-4 ${difficultyColor}`}>
                  {problem.difficulty}
                </td>
                <td className={"px-6 py-4"}>{problem.category}</td>
                {user?.accountType === "Admin" && (
                  <td className={"px-6 py-4 flex gap-2"}>
                    <IoTrashOutline
                      className="cursor-pointer text-md"
                      onClick={() => {
                        openModal({
                          show: true,
                          modalType: 7,
                          identifiers: {
                            folderId: "",
                            cardId: "",
                            ProblemId: problem._id,
                          },
                          onClose: () => {
                            // Callback function to be executed when modal is closed
                            fetchProblems(); // Example: Fetch problems after modal is closed
                          },
                        });
                      }}
                    />

                    <BiEditAlt
                      className="cursor-pointer text-md"
                      onClick={() => handleEditProblem(problem._id)}
                    />
                  </td>
                )}
              </tr>
            );
          })}
          {/* Pagination Row */}
          <tr>
            <td colSpan="100%" className="px-6 py-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="m-4 rounded-[8px] border-2 bg-richblack-800 lg:px-[12px] lg:py-[8px] text-white lg:font-bold relative lg:top-0 top-[-0.5rem]"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="m-4 rounded-[8px] border-2 bg-richblack-800 lg:px-[12px] lg:py-[8px] text-white lg:font-bold relative lg:top-0 top-[-0.5rem]"
                >
                  Next
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProblemsTable;
