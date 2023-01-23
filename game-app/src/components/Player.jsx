export default function Player(props) {
  return (
    <li className="border">
      <div className="row">
        <div className="col">
          <b>
            {props.player.name.length > 15
              ? props.player.name.substr(0, 15)
              : props.player.name}
          </b>
          {props.player.id == props.me.id ? " ⬅️ (me) " : ""}
          {props.index == 0 && props.player.score > 0 ? " 🏆 " : ""}
        </div>
        <div className="col">
          <div className="right-text">
            {props.player.score}
            {props.answeredUsers.includes(props.player.id) ? "✔️" : " "}
          </div>
        </div>
      </div>
    </li>
  );
}
