import Player from "./Player";

export default function Players(props) {
  return (
    <ul className="list">
      {props.players.map((player, index) => {
        return (
          <Player
            key={player.id}
            player={player}
            me={props.me}
            count={index}
            answeredUsers={props.answeredUsers}
          />
        );
      })}
    </ul>
  );
}
