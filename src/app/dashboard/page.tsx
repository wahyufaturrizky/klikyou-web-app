"use client";
import Text from "@/components/Text";
import { useDashboard } from "@/services/dashboard/useDashboard";
import { CheckIcon, FileIcon, RejectIcon, StopwatchIcon } from "@/style/icon";
import { ConfigProvider, DatePicker, Grid, Spin, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import { CompanyProfile } from "@/components/Layout";

export interface OptionInterface {
  label: string;
  value: string;
}

interface DataShortestType {
  id: string;
  docName: string;
  status: string;
  elapsedTime: string;
}

interface DataLowestType {
  id: string;
  docName: string;
  rejected: string;
}

const { useBreakpoint } = Grid;

export default function DashboardPage() {
  const screens = useBreakpoint();

  const { lg, xl, xxl, xs } = screens;

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>();

  useEffect(() => {
    const handleFetchCompanyProfile = () => {
      const rawCompanyProfile = localStorage.getItem("company_profile");

      setCompanyProfile(JSON.parse(rawCompanyProfile ?? "{}"));
    };

    handleFetchCompanyProfile();
  }, []);

  const columnsShortest: TableProps<DataShortestType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black" />;
      },
    },
    {
      title: "Document name",
      dataIndex: "docName",
      key: "docName",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-link" />;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black p-2 rounded-full" />;
      },
    },
    {
      title: "Elapsed time",
      dataIndex: "elapsedTime",
      key: "elapsedTime",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black" />;
      },
    },
  ];

  const columnsLongest: TableProps<DataShortestType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black" />;
      },
    },
    {
      title: "Document name",
      dataIndex: "docName",
      key: "docName",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-link" />;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black p-2 rounded-full" />;
      },
    },
    {
      title: "Elapsed time",
      dataIndex: "elapsedTime",
      key: "elapsedTime",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black" />;
      },
    },
  ];

  const columnsLowest: TableProps<DataLowestType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black" />;
      },
    },
    {
      title: "Document name",
      dataIndex: "docName",
      key: "docName",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-link" />;
      },
    },
    {
      title: "Rejected",
      dataIndex: "rejected",
      key: "rejected",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black p-2 rounded-full" />;
      },
    },
  ];

  const data: DataShortestType[] = [
    {
      id: "101",
      docName: "Project Antasari - Quotation",
      status: "(3/3) Fully approved",
      elapsedTime: "0d 0h 37m",
    },
  ];

  const dataRejected: DataLowestType[] = [
    {
      id: "101",
      docName: "Project Antasari - Quotation",
      rejected: "0x",
    },
  ];

  const { data: dataDashboard, isPending: isPendingDashboard } = useDashboard({
    query: {
      crtas: "tsadf",
    },
  });

  useEffect(() => {
    if (dataDashboard) {
    }
  }, [dataDashboard]);

  const summaryCard = [
    {
      icon: (
        <FileIcon
          style={{
            height: xxl || xl || lg ? undefined : 24,
            width: xxl || xl || lg ? undefined : 24,
          }}
        />
      ),
      label: "Total documents",
      value: "100",
    },
    {
      icon: (
        <StopwatchIcon
          style={{
            height: xxl || xl || lg ? undefined : 24,
            width: xxl || xl || lg ? undefined : 24,
          }}
        />
      ),
      label: "Pending",
      value: "20",
    },
    {
      icon: (
        <CheckIcon
          style={{
            color: "#23C464",
            height: xxl || xl || lg ? undefined : 24,
            width: xxl || xl || lg ? undefined : 24,
          }}
        />
      ),
      label: "Approved",
      value: "65",
    },
    {
      icon: (
        <RejectIcon
          style={{
            color: "#F44550",
            height: xxl || xl || lg ? undefined : 24,
            width: xxl || xl || lg ? undefined : 24,
          }}
        />
      ),
      label: "Rejected",
      value: "15",
    },
  ];

  return (
    <div>
      {isPendingDashboard && <Spin fullscreen />}
      <div
        className={`bg-img-login h-[${
          xxl || xl || lg ? "343px justify-center" : "100px"
        }] bg-bottom flex flex-col items-start p-6`}
      >
        <Text
          label={`👋 Hello, ${companyProfile?.companyName || ""}`}
          className="text-center text-xl font-normal text-white"
        />
      </div>
      <div
        className={`${
          xs
            ? "flex-col gap-1 px-1 -mt-6"
            : xxl || xl || lg
            ? "gap-4 px-6 -mt-16"
            : "gap-1 px-1 -mt-6"
        } flex`}
      >
        {summaryCard.map((data) => {
          const { icon, label, value } = data;
          return (
            <div
              key={label}
              className={`${
                xs ? "p-1" : xxl || xl || lg ? "p-6 w-1/4" : "p-1 w-1/4"
              } rounded-md bg-gradient-to-r from-white to-primary-blue/50`}
            >
              <div className={`${xs ? "justify-center" : ""} gap-4 flex`}>
                {icon}

                <div>
                  <Text
                    label={label}
                    className={`${
                      xxl || xl || lg ? "text-base" : "text-xs"
                    } font-bold text-gray-dark`}
                  />

                  <Text
                    label={value}
                    className={`${
                      xxl || xl || lg ? "text-3xl" : "text-sm"
                    } font-semibold text-black`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`${xs ? "flex-col" : ""} gap-6 flex px-6 mt-6`}>
        <div className={`${xs ? "" : "w-1/2"}`}>
          <Text label="Process time" className="text-xl font-bold text-black" />

          <div className="p-2 bg-white rounded-md mt-6">
            <ConfigProvider
              theme={{
                components: {
                  Table: {
                    headerBg: "white",
                  },
                },
              }}
            >
              <Table
                title={() => (
                  <Text
                    label="SHORTEST"
                    className="text-base border-b border-[#f0f0f0] font-normal text-black pb-4"
                  />
                )}
                scroll={lg || xl || xxl ? undefined : { x: 500 }}
                columns={columnsShortest}
                dataSource={data}
                pagination={false}
                rowKey={(record) => record.id}
              />
            </ConfigProvider>
          </div>
        </div>

        <div className={`${xs ? "" : "w-1/2"}`}>
          <div className="flex justify-end">
            <DatePicker.RangePicker />
          </div>

          <div className="p-2 bg-white rounded-md mt-6">
            <ConfigProvider
              theme={{
                components: {
                  Table: {
                    headerBg: "white",
                  },
                },
              }}
            >
              <Table
                title={() => (
                  <Text
                    label="LONGEST"
                    className="text-base border-b border-[#f0f0f0] font-normal text-black pb-4"
                  />
                )}
                scroll={lg || xl || xxl ? undefined : { x: 500 }}
                columns={columnsLongest}
                dataSource={data}
                pagination={false}
                rowKey={(record) => record.id}
              />
            </ConfigProvider>
          </div>
        </div>
      </div>

      <div className={`${xs ? "flex-col" : ""} gap-6 flex px-6 mt-6`}>
        <div className={`${xs ? "" : "w-1/2"}`}>
          <div className="p-2 bg-white rounded-md mt-6">
            <ConfigProvider
              theme={{
                components: {
                  Table: {
                    headerBg: "white",
                  },
                },
              }}
            >
              <Table
                title={() => (
                  <Text
                    label="LOWEST"
                    className="text-base border-b border-[#f0f0f0] font-normal text-black pb-4"
                  />
                )}
                scroll={lg || xl || xxl ? undefined : { x: 500 }}
                columns={columnsLowest}
                dataSource={dataRejected}
                pagination={false}
                rowKey={(record) => record.id}
              />
            </ConfigProvider>
          </div>
        </div>

        <div className={`${xs ? "" : "w-1/2"}`}>
          <div className="p-2 bg-white rounded-md mt-6">
            <ConfigProvider
              theme={{
                components: {
                  Table: {
                    headerBg: "white",
                  },
                },
              }}
            >
              <Table
                title={() => (
                  <Text
                    label="HIGHEST"
                    className="text-base border-b border-[#f0f0f0] font-normal text-black pb-4"
                  />
                )}
                scroll={lg || xl || xxl ? undefined : { x: 500 }}
                columns={columnsLowest}
                dataSource={dataRejected}
                pagination={false}
                rowKey={(record) => record.id}
              />
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
