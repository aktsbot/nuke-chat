import { useState, useRef } from "react";

const NewMessage = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const formRef = useRef(null);

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

  function scrollToInput() {
    formRef.current?.lastElementChild?.scrollIntoView();
  }

  return (
    <>
      <form onSubmit={handleSubmit} ref={formRef}>
        <textarea
          placeholder="your message here. ctrl + enter"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyUp={handleKeyUp}
          rows={1}
          required
          onFocus={scrollToInput}
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
