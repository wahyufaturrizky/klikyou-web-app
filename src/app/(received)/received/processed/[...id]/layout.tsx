import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "View Edit Document",
  description: "View Edit Document page",
};

export default function ViewEditDocumentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div>{children}</div>;
}
