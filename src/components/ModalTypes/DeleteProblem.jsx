import React, { useContext, useState } from "react";
import { Header, CloseButton } from "../Modal";
import { IoCloseSharp } from "react-icons/io5";
import { ModalContext } from "../../context/ModalContext";
import Select from "react-select";
import styled from "styled-components";
import { apiConnector } from "../../services/apiConnector";
import { problemEndpoints } from "../../services/apis";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
const InputWithSelect = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr;
  gap: 1rem;
  margin-top: 1.2rem;
  align-items: center;

  input {
    flex-grow: 1;
    height: 2rem;
  }

  button {
    background: #241f21;
    height: 2.5rem;
    color: white;
    padding: 0.3rem 2rem;
  }

  & > div {
    width: 8rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DeleteProblem = () => {
  const { isOpenModal, closeModal } = useContext(ModalContext);
  const { token } = useSelector((state) => state.auth);

  const { ProblemId } = isOpenModal.identifiers;

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
      //   fetchProblems();
      //   setIsOpenModal({ ...initialModalFields, onClose: true });
      toast.success("Problem Deleted!");
    } catch (error) {
      console.log("DELETE FOLDER API ERROR", error);
      toast.error("Something Went Wrong!");
    }
  };

  return (
    <>
      <Header>
        <h2>Click Confirm to Delete</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp fontSize="22px" className="text-black" />
        </CloseButton>
      </Header>
      <InputWithSelect>
        <button
          className="bg-red-600 text-white"
          onClick={() => {
            handleDeleteProblem(ProblemId);
            closeModal();
          }}
        >
          {" "}
          Confirm{" "}
        </button>
      </InputWithSelect>
    </>
  );
};

export default DeleteProblem;
