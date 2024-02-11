"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import InputTextArea from "@/components/InputTextArea";
import Text from "@/components/Text";
import UseDateTimeFormat from "@/hook/useDateFormat";
import useDebounce from "@/hook/useDebounce";
import { FormApproveRejectValues, FormFilterValues } from "@/interface/common";
import { ApproveAndRejectToReviewModal, DataToReviewType } from "@/interface/to-review.interface";
import { useToReview, useUpdateToReview } from "@/services/to-view/useToReview";
import { CheckIcon, FileIcon, FilterIcon, RejectIcon, SearchIcon } from "@/style/icon";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button as ButtonAntd,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Modal,
  Table,
  TableProps,
  Upload,
  message,
} from "antd";
import Link from "next/link";
import { Key, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ToReviewPage() {
  const [isShowModalFilter, setIsShowModalFilter] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<DataToReviewType[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const [stateApproveAndRejectModal, setStateApproveAndRejectModal] =
    useState<ApproveAndRejectToReviewModal>({
      open: false,
      data: null,
      type: "approve",
    });

  const [dataToReview, setDataToReview] = useState<DataToReviewType[]>([
    {
      id: "101",
      docName: "Project Antasari - Quotation",
      tags: ["Quotation", "Project"],
      file: "file.pdf",
      status: "(3/3) Fully approved",
      updatedAt: "30/06/2023 17:00",
    },
  ]);

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
  } = useForm<FormFilterValues>({
    defaultValues: {
      search: "",
      date: "",
      status: [],
      role: [],
    },
  });

  const {
    control: controlApproveRejectEdit,
    handleSubmit: handleSubmitApproveRejectEdit,
    reset: resetApproveRejectEdit,
  } = useForm<FormApproveRejectValues>({
    defaultValues: {
      note: "",
      file: "",
    },
  });

  const columns: TableProps<DataToReviewType>["columns"] = [
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
      dataIndex: "docName",
      key: "docName",
      sorter: true,
      render: (text: string, record: DataToReviewType) => {
        const { id } = record;
        return (
          <Link href={`/approvals/to-review/view/${id}`}>
            <Text label={text} className="text-base font-normal" />
          </Link>
        );
      },
    },
    {
      title: "Tags",
      dataIndex: "tags",
      sorter: true,
      key: "tags",
      render: (text: string[]) => (
        <div className="flex gap-2 flex-wrap">
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
      sorter: true,
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
      title: "Update At",
      sorter: true,
      dataIndex: "updateAt",
      key: "updateAt",
      render: (text: Date) => UseDateTimeFormat(text),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex items-center cursor-pointer gap-2">
            <Button
              type="button"
              onClick={() =>
                setStateApproveAndRejectModal({
                  open: true,
                  data: record,
                  type: "approve",
                })
              }
              label="Approve"
              icon={
                <CheckIcon
                  style={{
                    height: 32,
                    width: 32,
                    color: "#23C464",
                  }}
                />
              }
              className="flex gap-2 justify-center items-center rounded-md bg-transparent px-6 py-1.5 text-lg font-semibold text-green"
            />

            <Button
              type="button"
              onClick={() =>
                setStateApproveAndRejectModal({
                  open: true,
                  data: record,
                  type: "reject",
                })
              }
              label="Reject"
              icon={
                <RejectIcon
                  style={{
                    height: 32,
                    width: 32,
                    color: "#F44550",
                  }}
                />
              }
              className="flex gap-2 justify-center items-center rounded-md bg-transparent px-6 py-1.5 text-lg font-semibold text-red"
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
      setDataToReview([]);
    }
  };

  const debounceSearch = useDebounce(watchFilter("search"), 1000);

  const {
    data: dataRawToReview,
    isPending: isPendingRawToReview,
    refetch: refetchRawToReview,
  } = useToReview({
    query: {
      search: debounceSearch,
      status: getValuesFilter("status").join(","),
      role: getValuesFilter("role").join(","),
      page: tableParams.pagination?.current,
      limit: tableParams.pagination?.pageSize,
      orderBy: tableParams?.field
        ? `${tableParams.field}_${tableParams.order === "ascend" ? "asc" : "desc"}`
        : "",
      updated_at_start: getValuesFilter("date")[0],
      updated_at_end: getValuesFilter("date")[1],
    },
  });

  useEffect(() => {
    if (dataRawToReview) {
      const { data: mainData } = dataRawToReview.data;
      const { data: dataListTable, meta } = mainData;

      setDataToReview(
        dataListTable?.map((item: DataToReviewType) => ({
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
  }, [dataRawToReview]);

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
    refetchRawToReview();
    setIsShowModalFilter(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Key[], selectedRows: DataToReviewType[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  useEffect(() => {
    refetchRawToReview();
  }, [JSON.stringify(tableParams)]);

  const { mutate: updateApproveReject, isPending: isPendingUpdateApproveReject } =
    useUpdateToReview({
      options: {
        onSuccess: () => {
          messageApi.open({
            type: "success",
            content: "Success update review",
          });

          resetApproveRejectEdit();
          refetchRawToReview();
          setStateApproveAndRejectModal({
            data: null,
            open: false,
            type: "",
          });
        },
      },
    });

  const onSubmitApproveRejectEdit = (data: FormApproveRejectValues) => {
    updateApproveReject(data);
  };

  return (
    <div className="p-6">
      {contextHolder}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button
            type="button"
            onClick={() =>
              setStateApproveAndRejectModal({
                open: true,
                data: null,
                type: "approve",
              })
            }
            label="Approve"
            disabled={rowSelection.selectedRowKeys?.length === 0}
            icon={
              <CheckIcon
                style={{
                  color: rowSelection.selectedRowKeys?.length === 0 ? "#9CB1C6" : "#23C464",
                  height: 32,
                  width: 32,
                }}
              />
            }
            className={`${
              rowSelection.selectedRowKeys?.length === 0
                ? "text-primary-gray border-primary-gray"
                : "text-green border-green"
            } gap-2 flex border justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
          />

          <Button
            type="button"
            onClick={() =>
              setStateApproveAndRejectModal({
                open: true,
                data: null,
                type: "reject",
              })
            }
            label="Reject"
            disabled={rowSelection.selectedRowKeys?.length === 0}
            icon={
              <RejectIcon
                style={{
                  color: rowSelection.selectedRowKeys?.length === 0 ? "#9CB1C6" : "#F44550",
                  height: 32,
                  width: 32,
                }}
              />
            }
            className={`${
              rowSelection.selectedRowKeys?.length === 0
                ? "text-primary-gray border-primary-gray"
                : "text-red border-red"
            } gap-2 flex border justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
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
            dataSource={dataToReview}
            scroll={{ x: 1500 }}
            loading={isPendingRawToReview}
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
                disabled={isPendingUpdateApproveReject}
                loading={isPendingUpdateApproveReject}
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
                disabled={isPendingUpdateApproveReject}
                loading={isPendingUpdateApproveReject}
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
              name="note"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <InputTextArea
                  onChange={onChange}
                  error={error}
                  onBlur={onBlur}
                  value={value}
                  name="note"
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
              name="file"
              render={({ field: { onChange } }) => (
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#0AADE0",
                    },
                  }}
                >
                  <Upload
                    name="file"
                    headers={{
                      authorization: "authorization-text",
                    }}
                    onChange={(info) => {
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
              )}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
