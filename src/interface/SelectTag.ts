import { ChangeEventHandler, FocusEventHandler } from "react";

export interface SelectTagInterface {
  label?: string;
  disabled?: boolean;
  maxTagCount?: number;
  classNameSelect?: string;
  classNameTag?: string;
  name: string;
  type: string;
  autoComplete?: string;
  placeholder?: string;
  required: boolean;
  error?: any;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  value: string[] | (() => string[]);
}
