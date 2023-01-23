export default function Join(props) {
  function onJoinClick() {
    props.sendJsonMessage({
      type: "join",
      code: document.getElementById("game_code").value,
    });
  }
  return (
    <div className="input-box">
      <h3>Step 3</h3>
      <div className="input input-effect">
        <input type="text" placeholder=" " id="game_code" />
        <label>Game Code</label>
        <span className="help-text"> Insert the game code </span>
      </div>
      <button
        className="btn btn-round-extra btn-accent input"
        onClick={onJoinClick}
      >
        Join
      </button>
    </div>
  );
}
