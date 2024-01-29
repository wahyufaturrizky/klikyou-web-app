"use client";
import { theme } from "antd";
import { useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";
import { Control } from "react-hook-form";

export interface OptionInterface {
  label: string;
  value: string;
}

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCheckIsLogin = () => {
      const access_token = localStorage.getItem("access_token");

      if (!access_token) {
        router.push("/");
      }
    };

    handleCheckIsLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div
      style={{
        padding: 24,
        textAlign: "center",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <p>long content</p>
      {
        // indicates very long content
        Array.from({ length: 100 }, (_, index) => (
          <Fragment key={index}>
            {index % 20 === 0 && index ? "more" : "..."}
            <br />
          </Fragment>
        ))
      }
    </div>
  );
}
