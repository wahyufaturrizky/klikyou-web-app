import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Add Document",
  description: "Add Document page",
};

export default function AddDocumentLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div>{children}</div>;
}
