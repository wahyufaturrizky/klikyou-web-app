import { ChangeEventHandler, FocusEventHandler } from "react";

export interface InputInterface {
  label?: string;
  classNameInput: string;
  classNameLabel?: string;
  name: string;
  type: string;
  autoComplete?: string;
  placeholder?: string;
  required: boolean;
  error?: any;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  value: string | number | readonly string[] | undefined;
}
