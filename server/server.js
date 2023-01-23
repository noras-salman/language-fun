const WebSocket = require("ws");
const uuid = require("uuid");

const http = require("http");
const fs = require("fs");
const path = require("path");
var LanguageGame = require("./LanguageGame.js");
const port = 8080;
const directoryToServe = "../game-app/build/";

const server = http.createServer((req, res) => {
  // Get the file path
  var filePath = path.join(directoryToServe, req.url);
  console.log(filePath);
  if (filePath == directoryToServe) {
    filePath = directoryToServe + "index.html";
  }
  // Check if the file exists
  fs.exists(filePath, (exists) => {
    if (!exists) {
      res.statusCode = 404;
      res.end(`File not found: ${filePath}`);
      return;
    }

    // Serve the file
    fs.createReadStream(filePath).pipe(res);
  });
});

const wss = new WebSocket.Server({ server });

let raw_data = fs.readFileSync("../data/languages.json");
let languages = JSON.parse(raw_data);

var gameState = new LanguageGame.GameState();

//------------------------

function sendPayload(self, payload) {
  console.log("sending " + JSON.stringify(payload));
  self.send(JSON.stringify(payload));
}

function handleMessage(self, payload) {
  console.log("Message", payload);

  switch (payload.type) {
    case "hello":
      payload.name =
        payload.name.trim() == ""
          ? "Player " + uuid.v4().substring(0, 5)
          : payload.name;
      self.name = payload.name;

      sendPayload(self, {
        type: "hello",
        payload: {
          id: self.id,
          name: payload.name,
        },
      });
      break;
    case "create":
      const newGame = new LanguageGame.Game(self);
      gameState.add(newGame);
      self.game_id = newGame.id;
      sendPayload(self, {
        type: "created",
        payload: newGame,
      });
      break;

    case "join":
      const game = gameState.findGameById(payload.code);
      if (game) {
        if (game.findPlayerById(self.id)) {
          break;
        }
        self.game_id = game.id;
        game.players.push({
          id: self.id,
          name: self.name,
          score: 0,
        });
        game.broadcastGameChanges(wss, self);
      } else {
        console.log("error");
      }

      break;
    case "start":
      if (gameState.findGameByAdminId(self.id)) {
        const game = gameState.findGameByAdminId(self.id);
        if (game.status == LanguageGame.GameStatus.WAITING) {
          for (let i = 0; i < game.players.length; i++) {
            game.players[i].score = 0;
          }
          game.status = LanguageGame.GameStatus.ONGOING;
          game.getNextLanguage(languages);
          game.broadcastGameChanges(wss, self);
        }
        gameState.prepareNext(wss, self, languages);
      }
      break;

    case "answer":
      if (gameState.findGameById(self.game_id)) {
        const game = gameState.findGameById(self.game_id);
        if (!game.answered_users.includes(self.id)) {
          game.answered_users.push(self.id);
          game.answers += 1;

          if (game.correct_answer == payload.name) {
            game.setPlayerScore(self.id);
            const temp = {
              ...game,
              status: "playing",
            };
            LanguageGame.Game.broadcastGameChanges(wss, self, temp);

            sendPayload(self, {
              type: "correct",
            });
          } else {
            sendPayload(self, {
              type: "wrong",
              payload: {
                answer: game.correct_answer,
                options: game.options,
              },
            });
          }
        }

        if (game.answers == game.players.length) {
          game.getNextLanguage(languages);
          game.broadcastGameChanges(wss, self);
          gameState.prepareNext(wss, self, languages);
        }
      }
      break;
  }
}

wss.on("connection", function connection(self) {
  self.id = uuid.v4();
  console.log("Connection established");

  self.on("message", function incoming(message) {
    let payload = JSON.parse(message);
    handleMessage(self, payload);
  });

  self.on("close", () => {
    console.log("the client has connected");
  });
  // handling client connection error
  self.onerror = function () {
    console.log("Some Error occurred");
  };
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
