import { useEffect } from "react";
import { io } from "socket.io-client";

import MessageList from "./MessageList";
import Participants from "./Participants";
import NewMessage from "./NewMessage";

// https://chat.one0.xyz/nc/socket.io
const socket = io({
  path: "/nc/socket.io/",
});

const ChatUI = () => {
  useEffect(() => {
    console.log(socket);
    return () => {
      socket.off("leaving");
    };
  }, []);

  return (
    <>
      <div className="chat-ui">
        <MessageList />
        <Participants />
      </div>
      <div className="text-input">
        <NewMessage />
      </div>
    </>
  );
};

export default ChatUI;
