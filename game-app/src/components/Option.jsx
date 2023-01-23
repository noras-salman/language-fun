export default function Option(props) {
  function onClick() {
    props.audio.pause();
    props.sendJsonMessage({
      type: "answer",
      name: props.option.code,
    });
  }

  var color =
    props.correctAnswer && props.correctAnswer?.answer
      ? props.correctAnswer.answer === props.option.code
        ? "sea-bg white"
        : "cryola-bg white"
      : "btn-accent";

  return (
    <button
      className={`btn btn-round-extra ${color} input `}
      onClick={onClick}
      color={color}
      disabled={props.correctAnswer}
    >
      {props.option.name}
    </button>
  );
}
