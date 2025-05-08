import React, { useContext } from "react";
import styled from "styled-components";
import LeftComponent from "./LeftComponent";
import RightComponent from "./RightComponent";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Modal from "../../components/Modal";
import { ModalContext } from "../../context/ModalContext";
import { getUserDetails } from "../../services/operations/profileAPI";
import { useSelector, useDispatch } from "react-redux";

const StyledHome = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: rgb(40,40,40);
  color: white;
`;

const Home = () => {
  const { isOpenModal } = useContext(ModalContext);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const fh = async () => {
  //   setLoading(true);
  //   if (localStorage.getItem("token")) {
  //     const token = JSON.parse(localStorage.getItem("token"));
  //     dispatch(getUserDetails(token, navigate));
  //   }

  //   setLoading(false);
  // };

  return (
    <StyledHome>
      <LeftComponent />
      <RightComponent />
      {isOpenModal.show && <Modal />}
    </StyledHome>
  );
};

export default Home;
