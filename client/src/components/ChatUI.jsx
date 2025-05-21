import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { encrypt, decrypt } from "../utils";

import MessageList from "./MessageList";
import Participants from "./Participants";
import NewMessage from "./NewMessage";

// https://chat.one0.xyz/nc/socket.io
const socket = io({
  path: "/nc/socket.io/",
});

const ChatUI = ({ appCore }) => {
  const { roomId, encKey, username } = appCore;
  const [messages, setMessages] = useState([]);

  const updateMessageList = (message) => {
    setMessages((prev) => {
      const _messages = [...prev];
      if (!_messages.find((m) => m.id === message.id)) {
        _messages.push(message);
      }
      return _messages;
    });
  };

  useEffect(() => {
    socket.emit("joined-chat", {
      username,
      roomId,
    });

    socket.on("receive-message", (message) => {
      // if (message.socketId == socket.id) {
      //   return;
      // }
      updateMessageList({
        type: "message",
        ...message,
        message: decrypt({
          message: message.message,
          encKey,
        }),
        isFromMe: message.username == username,
      });
    });

    socket.on("notification", (message) => {
      updateMessageList({
        type: "notification",
        ...message,
        isFromMe: message.username == username,
      });
    });

    return () => {
      socket.emit("left-chat", {
        username,
        roomId,
      });
    };
  }, []);

  function handleSendMessage({ message }) {
    socket.emit("send-message", {
      roomId,
      username,
      message: encrypt({
        message,
        encKey,
      }),
    });
  }

  return (
    <>
      <div className="chat-ui">
        <MessageList messages={messages} />
        <Participants />
      </div>
      <div className="text-input">
        <NewMessage onSend={handleSendMessage} />
      </div>
    </>
  );
};

export default ChatUI;
