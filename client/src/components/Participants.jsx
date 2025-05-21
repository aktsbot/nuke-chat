const Participants = ({ participants }) => {
  return (
    <div className="participants">
      {participants.map((p) => (
        <p key={p.id}>{p.username}</p>
      ))}
    </div>
  );
};

export default Participants;
