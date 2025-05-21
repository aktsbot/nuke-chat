import { useState } from "react";

import ChatUI from "./components/ChatUI";
import GetStarted from "./components/GetStated";

import { getLocationParts } from "./utils";

function App() {
  const { roomId, encKey, username } = getLocationParts();

  const [appCore] = useState({
    roomId,
    encKey,
    username,
  });

  return (
    <>
      <div className="container">
        {!appCore.roomId || !appCore.encKey || !appCore.username ? (
          <GetStarted appCore={appCore} />
        ) : (
          <ChatUI appCore={appCore} />
        )}
      </div>
    </>
  );
}

export default App;
