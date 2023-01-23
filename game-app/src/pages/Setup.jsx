import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { CONFIG } from "../config";

export default function Setup(props) {
  const [username, setUsername] = useState("");

  function onButtonClick(e) {
    props.sendJsonMessage({
      type: "hello",
      name: username,
    });
  }

  function onValueChange(e) {
    setUsername(e.target.value);
  }
  function onRadioChange(e) {
    console.log(e.target.value);
  }
  return (
    <div className="input-box" id="hello_section">
      <h3>Step 1</h3>
      <div className="input">
        <div className="input-group">
          <div className="chip-big">
            <input
              id="choice1"
              type="radio"
              name="group1"
              value="en"
              onChange={onRadioChange}
            />
            <label htmlFor="choice1"> 🇬🇧 English</label>
          </div>

          <div className="chip-big">
            <input
              id="choice2"
              type="radio"
              name="group1"
              value="es"
              onChange={onRadioChange}
            />
            <label htmlFor="choice2"> 🇪🇸 Español</label>
          </div>
        </div>
      </div>

      <div className="input input-effect">
        <input type="text" placeholder=" " onChange={onValueChange} />
        <label>Player Name</label>
        <span className="help-text"> Insert your username </span>
      </div>
      <button
        className="btn btn-round-extra btn-accent input"
        onClick={onButtonClick}
      >
        Set
      </button>
    </div>
  );
}
