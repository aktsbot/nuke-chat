import { useEffect, useRef } from "react";

const Message = ({ m }) => {
  return (
    <div className={m.isFromMe ? "me" : "them"}>
      <p>
        <small>
          <strong>{m.username}</strong>
        </small>
      </p>
      <p
        style={{
          whiteSpace: "pre-wrap",
        }}
      >
        {m.decryptedMessage}
      </p>
    </div>
  );
};

const Notification = ({ m }) => {
  return (
    <div className="notification">
      <p>{m.message}</p>
    </div>
  );
};

const MessageList = ({ messages }) => {
  const chatRef = useRef(null);

  useEffect(() => {
    // https://www.js-craft.io/blog/auto-scroll-bottom-react/
    chatRef.current?.lastElementChild?.scrollIntoView();
  }, [messages]);

  return (
    <div className="chat" ref={chatRef}>
      {messages.map((m) => {
        if (m.type === "notification") {
          return <Notification m={m} key={m.id} />;
        } else {
          return <Message m={m} key={m.id} />;
        }
      })}
    </div>
  );
};

export default MessageList;
