import Layout from "@/components/Layout";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "User tags",
  description: "User tags page",
};

export default function UserTagsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <Layout>{children}</Layout>;
}
