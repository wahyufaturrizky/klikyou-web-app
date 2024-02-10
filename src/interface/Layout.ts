import { ReactNode } from "react";
import { MenuProps } from "antd";

export interface LayoutInterface {
  children: ReactNode;
  className?: string;
}

export type MenuItem = Required<MenuProps>["items"][number];
