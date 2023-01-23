import { useState } from "react";
import Start from "./Start";
import Join from "./Join";

export default function CreateJoinChoice(props) {
  const [isCreateMode, setIsCreateMode] = useState(null);

  function onClickJoin() {
    setIsCreateMode(false);
  }
  function onClickCreate() {
    props.sendJsonMessage({
      type: "create",
    });
    setIsCreateMode(true);
  }

  if (isCreateMode == null) {
    return (
      <div className="input-box">
        <h3>Step 2</h3>
        <button
          className="btn btn-round-extra btn-accent input"
          onClick={onClickCreate}
        >
          Create New Game
        </button>
        <div className="divider-inline">OR</div>
        <button
          className="btn btn-round-extra input with-border"
          onClick={onClickJoin}
        >
          Join Game
        </button>
      </div>
    );
  } else if (isCreateMode) {
    return (
      <Start
        isCreateMode={isCreateMode}
        sendJsonMessage={props.sendJsonMessage}
        game={props.game}
        me={props.me}
      />
    );
  } else if (props.game) {
    return (
      <Start
        isCreateMode={isCreateMode}
        sendJsonMessage={props.sendJsonMessage}
        game={props.game}
        me={props.me}
      />
    );
  } else {
    return <Join sendJsonMessage={props.sendJsonMessage} />;
  }
}
