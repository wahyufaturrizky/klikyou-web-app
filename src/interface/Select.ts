import { DefaultOptionType } from "antd/es/cascader";
import { CSSProperties, ChangeEventHandler } from "react";

export interface SelectInterface {
  label?: string;
  mode?: "tags" | "multiple";
  styleSelect?: CSSProperties;
  classNameLabel?: string;
  name: string;
  tokenSeparators: string[];
  options?: DefaultOptionType[];
  autoComplete?: string;
  placeholder?: string;
  required: boolean;
  error?: any;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: any;
}
