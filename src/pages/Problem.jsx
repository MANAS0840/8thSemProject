import { useSelector } from "react-redux";
import ProblemsTable from "../components/ProblemsTable";

import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { ModalContext } from "../context/ModalContext";

export default function Problem() {
  const { isOpenModal } = useContext(ModalContext);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const { user } = useSelector((state) => state.profile);

  return (
    <>
      <main className="bg-dark-layer-2 min-h-screen">
        <div className=" relative overflow-x-auto mx-auto px-6 pb-10">
          {user?.accountType === "Admin" && (
            <div>
              <Link to="/problems/addproblem">
                <button className="m-4 rounded-[8px] border-2 bg-richblack-800 lg:px-[12px] lg:py-[8px] text-white lg:font-bold relative lg:top-0 top-[-0.5rem] ">
                  Add Problem
                </button>
              </Link>
            </div>
          )}

          <ProblemsTable setLoadingProblems={setLoadingProblems} />
          {isOpenModal.show && <Modal />}
        </div>
      </main>
    </>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center space-x-12 mt-4 px-6">
      <div className="w-6 h-6 shrink-0 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52  w-32  rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
