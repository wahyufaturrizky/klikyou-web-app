import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "View Edit Profile",
  description: "View Edit Profile page",
};

export default function ViewEditProfileLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div>{children}</div>;
}
