const uuid = require("uuid");
const fs = require("fs");
const WebSocket = require("ws");
const { log } = require("console");

const ANSWER_OPTIONS = 4;
const MAX_POINT = 3000;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

class GameState {
  constructor() {
    this.games = [];
  }
  add(game) {
    this.games.push(game);
  }

  findGameById(id) {
    return this.games.find((game) => game.id == id);
  }

  findGameByAdminId(id) {
    return this.games.find((game) => game.admin == id);
  }

  prepareNext(wss, self, languages) {
    console.log("Preparing next game..");
    const game = this.findGameById(self.game_id);

    if (self && game) {
      console.log("Preparing next game..self && game");
      let that = this;
      if (game.last_timeout) {
        console.log("clearTimeout");
        clearTimeout(game.last_timeout);
        game.last_timeout = null;
      }
      game.last_timeout = setTimeout(function () {
        if (!game.players.find((player) => player.score > MAX_POINT)) {
          game.getNextLanguage(languages);
          game.broadcastGameChanges(wss, self);
          that.prepareNext(wss, self, languages);
        } else {
          game.status = GameStatus.WAITING;
          game.broadcastGameChanges(wss, self);
        }
      }, 32000);
    } else {
      console.log("Game done");
    }
  }
}
//------------------------
const GameStatus = {
  WAITING: "waiting",
  ONGOING: "ongoing",
};
//------------------------
class Game {
  constructor(creator) {
    this.id = uuid.v4();
    this.status = GameStatus.WAITING;
    this.admin = creator.id;
    this.players = [
      {
        id: creator.id,
        name: creator.name,
        score: 0,
      },
    ];
    this.audio = null;
    this.options = [];
    this.correct_answer = null;
    this.answers = 0;
    this.played_languages = [];
    this.last_ts = null;
    this.last_timeout = null;
  }

  findPlayerById(id) {
    return this.players.find((player) => player.id == id);
  }

  setPlayerScore(playerId) {
    let sec_diff = Math.floor(Date.now() / 1000) - this.last_ts;
    if (sec_diff > 30) {
      sec_diff = 30;
    }
    this.findPlayerById(playerId).score += 300 - sec_diff * 10;
  }

  getNextLanguage(languages) {
    const languages_with_audio = languages.filter(
      (language) =>
        language.hasOwnProperty("url") &&
        fs.existsSync(`./data/${language["code"]}.mp3`)
    );
    let selected = languages_with_audio.filter(
      (language) => !this.played_languages.includes(language["code"])
    );
    if (selected && selected.length > 0) {
      selected = shuffle(selected).shift();
    } else {
      selected = languages_with_audio[getRandomInt(languages.length)];
    }
    for (let tries = 0; tries < 20; tries++) {
      if (this.played_languages.includes(selected["code"])) {
        selected = languages_with_audio[getRandomInt(languages.length)];
      } else {
        this.played_languages.push(selected["code"]);
        break;
      }
    }
    this.correct_answer = selected["code"];
    this.answers = 0;
    this.options = this.build_options(languages, selected["code"]);
    this.last_ts = Math.floor(Date.now() / 1000);
    this.audio = Buffer.from(
      fs.readFileSync(`./data/${selected["code"]}_${getRandomInt(3)}.mp3`)
    ).toString("base64");
  }

  static broadcast(wss, self, payload, exclude_self = false) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        if (!exclude_self || client !== self) {
          if (client.game_id && client.game_id == self.game_id) {
            client.send(JSON.stringify(payload));
          }
        }
      }
    });
  }

  static broadcastGameChanges(wss, self, game) {
    const { correct_answer, played_languages, last_timeout, ...stripedGame } =
      game;
    stripedGame.players.sort((a, b) => {
      if (a.score > b.score) {
        return -1;
      }

      if (a.score < b.score) {
        return 1;
      }

      return 0;
    });
    Game.broadcast(wss, self, {
      type: "update",
      payload: stripedGame,
    });
  }
  broadcastGameChanges(wss, self) {
    Game.broadcastGameChanges(wss, self, this);
  }

  build_options(languages, correct) {
    const options = [];
    const correct_language = languages.find(
      (language) => language["code"] == correct
    );
    options.push(correct_language);

    const same_family = shuffle(
      correct_language["family"]
        ? languages.filter(
            (language) =>
              language["code"] != correct &&
              language["family"] &&
              language["family"] == correct_language["family"]
          )
        : []
    );

    for (let tries = 0; tries < 20; tries++) {
      if (same_family.length > 0) {
        options.push(same_family.shift());
      } else {
        let possible = languages[getRandomInt(languages.length)];
        if (
          possible["code"] != correct &&
          !options.find((language) => language["code"] == possible["code"])
        ) {
          options.push(possible);
        }
      }

      if (options.length >= ANSWER_OPTIONS) {
        break;
      }
    }
    return shuffle(
      options.map((option) => {
        return {
          code: option["code"],
          name: option["name"],
          name_es: option["name_es"] ? option["name_es"] : option["name"],
        };
      })
    );
  }
}
//------------------------
module.exports = {
  Game: Game,
  GameState: GameState,
  GameStatus: GameStatus,
};
