import { useState } from "react";

const NewMessage = ({ onSend }) => {
  const [message, setMessage] = useState("");

  function send() {
    onSend({
      message,
    });
    setMessage("");
  }

  function handleKeyUp(e) {
    if (e.key === "Enter" && e.ctrlKey) {
      e.target.form.requestSubmit();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    send();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="your message here. ctrl + enter will send"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyUp={handleKeyUp}
          rows={1}
          required
        ></textarea>
        <div>
          <button>Send</button>
        </div>
      </form>
      <p>
        <small>
          <code>/nuke</code> - will remove chat history for everyone
        </small>
      </p>
    </>
  );
};

export default NewMessage;
