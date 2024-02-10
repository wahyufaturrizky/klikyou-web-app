import { ChangeEventHandler, FocusEventHandler } from "react";
import { OptionInterface } from "./common";

export interface InputSelectInterface {
  className: string;
  classNameLabel?: string;
  name: string;
  autoComplete?: string;
  required: boolean;
  error?: any;
  option?: OptionInterface[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
  onBlur: FocusEventHandler<HTMLSelectElement>;
  value: string | number | readonly string[] | undefined;
}
