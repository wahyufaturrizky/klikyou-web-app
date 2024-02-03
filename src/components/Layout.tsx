"use client";
import { LayoutInterface } from "@/interface/Layout";

import {
  ApprovalsIcon,
  BackIcon,
  DashboardIcon,
  DocumentIcon,
  HistoryIcon,
  LogoutIcon,
  MasterIcon,
  NotifIcon,
  ReceivedIcon,
  SettingIcon,
  TagIcon,
  ToReviewIcon,
  UserIcon,
} from "@/style/icon";
import type { MenuProps } from "antd";
import { Badge, ConfigProvider, Dropdown, Layout as LayoutAntd, Menu, theme } from "antd";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { createElement, useEffect, useRef, useState } from "react";
import ImageNext from "./Image";
import Text from "./Text";

const { Header, Content, Footer, Sider } = LayoutAntd;

const Layout = ({ ...props }: LayoutInterface) => {
  const router = useRouter();
  const param = useParams();

  const pathname = usePathname();
  const [currentMenu, setCurrentMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleGetCurrentMenu = () => {
      setCurrentMenu(localStorage.getItem("currentMenu"));
    };

    handleGetCurrentMenu();
  });

  const pathNameList: any = {
    "/dashboard": "Dashboard",
    "/profile": "Profile",
    "/documents": "Documents",
    "/user-management": "User Management",
    "/user-management/add": "User Management",
    "/master/documents-tags": "Document Tags",
  };

  const [isShowNotif, setIsShowNotif] = useState<boolean>(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const ref = useRef<any>(null);

  const items: MenuProps["items"] = [
    { icon: DashboardIcon, label: <Link href="/dashboard">Dashboard</Link> },
    { icon: DocumentIcon, label: <Link href="/documents">Documents</Link> },
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
      children: [
        { icon: TagIcon, label: <Link href="/master/documents-tags">Document Tags</Link> },
      ],
    },
    { icon: UserIcon, label: <Link href="/user-management">User Management</Link> },
    { icon: SettingIcon, label: "Settings" },
  ].map((item, index) => {
    const { icon, label, children } = item;

    return {
      key: String(index + 1),
      icon: <div className="h-6 w-6">{createElement(icon)}</div>,
      label: <Text label={label} className="font-bold" />,
      children: children?.map((child, indexChild) => {
        const { icon, label: subLabel } = child;

        return {
          key: subLabel + String(indexChild + 1),
          icon: <div className="h-6 w-6">{createElement(icon)}</div>,
          label: <Text label={subLabel} className="font-bold" />,
        };
      }) as MenuProps["items"],
    };
  });

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
      onClick: () => {
        localStorage.setItem("currentMenu", "");
        router.push("/profile");
      },
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

  const onClickMenu: MenuProps["onClick"] = (e) => {
    localStorage.setItem("currentMenu", e.key);
  };

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
          className="scrollbar"
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
          <Menu
            onClick={onClickMenu}
            selectedKeys={[currentMenu || ""]}
            theme="light"
            mode="inline"
            items={items}
          />
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
              {pathname === "/profile" && (
                <BackIcon style={{ color: "#2379AA" }} onClick={() => router.back()} />
              )}
              <Text
                className="text-secondary-blue font-bold text-2xl"
                label={pathNameList[pathname]}
              />

              <Text
                className="text-black font-bold text-xl border-l-2 border-primary-gray pl-4"
                label="PT Wahyu Zikri Tech"
              />
            </div>

            <div className="flex items-center gap-7">
              <div
                onClick={() => setIsShowNotif(!isShowNotif)}
                className="flex items-center gap-1 bg-primary-gray p-2 rounded-full cursor-pointer"
              >
                <NotifIcon
                  style={{
                    color: "white",
                    height: 16,
                    width: 16,
                  }}
                />
                <Text className="text-white font-bold text-sm" label="0" />
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
                    <Text className="text-black font-normal text-lg" label="Wahyu Fatur Rizki" />
                    <Text className="text-primary-gray font-bold text-xs" label="Super Admin" />
                  </div>
                </div>
              </Dropdown>
            </div>
          </Header>
          <Content style={{ overflow: "initial" }}>{props.children}</Content>
          <Footer style={{ textAlign: "center" }}>
            {/* Ant Design ©{new Date().getFullYear()} Created by Ant UED */}
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
          className="z-50 fixed top-0 right-0 bottom-auto left-auto m-0 flex flex-col list-none w-[300px] rounded-md bg-white shadow-lg"
        >
          <div className="overflow-auto h-[200px]">
            {[1, 2, 3, 4].map((_) => (
              <div key={_} className="py-2 px-3.5">
                <div className="flex gap-2">
                  <Badge color="red" />

                  <div>
                    <Text
                      className="text-black font-normal text-sm"
                      label="1 new document to approve"
                    />
                    <Text
                      className="text-primary-gray font-normal text-xs"
                      label="30 Jun 2023 17:00"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="">
            <Text
              className="text-primary-blue font-medium text-base text-center py-2 cursor-pointer hover:text-primary-blue/70 active:text-primary-blue/90"
              label="Mark all as read"
            />
          </div>
        </div>
      )}
    </ConfigProvider>
  );
};

export default Layout;
