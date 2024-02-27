"use client";
import Text from "@/components/Text";
import { UseBgColorStatus } from "@/hook/useBgColorStatus";
import { useDateRangeFormat } from "@/hook/useDateRangeFormat";
import {
  DataRawDashboardType,
  LowestHighestApprovalTimeType,
  ShortestLongestProcessTimeType,
} from "@/interface/dashboard.interface";
import { CompanyProfileType } from "@/interface/settings.interface";
import { useDashboard } from "@/services/dashboard/useDashboard";
import { useSettings } from "@/services/settings/useSettings";
import { CheckIcon, FileIcon, RejectIcon, StopwatchIcon } from "@/style/icon";
import { ConfigProvider, DatePicker, Grid, Spin, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormFilterValues } from "@/interface/common";
import Link from "next/link";

const { useBreakpoint } = Grid;

export default function DashboardPage() {
  const screens = useBreakpoint();

  const { lg, xl, xxl, xs } = screens;

  const [companyProfile, setCompanyProfile] = useState<CompanyProfileType>();
  const [dataRawDashboard, setDataRawDashboard] = useState<DataRawDashboardType>();

  const { control: controlFilter, watch: watchFilter } = useForm<FormFilterValues>({
    defaultValues: {
      date: "",
    },
  });

  const { data: dataSettings, isPending: isPendingSettings } = useSettings({});

  useEffect(() => {
    const handleFetchCompanyProfile = () => {
      setCompanyProfile(dataSettings?.data?.data);
    };

    if (dataSettings) {
      handleFetchCompanyProfile();
    }
  }, [dataSettings]);

  const columnsProcessTime: TableProps<ShortestLongestProcessTimeType>["columns"] = [
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
      dataIndex: "name",
      key: "name",
      render: (text: string, record: ShortestLongestProcessTimeType) => {
        const { id } = record;
        return (
          <Link href={`/documents/view/${id}`}>
            <Text label={text} className="text-base font-normal" />
          </Link>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => {
        return (
          <Text
            label={text}
            className={`text-base inline-block font-normal text-white p-2 rounded-full ${UseBgColorStatus(
              text
            )}`}
          />
        );
      },
    },
    {
      title: "Elapsed time",
      dataIndex: "elapsed_time",
      key: "elapsed_time",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black" />;
      },
    },
  ];

  const columnsApprovalTime: TableProps<LowestHighestApprovalTimeType>["columns"] = [
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
      dataIndex: "name",
      key: "name",
      render: (text: string, record: LowestHighestApprovalTimeType) => {
        const { id } = record;

        return (
          <Link href={`/documents/view/${id}`}>
            <Text label={text} className="text-base font-normal" />
          </Link>
        );
      },
    },
    {
      title: "Rejected",
      dataIndex: "reject_count",
      key: "reject_count",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black p-2 rounded-full" />;
      },
    },
  ];

  const { data: dataDashboard, isPending: isPendingDashboard } = useDashboard({
    query: {
      crtas: "tsadf",
      filter_updated_at_start: useDateRangeFormat(watchFilter("date")[0] as any),
      filter_updated_at_end: useDateRangeFormat(watchFilter("date")[1] as any),
    },
  });

  useEffect(() => {
    if (dataDashboard?.data.data) {
      setDataRawDashboard(dataDashboard.data.data);
    }
  }, [dataDashboard]);

  const summaryCard = [
    {
      icon: (
        <FileIcon
          style={{
            height: xxl || xl || lg ? undefined : 24,
            width: xxl || xl || lg ? undefined : 24,
            color: "#0AADE0",
          }}
        />
      ),
      label: "Total documents",
      value: dataRawDashboard?.dashboard_info.total_documents || "Loading...",
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
      value: dataRawDashboard?.dashboard_info.pending || "Loading...",
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
      value: dataRawDashboard?.dashboard_info.approved || "Loading...",
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
      value: dataRawDashboard?.dashboard_info.rejected || "Loading...",
    },
  ];

  const isLoading = isPendingDashboard || isPendingSettings;

  return (
    <div>
      {isLoading && <Spin fullscreen />}
      <div
        className={`${
          xxl || xl || lg ? "h-[343px] justify-center" : "h-[100px]"
        } bg-img-login bg-bottom flex flex-col items-start p-6`}
      >
        <Text
          label={`👋 Hello, ${companyProfile?.companyName ?? ""}`}
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
                    label={String(value)}
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
                columns={columnsProcessTime}
                dataSource={dataRawDashboard?.process_time.shortest}
                pagination={false}
                loading={isPendingDashboard}
                rowKey={(record) => record.id}
              />
            </ConfigProvider>
          </div>
        </div>

        <div className={`${xs ? "" : "w-1/2"}`}>
          <div className="flex justify-end">
            <Controller
              control={controlFilter}
              name="date"
              render={({ field: { onChange, value } }: any) => {
                return (
                  <DatePicker.RangePicker value={value} format="YYYY/MM/DD" onChange={onChange} />
                );
              }}
            />
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
                columns={columnsProcessTime}
                loading={isPendingDashboard}
                dataSource={dataRawDashboard?.process_time.longest}
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
                columns={columnsApprovalTime}
                dataSource={dataRawDashboard?.approval_time.lowest}
                pagination={false}
                loading={isPendingDashboard}
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
                columns={columnsApprovalTime}
                loading={isPendingDashboard}
                dataSource={dataRawDashboard?.approval_time.highest}
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
