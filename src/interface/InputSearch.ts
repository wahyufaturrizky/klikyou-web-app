import { ChangeEventHandler, FocusEventHandler } from "react";

export interface InputSearchInterface {
  className: string;
  showIcon?: boolean;
  name: string;
  type: string;
  autoComplete?: string;
  placeholder?: string;
  required: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  value: string | number | readonly string[] | undefined;
}
