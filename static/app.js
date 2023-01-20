const SERVER_ADDRESS = "ws://localhost:8080";

function timeUpdateFunction() {
  var percentage = (audio.currentTime / audio.duration) * 100;
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
function hide(id, hidden = true) {
  document.getElementById(id).style.display = hidden ? "none" : "block";
}
function languageChangeHandler(event) {
  localStorage.setItem("lang", event.value);
}
function renderPlayers(players) {
  document.getElementById("players").innerHTML = "";
  let count = 0;
  for (const player of players) {
    var li = document.createElement("li");
    var row = document.createElement("div");
    row.className = "row";
    var col1 = document.createElement("div");
    col1.className = "col-8";
    var col2 = document.createElement("div");
    col2.className = "col-4";

    var new_player = document.createElement("p");
    var score = document.createElement("p");
    score.innerHTML = player.score;
    new_player.className = "border";
    new_player.innerHTML =
      player.name +
      (player.name == me.name ? " ⬅️ (me) " : "") +
      (count == 0 && player.score > 0 ? " 🏆 " : "");
    col1.appendChild(new_player);
    col2.appendChild(score);
    row.appendChild(col1);
    row.appendChild(col2);
    li.appendChild(row);

    document.getElementById("players").appendChild(li);
    count++;
  }
}
const socket = new WebSocket(SERVER_ADDRESS);
var me = null;
var audio = new Audio();
socket.onopen = function open() {};

socket.onmessage = function incoming(event) {
  let data = JSON.parse(event.data);
  console.log(data);
  switch (data.type) {
    case "hello":
      // handle game update
      document.getElementById("player_name_head").innerHTML = data.payload.name;
      me = data.payload;

      localStorage.setItem("me", JSON.stringify(data.payload));
      hide("hello_section");
      hide("create_join_section", false);
      break;
    case "created":
      // handle game update
      document.getElementById("game_code_share").value = data.payload.id;
      renderPlayers(data.payload.players);
      break;
    case "update":
      // handle game update
      renderPlayers(data.payload.players);
      if (data.payload.admin != me.id) {
        document.getElementById("start_button").disabled = true;
      }
      if (data.payload.status == "waiting") {
        hide("game");
        hide("join_section");
        hide("start_section", false);
      } else if (data.payload.status == "ongoing") {
        hide("start_section");
        hide("game", false);
        if (data.payload.audio) {
          audio.src = "data:audio/mp3;base64," + data.payload.audio;
          audio.play();
          var audioProgress = document.getElementById("audioProgress");

          audio.addEventListener("timeupdate", timeUpdateFunction);
          document.getElementById("question_options").innerHTML = "";
          const lang = localStorage.getItem("lang")
            ? localStorage.getItem("lang")
            : "en";
          for (let option of data.payload.options) {
            let btn = document.createElement("button");
            btn.innerHTML =
              lang == "es" && option["name_es"]
                ? option["name_es"]
                : option["name"];
            btn.onclick = function () {
              socket.send(
                JSON.stringify({
                  type: "answer",
                  name: option["code"],
                })
              );
            };
            btn.classList.add("btn", "btn-round-extra", "btn-accent", "input");

            document.getElementById("question_options").appendChild(btn);
          }
          hide("question_options", false);
          hide("correct");
          hide("wrong");
          hide("right_answer");
        }
      }
      break;
    case "answer":
      // handle game end
      break;
    case "end":
      // handle game end
      break;
    case "correct":
      // handle correct answer
      audio.pause();
      audio.removeEventListener("timeupdate", timeUpdateFunction);
      hide("question_options");
      hide("correct", false);
      break;
    case "wrong":
      // handle correct answer
      audio.pause();
      audio.removeEventListener("timeupdate", timeUpdateFunction);
      document.getElementById("right_answer").innerHTML =
        "It was " +
        data.options.find((option) => option.code == data.right).name;
      hide("question_options");
      hide("wrong", false);
      hide("right_answer", false);
      break;
  }
};
socket.onerror = function (e) {
  alert("An error occured while connecting... " + e.data);
};
socket.onclose = function () {
  alert("hello.. The coonection has been clsoed");
};
function hello_game() {
  socket.send(
    JSON.stringify({
      type: "hello",
      name: document.getElementById("player_name").value,
    })
  );
}
function create_game() {
  socket.send(
    JSON.stringify({
      type: "create",
    })
  );
  hide("create_join_section");
  hide("start_section", false);
}

function show_join() {
  hide("create_join_section");
  hide("join_section", false);
}
function join_game_with_code() {
  socket.send(
    JSON.stringify({
      type: "join",
      code: document.getElementById("game_code").value,
    })
  );

  hide("join_section", false);
}

function start_game() {
  socket.send(
    JSON.stringify({
      type: "start",
    })
  );
}
