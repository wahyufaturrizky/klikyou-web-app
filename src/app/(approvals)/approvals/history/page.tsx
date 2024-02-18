"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import InputTextArea from "@/components/InputTextArea";
import Select from "@/components/Select";
import Text from "@/components/Text";
import { useActionApproveRejectProcess } from "@/hook/useActionApproveRejectProcess";
import { UseBgColorAction } from "@/hook/useBgColorAction";
import { UseBgColorStatus } from "@/hook/useBgColorStatus";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import useDebounce from "@/hook/useDebounce";
import { useOrderTableParams } from "@/hook/useOrderTableParams";
import {
  ApproveRejectProcessModal,
  FormApproveRejectProcessValues,
  FormFilterValues,
  TagType,
} from "@/interface/common";
import {
  DataResDocument,
  DeleteDocumentModal,
  DocumentTagsType,
} from "@/interface/documents.interface";
import { useDocumentTags } from "@/services/document-tags/useDocumentTags";
import {
  useDeleteDocument,
  useDocument,
  useDocumentApproveRejectProcess,
} from "@/services/document/useDocument";
import { FileIcon, FilterIcon, SearchIcon, TrashIcon } from "@/style/icon";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button as ButtonAntd,
  ConfigProvider,
  DatePicker,
  Modal,
  Table,
  TablePaginationConfig,
  TableProps,
  Upload,
  UploadFile,
  message,
} from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import { FilterValue } from "antd/es/table/interface";
import Link from "next/link";
import { Key, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function HistoryPage() {
  const [isShowModalFilter, setIsShowModalFilter] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dataTag, setDataTag] = useState<DefaultOptionType[]>([]);

  const [isShowDelete, setIsShowDelete] = useState<DeleteDocumentModal>({
    open: false,
    type: "selection",
    data: {
      data: null,
      selectedRowKeys: [],
    },
  });

  const [messageApi, contextHolder] = message.useMessage();

  const [stateApproveAndRejectModal, setStateApproveAndRejectModal] =
    useState<ApproveRejectProcessModal>({
      open: false,
      data: null,
      type: "approve",
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
  } = useForm<FormFilterValues>({
    defaultValues: {
      search: "",
      date: "",
      status: [],
      filter_approval: [],
    },
  });

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

    if (dataListTag) {
      fetchDataTag();
    }
  }, [dataListTag]);

  const {
    control: controlApproveRejectEdit,
    handleSubmit: handleSubmitApproveRejectEdit,
    reset: resetApproveRejectEdit,
  } = useForm<FormApproveRejectProcessValues>({
    defaultValues: {
      supporting_document_note: "",
      supporting_document_path: "",
    },
  });

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
      key: "documentName",
      sorter: true,
      render: (text: string, record: DataResDocument) => {
        const { id } = record;
        return (
          <Link href={`/approvals/history/view/${id}`}>
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
      render: () => {
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
      key: "status",
      sorter: true,
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
      title: "Update At",
      dataIndex: "updateAt",
      key: "updateAt",
      sorter: true,
      render: (text: Date) => UseConvertDateFormat(text),
    },
    {
      title: "Approval",
      dataIndex: "approval",
      key: "approval",
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
    action: "approval",
    query: {
      search: debounceSearch,
      status: (getValuesFilter("status") ?? [""]).join(","),
      filter_tag: (getValuesFilter("filter_tag") ?? [""]).join(","),
      filter_approval: (getValuesFilter("filter_approval") ?? [""]).join(","),
      page: tableParams.pagination?.current,
      limit: tableParams.pagination?.pageSize,
      orderBy: useOrderTableParams(tableParams),
      updated_at_start: getValuesFilter("date")[0],
      updated_at_end: getValuesFilter("date")[1],
      history: 1,
    },
  });

  useEffect(() => {
    if (dataDocument) {
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

  const optionsApproval = [
    {
      label: "Approved",
      value: "approved",
    },
    {
      label: "Rejected",
      value: "rejected",
    },
  ];

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

  useEffect(() => {
    refetchDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tableParams)]);

  const { mutate: updateApproveRejectProcess, isPending: isPendingApproveRejectProcess } =
    useDocumentApproveRejectProcess({
      id: stateApproveAndRejectModal.data?.id,
      action: useActionApproveRejectProcess(stateApproveAndRejectModal.type),
      options: {
        onSuccess: () => {
          messageApi.open({
            type: "success",
            content: "Success update review",
          });

          resetApproveRejectEdit();
          refetchDocument();
          setStateApproveAndRejectModal({
            data: null,
            open: false,
            type: "",
          });
        },
      },
    });

  const onSubmitApproveRejectEdit = (data: FormApproveRejectProcessValues) => {
    updateApproveRejectProcess(data);
  };

  const { mutate: deleteUserManagement, isPending: isPendingDeleteUserManagement }: any =
    useDeleteDocument({
      options: {
        onSuccess: () => {
          refetchDocument();
          setIsShowDelete({
            open: true,
            type: "",
            data: null,
          });
          setSelectedRowKeys([]);
        },
      },
    });

  const renderConfirmationText = (type: any, data: any) => {
    if (type === "selection") {
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete document ${
            data?.data?.find((el: any) => el.key === data?.selectedRowKeys[0])?.branchName
          } ?`;
    } else {
      return `Are you sure to delete document ${data?.name} ?`;
    }
  };

  return (
    <div className="p-6">
      {contextHolder}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
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
            loading={isPendingDocument || isPendingTag}
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
              name="filter_approval"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Select
                  name="filter_approval"
                  mode="multiple"
                  tokenSeparators={[","]}
                  options={optionsApproval}
                  onChange={onChange}
                  value={value}
                  error={error}
                  styleSelect={{ width: "100%" }}
                  label="Approval"
                  classNameLabel="block text-lg font-semibold text-black"
                />
              )}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title={`${
          stateApproveAndRejectModal.type === "approve" ? "Approve" : "Reject"
        } document tag`}
        open={stateApproveAndRejectModal.open}
        onCancel={() => {
          resetApproveRejectEdit();
          setStateApproveAndRejectModal({
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
                disabled={isPendingApproveRejectProcess}
                loading={isPendingApproveRejectProcess}
                onClick={() => {
                  resetApproveRejectEdit();
                  setStateApproveAndRejectModal({
                    open: false,
                    data: null,
                    type: "",
                  });
                }}
                label="Cancel"
                className="flex border border-primary-blue justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-primary-blue shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />

              <Button
                type="button"
                disabled={isPendingApproveRejectProcess}
                loading={isPendingApproveRejectProcess}
                onClick={handleSubmitApproveRejectEdit(onSubmitApproveRejectEdit)}
                label="Yes"
                className="flex justify-center items-center rounded-md bg-primary-blue px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
          </div>
        }
      >
        <div>
          <div className="mb-6">
            <Controller
              control={controlApproveRejectEdit}
              name="supporting_document_note"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <InputTextArea
                  onChange={onChange}
                  error={error}
                  onBlur={onBlur}
                  value={value}
                  name="supporting_document_note"
                  placeholder="Enter note"
                  classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                  classNameLabel="block text-xl font-semibold text-black"
                  label="Note"
                />
              )}
            />
          </div>

          <div>
            <Text
              label="Upload supporting files"
              className="mb-2 text-lg font-semibold text-black"
            />

            <Controller
              control={controlApproveRejectEdit}
              rules={{
                required: "Document is required",
              }}
              name="supporting_document_path"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <div>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#0AADE0",
                      },
                    }}
                  >
                    <Upload
                      multiple={false}
                      maxCount={1}
                      fileList={fileList}
                      name="supporting_document_path"
                      headers={{
                        authorization: "authorization-text",
                      }}
                      onChange={(info) => {
                        setFileList(info.fileList);
                        if (info.file.status !== "uploading") {
                          console.log(info.file, info.fileList);
                        }
                        if (info.file.status === "done") {
                          message.success(`${info.file.name} file uploaded successfully`);
                          onChange(JSON.stringify(info));
                        } else if (info.file.status === "error") {
                          message.error(`${info.file.name} file upload failed.`);
                        }
                      }}
                    >
                      <ButtonAntd type="primary" icon={<UploadOutlined />}></ButtonAntd>
                    </Upload>
                  </ConfigProvider>

                  {error && (
                    <Text
                      className="text-[#EB5757] font-roboto mt-2 font-bold text-sm"
                      label={String(error.message)}
                    />
                  )}
                </div>
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
                loading={isPendingDeleteUserManagement}
                disabled={isPendingDeleteUserManagement}
                type="button"
                onClick={() => {
                  const rawData = selectedRowKeys.join(",");

                  deleteUserManagement({
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
