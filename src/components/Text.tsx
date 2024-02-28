import { TextInterface } from "../interface/Text";

// Author, Software Architect, Software Engineer, Software Developer : https://www.linkedin.com/in/wahyu-fatur-rizky

const Text = ({ ...props }: TextInterface) => {
  return <p {...props}>{props.label}</p>;
};

export default Text;
