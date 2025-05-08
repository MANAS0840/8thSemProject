import React, { useContext, useState } from "react";
import { Header, CloseButton, Input } from "../Modal";
import { IoCloseSharp } from "react-icons/io5";
import { ModalContext } from "../../context/ModalContext";
import { PlaygroundContext } from "../../context/PlaygroundContext";

const EditPlaygroundTitle = () => {
  const { isOpenModal, closeModal } = useContext(ModalContext);
  const { editPlaygroundTitle, folders } = useContext(PlaygroundContext);

  const { folderId, cardId } = isOpenModal.identifiers;

  const folder = folders.find((folder) => folder._id === folderId);

  // Find the subfolder by subolderId within the found folder
  const subFolder = folder.subFolder.find(
    (subFolder) => subFolder._id === cardId
  );
  let st = subFolder.title;

  const [playgroundTitle, setPlaygroundTitle] = useState(st);

  return (
    <>
      <Header>
        <h2>Edit Card Title</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp fontSize="22px" className="text-black" />
        </CloseButton>
      </Header>
      <Input>
        <input
          type="text"  className="text-black"
          onChange={(e) => setPlaygroundTitle(e.target.value)}
        />
        <button
          onClick={() => {
            editPlaygroundTitle(folderId, cardId, playgroundTitle);
            closeModal();
          }}
        >
          Update Title
        </button>
      </Input>
    </>
  );
};

export default EditPlaygroundTitle;
