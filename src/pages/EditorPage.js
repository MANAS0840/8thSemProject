import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (socketRef.current) {
        console.log("Socket already initialized.");
        return;
      }

      try {
        socketRef.current = await initSocket();
        setIsSocketInitialized(true);

        const socket = socketRef.current;

        const handleErrors = (e) => {
          console.log("socket error", e);
          toast.error("Socket connection failed, try again later.");
          reactNavigator("/colab");
        };

        socket.on("connect_error", handleErrors);
        socket.on("connect_failed", handleErrors);

        socket.emit(ACTIONS.JOIN, {
          roomId,
          username: location.state?.username,
        });

        const handleJoined = ({ clients, username, socketId }) => {
          console.log(`JOINED event received: ${username}`);
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socket.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        };

        const handleDisconnected = ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) =>
            prev.filter((client) => client.socketId !== socketId)
          );
        };

        socket.on(ACTIONS.JOINED, handleJoined);
        socket.on(ACTIONS.DISCONNECTED, handleDisconnected);

        return () => {
          socket.disconnect();
          socket.off("connect_error", handleErrors);
          socket.off("connect_failed", handleErrors);
          socket.off(ACTIONS.JOINED, handleJoined);
          socket.off(ACTIONS.DISCONNECTED, handleDisconnected);
        };
      } catch (error) {
        handleErrors(error);
      }
    };

    init();

    // Cleanup function will be executed when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null; // Clean up the socketRef
      }
    };
  }, [location.state, reactNavigator, roomId]);

  function handleErrors(e) {
    console.log("socket error", e);
    toast.error("Socket connection failed, try again later.");
    reactNavigator("/colab");
  }

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/colab");
  }

  if (!location.state) {
    return <Navigate to="/colab" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            {/* <img className="logoImage" src="/code-sync.png" alt="logo" /> */}
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        {isSocketInitialized && (
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        )}
        hello
      </div>
    </div>
  );
};

export default EditorPage;
