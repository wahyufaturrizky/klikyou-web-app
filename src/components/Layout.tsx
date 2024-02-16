"use client";
import { LayoutInterface, MenuItem } from "@/interface/Layout";

import { DataAuthType } from "@/interface/login.interface";
import { NotificationType } from "@/interface/notification.interface";
import { CompanyProfileType } from "@/interface/settings.interface";
import { useLogOut } from "@/services/auth/useAuth";
import { useNotification } from "@/services/notification/useNotification";
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
  UserTagIcon,
} from "@/style/icon";
import type { MenuProps } from "antd";
import {
  Badge,
  ConfigProvider,
  Dropdown,
  Grid,
  Layout as LayoutAntd,
  Menu,
  Spin,
  theme,
} from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createElement, useEffect, useRef, useState } from "react";
import ImageNext from "./Image";
import Text from "./Text";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";

const { Header, Content, Footer, Sider } = LayoutAntd;

const { useBreakpoint } = Grid;

const Layout = ({ ...props }: LayoutInterface) => {
  const screens = useBreakpoint();

  const { lg, xl, xxl, xs } = screens;

  const router = useRouter();
  const [userProfile, setUserProfile] = useState<DataAuthType>();
  const [companyProfile, setCompanyProfile] = useState<CompanyProfileType>();
  const [collapsed, setCollapsed] = useState(false);

  const [dataListNotif, setDataListNotif] = useState<NotificationType[]>([]);

  const pathname = usePathname();
  const [currentMenu, setCurrentMenu] = useState<string | null>(null);
  const [openKeys, setOpenKeys] = useState<string[] | undefined>();

  useEffect(() => {
    const handleFetchUserProfile = () => {
      const rawUserProfile: string | null = localStorage.getItem("user_profile");

      const dataUserProfile = JSON.parse(rawUserProfile ?? "{}");

      setUserProfile(dataUserProfile);
    };

    handleFetchUserProfile();
  }, []);

  useEffect(() => {
    const handleGetCurrentMenu = () => {
      setCurrentMenu(localStorage.getItem("currentMenu"));
    };

    const handleGetOpenKeysMenu = () => {
      const parseOpenKeys = JSON.parse(localStorage.getItem("openKeys") as string);
      setOpenKeys(parseOpenKeys);
    };

    const handleGetCollapsed = () => {
      const parseCollapsed = JSON.parse(localStorage.getItem("collapsed") as string);
      setCollapsed(parseCollapsed);
    };

    handleGetCurrentMenu();
    handleGetOpenKeysMenu();
    handleGetCollapsed();
  }, []);

  const {
    data: dataNotification,
    isPending: isPendingNotification,
    refetch: refetchNotification,
  } = useNotification({});

  useEffect(() => {
    if (dataNotification?.data?.data) {
      setDataListNotif(dataNotification?.data.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataNotification]);

  const pathNameList: any = {
    "/dashboard": "Dashboard",
    "/profile": "Profile",
    "/documents": "Documents",
    "/documents/add": "Documents",
    "/user-management": "User Management",
    "/user-management/add": "User Management",
    "/master/documents-tags": "Document Tags",
    "/master/user-tags": "User Tags",
    "/settings": "Settings",
    "/approvals/to-review": "To Review",
    "/approvals/history": "History",
    "/received/to-do": "To Do",
    "/received/processed": "Processed",
  };

  const [isShowNotif, setIsShowNotif] = useState<boolean>(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const ref = useRef<any>(null);

  const items: MenuProps["items"] = [
    { icon: DashboardIcon, label: <Link href="/dashboard">Dashboard</Link>, key: "dashboard" },
    { icon: DocumentIcon, label: <Link href="/documents">Documents</Link>, key: "documents" },
    {
      icon: ApprovalsIcon,
      label: "Approvals",
      key: "approvals",
      children: [
        {
          icon: ToReviewIcon,
          label: <Link href="/approvals/to-review">To Review</Link>,
          key: "to-review",
        },
        {
          icon: HistoryIcon,
          label: <Link href="/approvals/history">History</Link>,
          key: "history",
        },
      ],
    },
    {
      icon: ReceivedIcon,
      label: "Received",
      key: "received",
      children: [
        { icon: ToReviewIcon, label: <Link href="/received/to-do">To Do</Link>, key: "to-do" },
        {
          icon: HistoryIcon,
          label: <Link href="/received/processed">Processed</Link>,
          key: "processed",
        },
      ],
    },
    {
      icon: MasterIcon,
      label: "Master",
      key: "master",
      children: [
        {
          icon: TagIcon,
          label: <Link href="/master/documents-tags">Document Tags</Link>,
          key: "documents-tags",
        },
        {
          icon: UserTagIcon,
          label: <Link href="/master/user-tags">User Tags</Link>,
          key: "user-tags",
        },
      ],
    },
    {
      icon: UserIcon,
      label: <Link href="/user-management">User Management</Link>,
      key: "user-management",
    },
    { icon: SettingIcon, label: <Link href="/settings">Settings</Link>, key: "settings" },
  ].map((item, index) => {
    const { icon, label, children } = item;

    return {
      key: String(index + 1),
      icon: <div className="h-6 w-6">{createElement(icon)}</div>,
      label: <Text label={label} className="font-bold" />,
      children: children?.map((child, indexChild) => {
        const { icon, label: subLabel } = child;

        return {
          key: String(index + 1) + "-" + String(indexChild + 1),
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

  const { mutate: logOutUser, isPending: isPendingLogOutUser } = useLogOut({
    options: {
      onSuccess: () => {
        localStorage.removeItem("access_token");
        router.push("/");
      },
    },
  });

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
      onClick: () => logOutUser({ email: userProfile?.email }),
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

  useEffect(() => {
    const handleFetchCompanyProfile = () => {
      const rawCompanyProfile = localStorage.getItem("company_profile");

      setCompanyProfile(JSON.parse(rawCompanyProfile ?? "{}"));
    };

    handleFetchCompanyProfile();
  }, []);

  const onClickMenu: MenuProps["onClick"] = (e) => {
    setCurrentMenu(e.key);
    localStorage.setItem("currentMenu", e.key);
  };

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    if (keys.length) {
      const latestOpenKey = keys.find((key) => openKeys?.indexOf(key) === -1);
      if (
        latestOpenKey &&
        items.map((itemSubMenu: MenuItem) => itemSubMenu?.key).indexOf(latestOpenKey!) === -1
      ) {
        setOpenKeys(keys);
        localStorage.setItem("openKeys", JSON.stringify(keys));
      } else {
        const resKeys = latestOpenKey ? [latestOpenKey] : [];
        setOpenKeys(resKeys);

        localStorage.setItem("openKeys", JSON.stringify(resKeys));
      }
    }
  };

  useEffect(() => {
    const handleSetCollapsedWhenMobileSize = (isMobileSize: boolean) => {
      localStorage.setItem("collapsed", JSON.stringify(isMobileSize));
      setCollapsed(isMobileSize);
    };

    // When on mobile size
    const isMobileSize = !(lg ?? xl ?? xxl);

    handleSetCollapsedWhenMobileSize(isMobileSize);
  }, [screens]);

  return (
    <div>
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
            trigger={!(lg || xl || xxl) && null}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => {
              localStorage.setItem("collapsed", JSON.stringify(value));
              setCollapsed(value);
            }}
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
              selectedKeys={[currentMenu ?? ""]}
              onOpenChange={onOpenChange}
              openKeys={openKeys}
              theme="light"
              mode="inline"
              items={items}
            />
          </Sider>
          <LayoutAntd style={{ marginLeft: collapsed ? 80 : 220 }}>
            <Header
              className="drop-shadow-xl"
              style={{
                padding: xxl || xl || lg ? 24 : 8,
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
                  className={`${
                    xxl || xl || lg ? "text-2xl" : "text-xs"
                  } text-secondary-blue font-bold`}
                  label={
                    xs ? pathNameList[pathname].substring(0, 2) + "..." : pathNameList[pathname]
                  }
                />

                <Text
                  className={`${
                    xxl || xl || lg ? "text-xl" : "text-xs"
                  } text-black font-bold border-l-2 border-primary-gray pl-4`}
                  label={companyProfile?.companyName || ""}
                />
              </div>

              <div className="flex items-center gap-7">
                {isPendingNotification ? (
                  <Spin />
                ) : (
                  <div
                    onClick={() => setIsShowNotif(!isShowNotif)}
                    className={`${
                      dataListNotif.length ? "bg-red" : "bg-primary-gray"
                    } flex items-center gap-1 p-2 rounded-full cursor-pointer`}
                  >
                    <NotifIcon
                      style={{
                        color: "white",
                        height: 16,
                        width: 16,
                      }}
                    />
                    <Text
                      className="text-white font-bold text-sm"
                      label={String(dataListNotif.length)}
                    />
                  </div>
                )}

                <Dropdown menu={{ items: itemsProfile }} trigger={["click"]}>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <ImageNext
                      src={"/placeholder-avatar-header.svg"}
                      width={32}
                      height={32}
                      alt="placeholder-avatar-header"
                      className="mx-auto h-auto w-auto"
                    />
                    <div>
                      <Text
                        className="text-black font-normal text-lg"
                        label={userProfile?.username ?? ""}
                      />
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
              {dataListNotif.map((itemNotif: NotificationType) => (
                <div key={itemNotif.id} className="py-2 px-3.5">
                  <div className="flex gap-2">
                    <Badge color="red" />

                    <div>
                      <Text className="text-black font-normal text-sm" label={itemNotif.title} />
                      <Text
                        className="text-primary-gray font-normal text-xs"
                        label={UseConvertDateFormat(itemNotif.date)}
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
    </div>
  );
};

export default Layout;
