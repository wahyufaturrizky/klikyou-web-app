import { TextInterface } from "../interface/Text";

const Text = ({ ...props }: TextInterface) => {
  return <p {...props}>{props.label || "Text goes here"}</p>;
};

export default Text;
