const NewMessage = () => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <textarea placeholder="your message"></textarea>
      <div>
        <button>Send</button>
        <p className="text-center hints">
          <small>
            or <kbd>ctrl</kbd>
            {"+"}
            <kbd>enter</kbd>
          </small>
        </p>
      </div>
    </form>
  );
};

export default NewMessage;
