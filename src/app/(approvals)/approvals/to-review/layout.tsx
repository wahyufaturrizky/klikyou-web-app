import Layout from "@/components/Layout";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "To review",
  description: "To review page",
};

export default function ToReviewLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <Layout>{children}</Layout>;
}
