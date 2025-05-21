import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

import {
  encrypt,
  decrypt,
  saveToStorage,
  getFromStorage,
  nuke,
  buildMessageList,
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

  const getMessagesCB = useCallback(() => {
    return messages;
  }, [messages]);

  const getParticipantsCB = useCallback(() => {
    return participants;
  }, [participants]);

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
        decryptedMessage: decrypt({
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

    // sync to another participant
    socket.on("sync-participant", (message) => {
      const _participants = [...getParticipantsCB()];
      const _messages = getMessagesCB()
        .filter((m) => m.type === "message")
        .map((m) => {
          const _m = { ...m };
          delete _m["isFromMe"];
          delete _m["decryptedMessage"];
          return _m;
        });

      // console.log("sending p ", _participants);
      // console.log("sending m ", _messages);
      socket.emit("sync-participant-data", {
        data: {
          result: _participants,
          type: "participants",
          source: username,
        },
        socketId: message.participantSocketId,
        roomId,
      });
      socket.emit("sync-participant-data", {
        data: {
          result: _messages,
          type: "messages",
          source: username,
        },
        socketId: message.participantSocketId,
        roomId,
      });
    });

    // we get data from clients to sync with
    socket.on("participant-data", (message) => {
      if (message.source === username) {
        return;
      }
      // console.log("rcd pd ", message);
      if (message?.type === "messages") {
        const _completeMessages = buildMessageList({
          myUsername: username,
          newMessages: message?.result || [],
          existingMessages: messages,
          encKey,
        });
        for (const cm of _completeMessages) {
          updateMessageList(cm);
        }
      } else if (message?.type === "participants") {
        const _allParticipants = message?.result || [];
        for (const p of _allParticipants) {
          updateParticipants(p);
        }
      }
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
