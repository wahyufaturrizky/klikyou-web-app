import { TextInterface } from "../interface/Text";

const Text = ({ ...props }: TextInterface) => {
  return <p {...props}>{props.label}</p>;
};

export default Text;
