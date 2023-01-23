import Players from "../components/Players";

export default function Start(props) {
  function onStartGameClick() {
    props.sendJsonMessage({
      type: "start",
    });
  }
  let adminName = null;

  if (props.game) {
    adminName = props.game.players.find(
      (player) => player.id == props.game.admin
    ).name;

    adminName = adminName.length > 15 ? adminName.substr(0, 15) : adminName;
  }
  return (
    <div className="row">
      <div className="col">
        <div className="input-box" id="start_section">
          <h3>Step 3</h3>
          <div className="input">
            <label>Game Code</label>
            <input
              type="text"
              placeholder=" "
              value={props.game ? props.game.id : ""}
              disabled={true}
            />
            <span className="help-text">
              Share the game code with your friends to join the game
            </span>
          </div>
          {props.isCreateMode === true ? (
            <button
              className="btn btn-round-extra btn-accent input"
              onClick={onStartGameClick}
            >
              Start game
            </button>
          ) : (
            ""
          )}
          <div className="progress">
            <div className="indeterminate"></div>
          </div>
          <br />
          <div className="center-text">
            <div className="overline">waiting for Players</div>
            admin: <b>{adminName}</b>
          </div>
        </div>
      </div>
      <div className="col">
        {props.game && props.game.players && props.me ? (
          <Players
            players={props.game.players}
            answeredUsers={props.game.answered_users}
            me={props.me}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
