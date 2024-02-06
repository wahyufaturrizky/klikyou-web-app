import Layout from "@/components/Layout";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "History",
  description: "History page",
};

export default function ToReviewLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <Layout>{children}</Layout>;
}
