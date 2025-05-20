import MessageList from "./components/MessageList";
import Participants from "./components/Participants";
import NewMessage from "./components/NewMessage";

function App() {
  return (
    <>
      <div className="container">
        <div className="chat-ui">
          <MessageList />
          <Participants />
        </div>
        <div className="text-input">
          <NewMessage />
        </div>
      </div>
    </>
  );
}

export default App;
