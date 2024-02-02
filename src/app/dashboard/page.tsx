"use client";
import Text from "@/components/Text";
import { CheckIcon, FileIcon, RejectIcon, StopwatchIcon } from "@/style/icon";
import { ConfigProvider, DatePicker, Table, TableProps } from "antd";
import { createElement } from "react";

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

export default function DashboardPage() {
  const summaryCard = [
    {
      className: "w-1/4 p-6 rounded-md bg-gradient-to-r from-white to-primary-blue/50",
      icon: createElement(FileIcon),
      label: "Total documents",
      value: "100",
    },
    {
      className: "w-1/4 p-6 rounded-md bg-gradient-to-r from-white to-primary-blue/50",
      icon: createElement(StopwatchIcon),
      label: "Pending",
      value: "20",
    },
    {
      className: "w-1/4 p-6 rounded-md bg-gradient-to-r from-white to-primary-blue/50",
      icon: createElement(CheckIcon),
      label: "Approved",
      value: "65",
    },
    {
      className: "w-1/4 p-6 rounded-md bg-gradient-to-r from-white to-primary-blue/50",
      icon: createElement(RejectIcon),
      label: "Rejected",
      value: "15",
    },
  ];

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

  return (
    <div>
      <div className="bg-img-login h-[343px] bg-bottom flex flex-col items-start justify-center p-6">
        <Text
          label="👋 Hello, PT Sempurna Tech"
          className="text-center text-xl font-normal text-white"
        />
      </div>
      <div className="flex gap-4 px-6 -mt-16">
        {summaryCard.map((data) => {
          const { className, icon, label, value } = data;
          return (
            <div key={label} className={className}>
              <div className="gap-4 flex">
                {icon}

                <div>
                  <Text label={label} className="text-base font-bold text-gray-dark" />

                  <Text label={value} className="text-3xl font-semibold text-black" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="gap-6 flex px-6 mt-6">
        <div className="w-1/2">
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
                columns={columnsShortest}
                dataSource={data}
                pagination={false}
                rowKey={(record) => record.id}
              />
            </ConfigProvider>
          </div>
        </div>

        <div className="w-1/2">
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
                columns={columnsLongest}
                dataSource={data}
                pagination={false}
                rowKey={(record) => record.id}
              />
            </ConfigProvider>
          </div>
        </div>
      </div>

      <div className="gap-6 flex px-6 mt-6">
        <div className="w-1/2">
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
                columns={columnsLowest}
                dataSource={dataRejected}
                pagination={false}
                rowKey={(record) => record.id}
              />
            </ConfigProvider>
          </div>
        </div>

        <div className="w-1/2">
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
