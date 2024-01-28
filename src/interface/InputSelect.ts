import { OptionInterface } from "@/app/dashboard/page";
import { ChangeEventHandler, FocusEventHandler } from "react";

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
