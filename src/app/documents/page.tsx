"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Text from "@/components/Text";
import { UseBgColorAction } from "@/hook/useBgColorAction";
import { UseBgColorStatus } from "@/hook/useBgColorStatus";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import useDebounce from "@/hook/useDebounce";
import { useOrderTableParams } from "@/hook/useOrderTableParams";
import { FormFilterValues, RoleType, TagType } from "@/interface/common";
import {
  DataResDocument,
  DeleteDocumentModal,
  DocumentTagsType,
  FormFilterValuesDocuments,
} from "@/interface/documents.interface";
import { useDocumentTags } from "@/services/document-tags/useDocumentTags";
import { useDeleteBulkDocument, useDocument } from "@/services/document/useDocument";
import { useRole } from "@/services/role/useRole";
import { FileIcon, FilterIcon, PlusIcon, SearchIcon, TrashIcon } from "@/style/icon";
import {
  ConfigProvider,
  DatePicker,
  Modal,
  Spin,
  Table,
  TablePaginationConfig,
  TableProps,
  message,
} from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import { FilterValue } from "antd/es/table/interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function DocumentsPage() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [isShowModalFilter, setIsShowModalFilter] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [dataTag, setDataTag] = useState<DefaultOptionType[]>([]);

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

  const [tableParams, setTableParams] = useState<{
    pagination: TablePaginationConfig;
  }>({
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
      filter_type: "",
      status: [],
      filter_tag: [],
      latest_action_filter: [],
    },
  });

  const { data: dataListRole, isPending: isPendingRole } = useRole();
  const { data: dataListTag, isPending: isPendingTag } = useDocumentTags();

  useEffect(() => {
    const fetchDataTag = () => {
      setDataTag(
        dataListTag.data.data.data.map((itemTag: TagType) => ({
          label: itemTag.name,
          value: itemTag.id,
        }))
      );
    };

    const fetchDataRole = () => {
      setDataRole(
        dataListRole.data.data
          .filter((filterRole: RoleType) => !["Super Admin"].includes(filterRole.levelName))
          .map((itemRole: RoleType) => ({
            label: itemRole.levelName,
            value: itemRole.id,
          }))
      );
    };

    if (dataListRole) {
      fetchDataRole();
    }

    if (dataListTag) {
      fetchDataTag();
    }
  }, [dataListTag, dataListRole]);

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

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: any
  ) => {
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
      filter_type: getValuesFilter("filter_type") ?? "",
      status: (getValuesFilter("status") ?? [""]).join(","),
      filter_tag: (getValuesFilter("filter_tag") ?? [""]).join(","),
      latest_action_filter: (getValuesFilter("latest_action_filter") ?? [""]).join(","),
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
      value: "uploaded",
    },
    {
      label: "Updated",
      value: "updated",
    },
    {
      label: "Partially Approved",
      value: "partially approved",
    },
    {
      label: "Fully Approved",
      value: "fully approved",
    },
    {
      label: "Partially Processed",
      value: "partially processed",
    },
    {
      label: "Fully Processed",
      value: "fully processed",
    },
  ];

  const optionsLatestAction = [
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Approved",
      value: "approved",
    },
    {
      label: "Rejected",
      value: "rejected",
    },
    {
      label: "Processed",
      value: "processed",
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

  const isLoading = isPendingRole || isPendingTag;

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
          <div className="mb-2">
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
          </div>

          <div className="mb-2">
            <Controller
              control={controlFilter}
              name="filter_tag"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Select
                  mode="multiple"
                  name="filter_tag"
                  onChange={onChange}
                  options={dataTag}
                  tokenSeparators={[","]}
                  value={value}
                  styleSelect={{ width: "100%" }}
                  error={error}
                  label="Tags"
                  classNameLabel="block text-lg font-semibold text-black"
                />
              )}
            />
          </div>

          <div className="mb-2">
            <Controller
              control={controlFilter}
              name="status"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Select
                  name="status"
                  mode="multiple"
                  tokenSeparators={[","]}
                  options={optionsStatus}
                  onChange={onChange}
                  value={value}
                  error={error}
                  styleSelect={{ width: "100%" }}
                  label="Status"
                  classNameLabel="block text-lg font-semibold text-black"
                />
              )}
            />
          </div>

          <div className="mb-2">
            <Controller
              control={controlFilter}
              name="latest_action_filter"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Select
                  name="latest_action_filter"
                  mode="multiple"
                  tokenSeparators={[","]}
                  options={optionsLatestAction}
                  onChange={onChange}
                  value={value}
                  styleSelect={{ width: "100%" }}
                  label="Latest action"
                  classNameLabel="block text-lg font-semibold text-black"
                />
              )}
            />
          </div>

          <div className="mb-2">
            <Controller
              control={controlFilter}
              name="filter_type"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Select
                  name="filter_type"
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
