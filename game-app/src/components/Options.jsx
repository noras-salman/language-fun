import Option from "../components/Option";

export default function Options(props) {
  return props.options.map((option) => (
    <Option
      key={option.code}
      option={option}
      audio={props.audio}
      sendJsonMessage={props.sendJsonMessage}
      correctAnswer={props.correctAnswer}
    />
  ));
}
