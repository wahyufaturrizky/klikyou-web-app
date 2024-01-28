import Layout from "@/components/Layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard page",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <Layout children={children} />;
}
