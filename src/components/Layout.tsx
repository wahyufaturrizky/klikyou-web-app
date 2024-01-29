"use client";
import { LayoutInterface } from "@/interface/Layout";

import {
  ApprovalsIcon,
  DashboardIcon,
  DocumentIcon,
  HistoryIcon,
  MasterIcon,
  NotifIcon,
  ReceivedIcon,
  SettingIcon,
  TagIcon,
  ToReviewIcon,
  UserIcon,
  LogoutIcon,
} from "@/style/icon";
import type { MenuProps } from "antd";
import { Badge, ConfigProvider, Dropdown, Layout as LayoutAntd, Menu, theme } from "antd";
import { createElement, useEffect, useRef, useState } from "react";
import ImageNext from "./Image";
import Text from "./Text";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isShowNotif, setIsShowNotif] = useState<boolean>(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const itemsProfile: MenuProps["items"] = [
    {
      label: "My Profile",
      key: "1",
    },
    {
      label: <Text className="text-primary-blue font-normal" label="Logout" />,
      key: "2",
      icon: createElement(LogoutIcon),
      onClick: () => {
        localStorage.removeItem("access_token");
        router.push("/");
      },
    },
  ];

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
            className="drop-shadow-xl"
            style={{
              padding: 24,
              background: colorBgContainer,
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="flex items-center gap-4">
              <Text className="text-secondary-blue font-bold text-3xl" label="Dashboard" />

              <Text
                className="text-black font-bold text-2xl border-l-2 border-primary-gray pl-4"
                label="PT Wahyu Zikri Tech"
              />
            </div>

            <div className="flex items-center gap-7">
              <div
                onClick={() => setIsShowNotif(!isShowNotif)}
                className="flex items-center gap-2 bg-primary-gray p-3 rounded-full cursor-pointer"
              >
                <NotifIcon
                  style={{
                    color: "white",
                  }}
                />
                <Text className="text-white font-bold text-base" label="0" />
              </div>

              <Dropdown menu={{ items: itemsProfile }} trigger={["click"]}>
                <div className="flex items-center gap-2 cursor-pointer">
                  <ImageNext
                    src="/placeholder-avatar-header.svg"
                    width={32}
                    height={32}
                    alt="placeholder-avatar-header"
                    className="mx-auto h-auto w-auto"
                  />
                  <div>
                    <Text className="text-black font-normal text-xl" label="Wahyu Fatur Rizki" />
                    <Text className="text-primary-gray font-bold text-sm" label="Super Admin" />
                  </div>
                </div>
              </Dropdown>
            </div>
          </Header>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>{props.children}</Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </LayoutAntd>
      </LayoutAntd>

      {/* Container Notification */}
      {isShowNotif && (
        <div
          ref={ref}
          style={{
            transform: "translate3d(-15px, 60px, 0px)",
            animation: "all 0.3s ease 1",
          }}
          className="z-50 fixed top-0 right-0 bottom-auto left-auto m-0 flex flex-col list-none w-[300px] rounded-md bg-white shadow-lg "
        >
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="py-2 px-3.5">
              <div className="flex gap-2">
                <Badge color="red" />

                <div>
                  <Text
                    className="text-black font-normal text-base"
                    label="1 new document to approve"
                  />
                  <Text
                    className="text-primary-gray font-normal text-sm"
                    label="30 Jun 2023 17:00"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ConfigProvider>
  );
};

export default Layout;
