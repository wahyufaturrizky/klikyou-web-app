"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import InputTextArea from "@/components/InputTextArea";
import Select from "@/components/Select";
import Text from "@/components/Text";
import { useActionApproveRejectProcess } from "@/hook/useActionApproveRejectProcess";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import { useDateRangeFormat } from "@/hook/useDateRangeFormat";
import useDebounce from "@/hook/useDebounce";
import { useOrderTableParams } from "@/hook/useOrderTableParams";
import {
  ApproveRejectProcessModal,
  FormApproveRejectProcessValues,
  FormFilterValues,
} from "@/interface/common";
import { DataDocumentTags } from "@/interface/documents-tag.interface";
import { DataResDocument, DocumentTagsType } from "@/interface/documents.interface";
import { useDocumentTags } from "@/services/document-tags/useDocumentTags";
import { useDocument, useDocumentApproveRejectProcess } from "@/services/document/useDocument";
import { DownloadIcon, FilterIcon, PeopleCheckIcon, SearchIcon } from "@/style/icon";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button as ButtonAntd,
  ConfigProvider,
  DatePicker,
  Modal,
  Spin,
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
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

// Author, Software Architect, Software Engineer, Software Developer : https://www.linkedin.com/in/wahyu-fatur-rizky

export default function ToDoPage() {
  const [isShowModalFilter, setIsShowModalFilter] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dataTag, setDataTag] = useState<DefaultOptionType[] | undefined>([]);

  const [isUploadFile, setIsUploadFile] = useState<boolean>(false);

  const [searchTagDocument, setSearchTagDocument] = useState<string>("");

  const debounceSearchTagDocument = useDebounce(searchTagDocument, 800);

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
      filter_approval: [],
    },
  });

  const { data: dataListTag, isPending: isPendingTag } = useDocumentTags({
    query: {
      search: debounceSearchTagDocument,
    },
  });

  useEffect(() => {
    const fetchDataTag = () => {
      setDataTag(
        dataListTag?.data.data.data.map((itemTag: DataDocumentTags) => ({
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
      sorter: true,
      key: "documentName",
      render: (text: string, record: DataResDocument) => {
        const { id } = record;
        return (
          <Link href={`/received/to-do/view/${id}`}>
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
      title: "Updated At",
      dataIndex: "updatedAt",
      sorter: true,
      key: "updatedAt",
      render: (text: Date) => UseConvertDateFormat(text),
    },
    {
      title: "Latest document",
      dataIndex: "documentPath",
      key: "documentPath",
      render: (text: string) => {
        if (!text) {
          return;
        }
        return (
          <Link
            rel="noopener noreferrer"
            target="_blank"
            className="gap-2 flex items-center cursor-pointer"
            href={text || ""}
          >
            <DownloadIcon
              style={{
                height: 32,
                width: 32,
                color: "#2166E9",
              }}
            />
            <Text label="Download" className="text-base font-normal text-link" />
          </Link>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: DataResDocument) => {
        return (
          <div className="flex items-center">
            <Button
              type="button"
              onClick={() =>
                setStateApproveAndRejectModal({
                  open: true,
                  data: record,
                  type: "process",
                })
              }
              label="Mark as Processed"
              icon={
                <PeopleCheckIcon
                  style={{
                    height: 32,
                    width: 32,
                    color: "#B0039E",
                  }}
                />
              }
              className="flex gap-2 justify-center items-center rounded-md bg-transparent px-6 py-1.5 text-lg font-semibold text-primary-purple"
            />
          </div>
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
    action: "receival",
    query: {
      search: debounceSearch,
      filter_tag: (getValuesFilter("filter_tag") ?? [""]).join(","),
      page: tableParams.pagination?.current,
      limit: tableParams.pagination?.pageSize,
      orderBy: useOrderTableParams(tableParams),
      updated_at_start: useDateRangeFormat(getValuesFilter("date")?.[0] as any),
      updated_at_end: useDateRangeFormat(getValuesFilter("date")?.[1] as any),
      history: 0,
    },
  });

  useEffect(() => {
    if (dataDocument) {
      const { data: mainData } = dataDocument.data;
      const { data: dataListTable, meta } = mainData;

      setDataListDocument(
        dataListTable?.map((item: any) => ({
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

  const onSubmitFilter = (data: FormFilterValues) => {
    refetchDocument();
    setIsShowModalFilter(false);
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
        onSuccess: (res: any) => {
          if (res?.status === 200) {
            messageApi.open({
              type: "success",
              content: "Success " + stateApproveAndRejectModal.type,
            });

            resetApproveRejectEdit();
            refetchDocument();
            setStateApproveAndRejectModal({
              data: null,
              open: false,
              type: "",
            });
          }
        },
      },
    });

  const onSubmitApproveRejectEdit = (data: FormApproveRejectProcessValues) => {
    const { supporting_document_note, supporting_document_path } = data;

    let formdata = new FormData();

    formdata.append("supporting_document_note", supporting_document_note);
    formdata.append("supporting_document_path", supporting_document_path?.file.originFileObj);

    updateApproveRejectProcess(formdata);
  };

  return (
    <div className="p-6">
      {contextHolder}
      <div className="flex justify-end items-center">
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
            loading={isPendingDocument || isPendingTag}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
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
                  onBlur={() => {
                    setSearchTagDocument("");
                  }}
                  onSearch={(val: string) => setSearchTagDocument(val)}
                  notFoundContent={isPendingTag ? <Spin size="small" /> : null}
                  filterOption={false}
                />
              )}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title={`${stateApproveAndRejectModal.type === "process" ? "Process" : ""} document tag`}
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
                disabled={isPendingApproveRejectProcess || isUploadFile}
                loading={isPendingApproveRejectProcess || isUploadFile}
                onClick={handleSubmitApproveRejectEdit(onSubmitApproveRejectEdit)}
                label={
                  isPendingApproveRejectProcess || isUploadFile ? "Loading..." : "Mark as Processed"
                }
                icon={
                  <PeopleCheckIcon
                    style={{
                      height: 32,
                      width: 32,
                      color: "white",
                    }}
                  />
                }
                className="flex gap-2 justify-center items-center rounded-md bg-primary-purple px-6 py-1.5 text-lg font-semibold text-white hover:bg-primary-purple/70 active:bg-primary-purple/90"
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
                        setIsUploadFile(true);
                        setFileList(info.fileList);
                        if (info.file.status !== "uploading") {
                          console.log(info.file, info.fileList);
                        }
                        if (info.file.status === "done") {
                          message.success(`${info.file.name} file uploaded successfully`);
                          onChange(info);
                          setIsUploadFile(false);
                        } else if (info.file.status === "error") {
                          message.error(`${info.file.name} file upload failed.`);
                          setIsUploadFile(false);
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
    </div>
  );
}
