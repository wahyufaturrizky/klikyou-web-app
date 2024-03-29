"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Text from "@/components/Text";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import { useDateRangeFormat } from "@/hook/useDateRangeFormat";
import useDebounce from "@/hook/useDebounce";
import { useOrderTableParams } from "@/hook/useOrderTableParams";
import { FormApproveRejectProcessValues, FormFilterValues } from "@/interface/common";
import { DataDocumentTags } from "@/interface/documents-tag.interface";
import { DataResDocument, DocumentTagsType } from "@/interface/documents.interface";
import { useDocumentTags } from "@/services/document-tags/useDocumentTags";
import { useDocument } from "@/services/document/useDocument";
import { DownloadIcon, FilterIcon, SearchIcon } from "@/style/icon";
import {
  ConfigProvider,
  DatePicker,
  Modal,
  Spin,
  Table,
  TablePaginationConfig,
  TableProps,
} from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import { FilterValue } from "antd/es/table/interface";
import Link from "next/link";
import { Key, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

// Author, Software Architect, Software Engineer, Software Developer : https://www.linkedin.com/in/wahyu-fatur-rizky

export default function ProcessedPage() {
  const [isShowModalFilter, setIsShowModalFilter] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [dataTag, setDataTag] = useState<DefaultOptionType[] | undefined>([]);

  const [searchTagDocument, setSearchTagDocument] = useState<string>("");

  const debounceSearchTagDocument = useDebounce(searchTagDocument, 800);

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
      filter_tag: [],
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
          <Link href={`/received/processed/view/${id}`}>
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
    data: dataRawProcessed,
    isPending: isPendingProcessed,
    refetch: refetchProcessed,
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
      history: 1,
    },
  });

  useEffect(() => {
    if (dataRawProcessed) {
      const { data: mainData } = dataRawProcessed.data;
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
  }, [dataRawProcessed]);

  const onSubmitFilter = (data: FormFilterValues) => {
    refetchProcessed();
    setIsShowModalFilter(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  useEffect(() => {
    refetchProcessed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tableParams)]);

  return (
    <div className="p-6">
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
            loading={isPendingProcessed || isPendingTag}
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
    </div>
  );
}
