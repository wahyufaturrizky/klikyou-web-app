"use client";
import Button from "@/components/Button";
import Text from "@/components/Text";
import UseDateTimeFormat from "@/hook/useDateFormat";
import useDebounce from "@/hook/useDebounce";
import { TableParams } from "@/interface/Table";
import { useDocument } from "@/services/document/useDocument";
import { FileIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon, FilterIcon } from "@/style/icon";
import { ConfigProvider, Modal, Table, TableProps, DatePicker, Checkbox } from "antd";
import { useEffect, useState } from "react";
import Input from "@/components/Input";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";

export interface OptionInterface {
  label: string;
  value: string;
}

interface DataDocumentsType {
  id: string;
  docName: string;
  tags: string[];
  file: string;
  status: string;
  latestAction: string;
  role: string[];
  updateAt: Date;
}

type FormFilterValues = {
  search: string;
  date: string;
  status: string[];
  role: string[];
};

export default function DocumentsPage() {
  const [isShowModalFilter, setIsShowModalFilter] = useState<boolean>(false);
  const [data, setData] = useState<DataDocumentsType[]>([
    {
      id: "101",
      docName: "Project Antasari - Quotation",
      tags: ["Quotation", "Project"],
      role: ["Quotation", "Project"],
      file: "file.pdf",
      status: "(3/3) Fully approved",
      latestAction: "(3/3) Fully approved",
      updateAt: new Date(),
    },
  ]);

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const {
    watch: watchFilter,
    control: controlFilter,
    handleSubmit: handleSubmitFilter,
    getValues: getValuesFilter,
    reset: resetFilter,
  } = useForm<FormFilterValues>({
    defaultValues: {
      search: "",
      date: "",
      status: [],
      role: [],
    },
  });

  const columns: TableProps<DataDocumentsType>["columns"] = [
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
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (text: string[]) => (
        <div className="flex gap-2 flex-warp">
          {text?.map((item: string) => {
            return (
              <Text
                key={item}
                label={item}
                className="text-base font-normal text-white py-1 px-2 rounded-full bg-gray-dark"
              />
            );
          })}
        </div>
      ),
    },
    {
      title: "File",
      dataIndex: "file",
      key: "file",
      render: (text: string) => {
        return (
          <div className="flex justify-center items-center">
            <FileIcon
              style={{
                height: 32,
                width: 32,
              }}
            />
          </div>
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
            className="text-base inline-block font-normal text-white py-1 px-2 rounded-full bg-link"
          />
        );
      },
    },
    {
      title: "Latest Action",
      dataIndex: "latestAction",
      key: "latestAction",
      render: (text: string) => {
        return (
          <Text
            label={text}
            className="text-base inline-block font-normal text-white py-1 px-2 rounded-full bg-link"
          />
        );
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text: string[]) => (
        <div className="flex gap-2 flex-warp">
          {text?.map((item: string) => {
            return (
              <Text
                key={item}
                label={item}
                className="text-base font-normal text-white py-1 px-2 rounded-full bg-gray-dark"
              />
            );
          })}
        </div>
      ),
    },
    {
      title: "Update At",
      dataIndex: "updateAt",
      key: "updateAt",
      render: (text: Date) => UseDateTimeFormat(text),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex justify-center items-center cursor-pointer">
            <PencilIcon
              style={{
                height: 32,
                width: 32,
                color: "#2166E9",
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleTableChange: TableProps["onChange"] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const debounceSearch = useDebounce(watchFilter("search"), 1000);

  const {
    data: dataDocument,
    isPending: isPendingDocument,
    refetch: refetchDocument,
  } = useDocument({
    query: {
      search: debounceSearch,
      date: getValuesFilter("date"),
      status: getValuesFilter("status").join(","),
      role: getValuesFilter("role").join(","),
    },
  });

  useEffect(() => {
    if (dataDocument) {
      setData(dataDocument.data);
    }
  }, [dataDocument]);

  const optionsStatus = [
    {
      label: "Uploaded",
      value: "Uploaded",
    },
    {
      label: "Updated",
      value: "Updated",
    },
    {
      label: "Partially Approved",
      value: "Partially Approved",
    },
    {
      label: "Fully Approved",
      value: "Fully Approved",
    },
    {
      label: "Partially Processed",
      value: "Partially Processed",
    },
    {
      label: "Fully Processed",
      value: "Fully Processed",
    },
  ];

  const optionsRole = [
    {
      label: "Owner",
      value: "Owner",
    },
    {
      label: "Collaborator",
      value: "Collaborator",
    },
    {
      label: "Authorizer",
      value: "Authorizer",
    },
    {
      label: "Recipient",
      value: "Recipient",
    },
  ];

  const onSubmitFilter = (data: FormFilterValues) => {
    refetchDocument();
    setIsShowModalFilter(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button
            type="button"
            onClick={() => {}}
            label="Add"
            icon={<PlusIcon />}
            className="flex justify-center items-center rounded-md bg-primary-blue px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />

          <Button
            type="button"
            onClick={() => {}}
            label="Delete"
            icon={<TrashIcon />}
            className="flex border border-primary-gray justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-primary-gray shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />
        </div>

        <div className="flex gap-4 items-center">
          <Button
            type="button"
            onClick={() => setIsShowModalFilter(true)}
            label="Filter"
            icon={<FilterIcon />}
            className="flex border border-black justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-black shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />

          <Controller
            control={controlFilter}
            name="search"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                onChange={onChange}
                error={error}
                onBlur={onBlur}
                value={value}
                name="search"
                type="text"
                required
                placeholder="Search"
                prefixIcon={<SearchIcon />}
                classNameInput="rounded-md border-0 p-3 ps-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
              />
            )}
          />
        </div>
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
            columns={columns}
            dataSource={data}
            scroll={{ x: 1500 }}
            loading={isPendingDocument}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </ConfigProvider>
      </div>

      <Modal
        title="Filter"
        open={isShowModalFilter}
        onCancel={() => {
          setIsShowModalFilter(false);
        }}
        footer={
          <div className="flex justify-between items-center">
            <Button
              type="button"
              onClick={() => {
                setIsShowModalFilter(false);
                resetFilter();
              }}
              label="Reset all"
              className="flex border border-red justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-red shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            />

            <div className="flex gap-4 items-center">
              <Button
                type="button"
                onClick={() => {
                  setIsShowModalFilter(false);
                }}
                label="Cancel"
                className="flex border border-primary-blue justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-primary-blue shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />

              <Button
                type="button"
                onClick={handleSubmitFilter(onSubmitFilter)}
                label="Filter"
                className="flex justify-center items-center rounded-md bg-primary-blue px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
          </div>
        }
      >
        <div>
          <Text label="Updated at" className="mb-2 text-lg font-semibold text-black" />
          <Controller
            control={controlFilter}
            name="date"
            render={({ field: { onChange } }: any) => {
              return <DatePicker.RangePicker format="YYYY/MM/DD" onChange={onChange} />;
            }}
          />

          <Text label="Status" className="mb-2 mt-4 text-lg font-semibold text-black" />

          <div className="p-2 border border-black rounded-md mb-4">
            <Controller
              control={controlFilter}
              name="status"
              render={({ field: { onChange, value } }) => (
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#0AADE0",
                      colorPrimaryBorder: "#2379AA",
                      colorPrimaryHover: "#2379AA",
                    },
                  }}
                >
                  <Checkbox.Group value={value} onChange={onChange}>
                    <div className="flex flex-col">
                      {optionsStatus.map((item) => (
                        <Checkbox key={item.value} value={item.label}>
                          {item.label}
                        </Checkbox>
                      ))}
                    </div>
                  </Checkbox.Group>
                </ConfigProvider>
              )}
            />
          </div>

          <Text label="Role" className="mb-2 text-lg font-semibold text-black" />

          <div className="p-2 border border-black rounded-md mb-4">
            <Controller
              control={controlFilter}
              name="role"
              render={({ field: { onChange, value } }) => (
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#0AADE0",
                      colorPrimaryBorder: "#2379AA",
                      colorPrimaryHover: "#2379AA",
                    },
                  }}
                >
                  <Checkbox.Group value={value} onChange={onChange}>
                    <div className="flex flex-col">
                      {optionsRole.map((item) => (
                        <Checkbox key={item.value} value={item.label}>
                          {item.label}
                        </Checkbox>
                      ))}
                    </div>
                  </Checkbox.Group>
                </ConfigProvider>
              )}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
