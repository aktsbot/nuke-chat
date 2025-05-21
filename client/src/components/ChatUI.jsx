import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import {
  encrypt,
  decrypt,
  saveToStorage,
  getFromStorage,
  nuke,
} from "../utils";

import MessageList from "./MessageList";
import Participants from "./Participants";
import NewMessage from "./NewMessage";

// https://chat.one0.xyz/nc/socket.io
const socket = io({
  path: "/nc/socket.io/",
});

const ChatUI = ({ appCore }) => {
  const { roomId, encKey, username } = appCore;

  const messagesKey = `${roomId}|${encKey}|${username}|m`;
  const participantsKey = `${roomId}|${encKey}|${username}|p`;
  const _messages = getFromStorage({
    key: messagesKey,
  });
  const _participants = getFromStorage({
    key: participantsKey,
  });

  const [messages, setMessages] = useState(_messages || []);
  const [participants, setParticipants] = useState(_participants || []);

  const updateMessageList = (message) => {
    setMessages((prev) => {
      const _messages = [...prev];
      if (!_messages.find((m) => m.id === message.id)) {
        _messages.push(message);
      }
      return _messages;
    });
  };

  const updateParticipants = (message) => {
    setParticipants((prev) => {
      const ps = [...prev];
      if (!ps.find((p) => p.username === message.username)) {
        ps.push({
          ...message,
        });
      }
      return ps;
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

      updateParticipants({
        username: message.username,
      });
    });

    socket.on("notification", (message) => {
      updateMessageList({
        type: "notification",
        ...message,
        isFromMe: message.username == username,
      });
    });

    socket.on("nuke", () => {
      nuke();
    });

    socket.on("new-participant", (message) => {
      updateParticipants(message);
    });

    return () => {
      socket.emit("left-chat", {
        username,
        roomId,
      });
    };
  }, []);

  useEffect(() => {
    saveToStorage({
      key: messagesKey,
      data: messages,
    });
  }, [messages]);

  useEffect(() => {
    saveToStorage({
      key: participantsKey,
      data: participants,
    });
  }, [participants]);

  function handleSendMessage({ message }) {
    // chat commands!
    if (message === "/nuke") {
      socket.emit("nuke", {
        roomId,
      });
      return;
    }

    // normal messages
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
        <Participants participants={participants} />
      </div>
      <div className="text-input">
        <NewMessage onSend={handleSendMessage} />
      </div>
    </>
  );
};

export default ChatUI;
