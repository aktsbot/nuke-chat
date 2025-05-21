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
        {m.message}
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
  console.log("message list -> ", messages);

  return (
    <div className="chat">
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
