import Layout from "@/components/Layout";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Document tags",
  description: "Document tags page",
};

export default function DocumentTagsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <Layout>{children}</Layout>;
}
