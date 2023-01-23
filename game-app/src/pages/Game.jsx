import { useState } from "react";
import Players from "../components/Players";
import AudioPlayer from "../components/AudioPlayer";
import Options from "../components/Options";
var audio = null;
var data = null;
export default function Game(props) {
  const [percentage, setPercentage] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  if (audio == null || data != props.game.audio) {
    audio = new Audio();
    data = props.game.audio;
    audio.src = "data:audio/mp3;base64," + props.game.audio;
    audio.play();
    audio.ontimeupdate = function () {
      var percentage = (audio.currentTime / audio.duration) * 100;

      setPercentage(percentage);

      var currentTime = audio.currentTime;
      var remainingTime = audio.duration - currentTime;

      // format the time in minutes and seconds
      var minutes = Math.floor(remainingTime / 60);
      var seconds = Math.floor(remainingTime % 60);

      // add a leading zero if seconds < 10
      seconds = seconds < 10 ? "0" + seconds : seconds;

      var remainingTimeString = minutes + ":" + seconds;
      setRemainingTime(remainingTimeString + "/00:30");
    };
  }
  return (
    <div className="row">
      <div className="col">
        <div className="input-box">
          <AudioPlayer remainingTime={remainingTime} percentage={percentage} />
          {props.correctAnswer?.correct ? (
            <div className="center-text">
              <h3>Good job</h3>
            </div>
          ) : (
            <Options
              options={props.game.options}
              right={props.right}
              sendJsonMessage={props.sendJsonMessage}
              audio={audio}
              correctAnswer={props.correctAnswer}
            />
          )}
        </div>
      </div>
      <div className="col">
        <Players
          players={props.game.players}
          answeredUsers={props.game.answered_users}
          me={props.me}
        />
      </div>
    </div>
  );
}
