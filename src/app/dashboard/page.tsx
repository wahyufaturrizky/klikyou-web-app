"use client";
import { theme } from "antd";
import { Fragment } from "react";

export interface OptionInterface {
  label: string;
  value: string;
}

export default function DashboardPage() {
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
