import MessageList from "./MessageList";
import Participants from "./Participants";
import NewMessage from "./NewMessage";

const ChatUI = () => {
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
