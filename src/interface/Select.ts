import { DefaultOptionType } from "antd/es/cascader";
import { CSSProperties, ChangeEventHandler, FocusEventHandler, ReactNode } from "react";

export interface SelectInterface {
  label?: string;
  mode?: "tags" | "multiple";
  styleSelect?: CSSProperties;
  classNameLabel?: string;
  onSearch?: (value: string) => void;
  filterOption?: boolean;
  notFoundContent?: ReactNode;
  name: string;
  onBlur?: FocusEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  tokenSeparators?: string[];
  options?: DefaultOptionType[];
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  error?: any;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: any;
}
