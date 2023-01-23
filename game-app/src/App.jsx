import useWebSocket, { ReadyState } from "react-use-websocket";
import Setup from "./pages/Setup";

import { useState, useCallback, useEffect } from "react";
import { CONFIG } from "./config";
import CreateJoinChoice from "./pages/CreateJoinChoice";
import Game from "./pages/Game";
import { useNavigate } from "react-router";

function App() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [game, setGame] = useState(null);
  const [message, setMessage] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    CONFIG.WS_URL
  );

  function setGameCodeUrl(gameCode) {
    const params = new URLSearchParams({ ["code"]: gameCode });
    navigate({ pathname: "/", search: params.toString() });
  }

  useEffect(() => {
    if (lastJsonMessage !== null) {
      console.log(lastJsonMessage);
      setMessage(lastJsonMessage);

      if (["correct", "wrong"].includes(lastJsonMessage.type)) {
        const newAnswer = {
          correct: lastJsonMessage.type === "correct",
          answer:
            lastJsonMessage.type === "wrong"
              ? lastJsonMessage.payload.answer
              : null,
        };
        if (correctAnswer == null || correctAnswer != newAnswer) {
          setCorrectAnswer(newAnswer);
        }
      } else {
        setCorrectAnswer(null);
      }
    }
  }, [lastJsonMessage, setMessage]);

  if (readyState == ReadyState.CLOSED) {
    return <div>Connection closed</div>;
  } else if (readyState !== ReadyState.OPEN) {
    return <div>Connecting</div>;
  }

  if (message) {
    if (message.type == "hello" && !me) {
      setMe(message.payload);
    } else if (
      ["update", "created"].includes(message.type) &&
      game != message.payload
    ) {
      console.log("Setting game update");
      setGame(message.payload);
      setGameCodeUrl(message.payload.id);
    }
  }

  if (!me) {
    return <Setup sendJsonMessage={sendJsonMessage} />;
  }
  if (!game || (game.status == "waiting" && game.players[0].score == 0)) {
    return (
      <CreateJoinChoice sendJsonMessage={sendJsonMessage} game={game} me={me} />
    );
  } else if (game.status == "waiting" && game.players[0].score != 0) {
    return <div>SHOW SCORES</div>;
  } else {
    return (
      <div className="App">
        {me ? me.name : ""}
        <Game
          game={game}
          me={me}
          sendJsonMessage={sendJsonMessage}
          correctAnswer={correctAnswer}
        />
      </div>
    );
  }
  // return (
  //   <Routes>
  //     <Route exact path="/" element={<Home />} />
  //     <Route exact path="/home" element={<Home />} />
  //     <Route exact path="/upcoming/:user" element={<Upcoming />} />
  //     <Route exact path="/record/:user" element={<Record />} />
  //     <Route path="*" element={<NotFound />} />
  //   </Routes>
  // );
}

export default App;
