import React, { useContext, useState } from "react";
import { Header, CloseButton, Input } from "../Modal";
import { IoCloseSharp } from "react-icons/io5";
import { ModalContext } from "../../context/ModalContext";
import { PlaygroundContext } from "../../context/PlaygroundContext";

const EditFolder = () => {
  const { closeModal, isOpenModal } = useContext(ModalContext);
  const { editFolderTitle, folders } = useContext(PlaygroundContext);

  const folderId = isOpenModal.identifiers.folderId;

  const folder = folders.find((folder) => folder._id === folderId);
  let ft = folder.FolderName;

  const [folderTitle, setFolderTitle] = useState(ft);

  return (
    <>
      <Header>
        <h2>Edit Folder Title</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp fontSize="22px" className="text-black" />
        </CloseButton>
      </Header>
      <Input>
        <input type="text"  className="text-black" onChange={(e) => setFolderTitle(e.target.value)} />
        <button
          onClick={() => {
            editFolderTitle(folderId, folderTitle);
            closeModal();
          }}
        >
          Update Title
        </button>
      </Input>
    </>
  );
};

export default EditFolder;
