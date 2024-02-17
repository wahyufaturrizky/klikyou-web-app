"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Text from "@/components/Text";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import useDebounce from "@/hook/useDebounce";
import { FormFilterValues, RoleType } from "@/interface/common";
import {
  DataResDocument,
  DeleteDocumentModal,
  DocumentTagsType,
  FormFilterValuesDocuments,
} from "@/interface/documents.interface";
import { useDeleteBulkDocument, useDocument } from "@/services/document/useDocument";
import { useRole } from "@/services/role/useRole";
import { FileIcon, FilterIcon, PlusIcon, SearchIcon, TrashIcon } from "@/style/icon";
import {
  Checkbox,
  ConfigProvider,
  DatePicker,
  Modal,
  Spin,
  Table,
  TableProps,
  message,
} from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useOrderTableParams } from "@/hook/useOrderTableParams";
import { UseBgColorStatus } from "@/hook/useBgColorStatus";
import { UseBgColorAction } from "@/hook/useBgColorAction";

export default function DocumentsPage() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [isShowModalFilter, setIsShowModalFilter] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [dataRole, setDataRole] = useState<DefaultOptionType[]>([]);
  const [isShowDelete, setIsShowDelete] = useState<DeleteDocumentModal>({
    open: false,
    type: "selection",
    data: {
      data: null,
      selectedRowKeys: [],
    },
  });
  const [dataListDocument, setDataListDocument] = useState<DataResDocument[]>([]);

  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
    },
  });

  const {
    watch: watchFilter,
    control: controlFilter,
    handleSubmit: handleSubmitFilter,
    getValues: getValuesFilter,
    reset: resetFilter,
  } = useForm<FormFilterValuesDocuments>({
    defaultValues: {
      search: "",
      date: "",
      status: [],
      currentUserRole: "",
    },
  });

  const { data: dataListRole, isPending: isPendingRole } = useRole();

  useEffect(() => {
    const fetchDataRole = () => {
      setDataRole(
        dataListRole.data.data.map((itemRole: RoleType) => ({
          label: itemRole.levelName,
          value: itemRole.id,
        }))
      );
    };

    if (dataListRole) {
      fetchDataRole();
    }
  }, [dataListRole]);

  const columns: TableProps<DataResDocument>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: true,
      key: "id",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black" />;
      },
    },
    {
      title: "Document name",
      dataIndex: "documentName",
      sorter: true,
      key: "documentName",
      render: (text: string, record: DataResDocument) => {
        const { id } = record;
        return (
          <Link href={`/documents/view/${id}`}>
            <Text label={text} className="text-base font-normal" />
          </Link>
        );
      },
    },
    {
      title: "Tags",
      dataIndex: "documentTags",
      key: "documentTags",
      sorter: true,
      render: (text: DocumentTagsType[]) => (
        <div className="flex gap-2 flex-wrap">
          {text?.map((item: DocumentTagsType) => {
            return (
              <Text
                key={item.id}
                label={item.tag.name}
                className="text-base font-normal text-white py-1 px-2 rounded-full bg-gray-dark"
              />
            );
          })}
        </div>
      ),
    },
    {
      title: "File",
      dataIndex: "documentPath",
      key: "documentPath",
      render: (text: string) => {
        return (
          <div className="flex justify-center items-center">
            <FileIcon
              style={{
                height: 32,
                width: 32,
                color: "#0AADE0",
              }}
            />
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      key: "status",
      render: (text: string) => {
        return (
          <Text
            label={text}
            className={`text-base inline-block font-normal text-white py-1 px-2 rounded-full ${UseBgColorStatus(
              text
            )}`}
          />
        );
      },
    },
    {
      title: "Latest Action",
      sorter: true,
      dataIndex: "action",
      key: "action",
      render: (text: string) => {
        return (
          <Text
            label={text}
            className={`text-base inline-block font-normal text-white py-1 px-2 rounded-full ${UseBgColorAction(
              text
            )}`}
          />
        );
      },
    },
    {
      title: "Role",
      sorter: true,
      dataIndex: "currentUserRole",
      key: "currentUserRole",
      render: (text: string) => (
        <Text
          key={text}
          label={text}
          className="text-base font-normal inline-block text-white py-1 px-2 rounded-full bg-gray-dark"
        />
      ),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      sorter: true,
      key: "updatedAt",
      render: (text: Date) => UseConvertDateFormat(text),
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
      setDataListDocument([]);
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
      status: getValuesFilter("status").join(","),
      currentUserRole: getValuesFilter("currentUserRole"),
      page: tableParams.pagination?.current,
      limit: tableParams.pagination?.pageSize,
      orderBy: useOrderTableParams(tableParams),
      updated_at_start: getValuesFilter("date")[0],
      updated_at_end: getValuesFilter("date")[1],
    },
  });

  useEffect(() => {
    if (dataDocument?.data?.data) {
      const { data: mainData } = dataDocument.data;
      const { data: dataListTable, meta } = mainData;

      setDataListDocument(
        dataListTable?.map((item: DataResDocument) => ({
          ...item,
          key: item.id,
        }))
      );

      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: meta?.total,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const resetIsShowDelete = () => {
    setIsShowDelete({
      open: false,
      data: null,
      type: "",
    });
  };

  const onSubmitFilter = (data: FormFilterValues) => {
    refetchDocument();
    setIsShowModalFilter(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const renderConfirmationText = (type: any, data: any) => {
    if (type === "selection") {
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete document ${
            data?.data?.find((el: any) => el.key === data?.selectedRowKeys[0])?.documentName
          } ?`;
    } else {
      return `Are you sure to delete document ${data?.documentName} ?`;
    }
  };

  const { mutate: deleteDocument, isPending: isPendingDeleteDocument }: any = useDeleteBulkDocument(
    {
      options: {
        onSuccess: () => {
          messageApi.open({
            type: "success",
            content: "Delete document success",
          });

          refetchDocument();
          resetIsShowDelete();
          setSelectedRowKeys([]);
        },
      },
    }
  );

  useEffect(() => {
    refetchDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tableParams)]);

  const isLoading = isPendingRole;

  return (
    <div className="p-6">
      {contextHolder}
      {isLoading && <Spin fullscreen />}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button
            type="button"
            onClick={() => router.push("/documents/add")}
            label="Add"
            icon={<PlusIcon />}
            className="flex justify-center items-center rounded-md bg-primary-blue px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />

          <Button
            type="button"
            onClick={() =>
              setIsShowDelete({
                open: true,
                type: "selection",
                data: { data: dataListDocument, selectedRowKeys },
              })
            }
            label="Delete"
            disabled={rowSelection.selectedRowKeys?.length === 0}
            icon={
              <TrashIcon
                style={{
                  color: rowSelection.selectedRowKeys?.length === 0 ? "#9CB1C6" : "#F44550",
                }}
              />
            }
            className={`${
              rowSelection.selectedRowKeys?.length === 0
                ? "text-primary-gray border-primary-gray"
                : "text-red border-red"
            } flex border justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
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
            token: {
              colorPrimary: "#0AADE0",
            },
            components: {
              Table: {
                headerBg: "white",
              },
            },
          }}
        >
          <Table
            columns={columns}
            dataSource={dataListDocument}
            scroll={{ x: 1500 }}
            loading={isPendingDocument}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            rowSelection={rowSelection}
            rowKey={(record) => record.id}
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
            render={({ field: { onChange, value } }: any) => {
              return (
                <DatePicker.RangePicker value={value} format="YYYY/MM/DD" onChange={onChange} />
              );
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
              name="currentUserRole"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Select
                  name="currentUserRole"
                  options={dataRole}
                  onChange={onChange}
                  value={value}
                  styleSelect={{ width: "100%" }}
                  label="Role"
                  classNameLabel="block text-lg font-semibold text-black"
                />
              )}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={isShowDelete.open}
        onCancel={() => {
          setIsShowDelete({
            open: false,
            data: null,
            type: "",
          });
        }}
        footer={
          <div className="flex justify-end items-center">
            <div className="flex gap-4 items-center">
              <Button
                type="button"
                onClick={() => {
                  setIsShowDelete({
                    open: false,
                    data: null,
                    type: "",
                  });
                }}
                label="No"
                className="flex border border-primary-blue justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-primary-blue shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />

              <Button
                loading={isPendingDeleteDocument}
                disabled={isPendingDeleteDocument}
                type="button"
                onClick={() => {
                  const rawData = selectedRowKeys.join(",");

                  deleteDocument({
                    ids: rawData,
                  });
                }}
                label="Yes"
                className="flex justify-center items-center rounded-md bg-red px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
          </div>
        }
      >
        <div>{renderConfirmationText(isShowDelete.type, isShowDelete.data)}</div>
      </Modal>
    </div>
  );
}
