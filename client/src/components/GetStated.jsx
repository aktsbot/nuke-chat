import { useState } from "react";

const GetStarted = ({ appCore }) => {
  const [data, setData] = useState({
    roomId: appCore?.roomId || "",
    encKey: appCore?.encKey || "",
    username: appCore?.username || "",
  });

  const handleChange = (e) => {
    const key = e.target.id;
    const value = e.target.value;

    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // https://domain.com/r800#k9089#akts
    const link = `/${data.roomId}#${data.encKey}#${data.username}`;
    location.href = link;
    location.reload(); // the above location.href did not cause a page reload
  };

  return (
    <div className="get-started">
      <h1>Getting stared</h1>
      <p>We'll need a few things to start your chat session</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="harryp"
          id="username"
          value={data.username}
          required
          onChange={handleChange}
        />

        <label htmlFor="roomId">Room name</label>
        <input
          type="text"
          placeholder="h0gw4rts98"
          id="roomId"
          value={data.roomId}
          required
          onChange={handleChange}
        />

        <label htmlFor="encKey">Encryption key</label>
        <input
          type="text"
          placeholder="78RdheTykksuoP"
          id="encKey"
          value={data.encKey}
          required
          onChange={handleChange}
        />

        <button type="submit">Start chat</button>
      </form>
    </div>
  );
};

export default GetStarted;
