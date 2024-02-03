import { ChangeEventHandler, FocusEventHandler, ReactNode } from "react";

export interface InputTextArea {
  label?: string;
  classNameInput: string;
  classNameLabel?: string;
  name: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  error?: any;
  prefixIcon?: ReactNode;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  value: string | number | readonly string[] | undefined;
}
