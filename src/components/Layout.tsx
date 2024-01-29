"use client";
import { LayoutInterface } from "@/interface/Layout";

import {
  DashboardIcon,
  DocumentIcon,
  ApprovalsIcon,
  ToReviewIcon,
  HistoryIcon,
  ReceivedIcon,
  MasterIcon,
  TagIcon,
  UserIcon,
  SettingIcon,
} from "@/style/icon";
import type { MenuProps } from "antd";
import { ConfigProvider, Layout as LayoutAntd, Menu, theme } from "antd";
import { createElement } from "react";
import Text from "./Text";
import ImageNext from "./Image";

const { Header, Content, Footer, Sider } = LayoutAntd;

const items: MenuProps["items"] = [
  { icon: DashboardIcon, label: "Dashboard" },
  { icon: DocumentIcon, label: "Documents" },
  {
    icon: ApprovalsIcon,
    label: "Approvals",
    children: [
      { icon: ToReviewIcon, label: "To Review" },
      { icon: HistoryIcon, label: "History" },
    ],
  },
  {
    icon: ReceivedIcon,
    label: "Received",
    children: [
      { icon: ToReviewIcon, label: "To Do" },
      { icon: HistoryIcon, label: "Processed" },
    ],
  },
  {
    icon: MasterIcon,
    label: "Master",
    children: [{ icon: TagIcon, label: "Document Tags" }],
  },
  { icon: UserIcon, label: "User Management" },
  { icon: SettingIcon, label: "Settings" },
].map((item, index) => {
  const { icon, label, children } = item;

  return {
    key: String(index + 1),
    icon: createElement(icon),
    label: <Text label={label} className="font-bold" />,
    children: children?.map((child, indexChild) => {
      const { icon, label: subLabel } = child;

      return {
        key: String(subLabel + indexChild + 1),
        icon: createElement(icon),
        label: <Text label={subLabel} className="font-bold" />,
      };
    }) as MenuProps["items"],
  };
});

const Layout = ({ ...props }: LayoutInterface) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedColor: "#185288",
            itemSelectedBg: "rgba(10, 173, 224, 0.15)",
            itemBorderRadius: 0,
            itemMarginInline: 0,
            itemMarginBlock: 16,
          },
        },
      }}
    >
      <LayoutAntd hasSider>
        <Sider
          theme="light"
          width={220}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="p-4 bg-img-logo-sider">
            <ImageNext
              src="/logo-light.svg"
              width={406}
              height={139}
              alt="logo-klikyou"
              className="mx-auto h-auto w-auto"
            />
          </div>
          <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]} items={items} />
        </Sider>
        <LayoutAntd style={{ marginLeft: 220 }}>
          <Header
            style={{
              padding: 24,
              background: colorBgContainer,
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="flex items-center gap-4">
              <Text className="text-secondary-blue font-bold text-3xl" label="Dashboard" />

              <Text
                className="text-black font-bold text-2xl border-l-2 border-[#9CB1C6] pl-4"
                label="PT Wahyu Zikri Tech"
              />
            </div>
          </Header>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>{props.children}</Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </LayoutAntd>
      </LayoutAntd>
    </ConfigProvider>
  );
};

export default Layout;
