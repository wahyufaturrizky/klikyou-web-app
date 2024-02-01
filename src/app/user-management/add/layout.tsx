import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Add Profile",
  description: "Add Profile page",
};

export default function AddProfileLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div>{children}</div>;
}
