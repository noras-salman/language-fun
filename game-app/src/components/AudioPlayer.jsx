export default function AudioPlayer(props) {
  return (
    <div className="center-text ">
      <progress
        id="audioProgress"
        max="100"
        className="input"
        value={props.percentage || 0}
      ></progress>
      <div id="audioLeft">{props.remainingTime}</div>
    </div>
  );
}

function timeUpdateFunction(audio) {
  var percentage = (audio.currentTime / audio.duration) * 100;
  var audioProgress = document.getElementById("audioProgress");
  audioProgress.value = percentage;

  var currentTime = audio.currentTime;
  var remainingTime = audio.duration - currentTime;

  // format the time in minutes and seconds
  var minutes = Math.floor(remainingTime / 60);
  var seconds = Math.floor(remainingTime % 60);

  // add a leading zero if seconds < 10
  seconds = seconds < 10 ? "0" + seconds : seconds;

  var remainingTimeString = minutes + ":" + seconds;
  document.getElementById("audioLeft").innerHTML =
    remainingTimeString + "/00:30";
}
