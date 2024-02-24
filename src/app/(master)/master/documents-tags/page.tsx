"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Text from "@/components/Text";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import useDebounce from "@/hook/useDebounce";
import { useOrderTableParams } from "@/hook/useOrderTableParams";
import { FormFilterValues } from "@/interface/common";
import {
  AddAndEditDocumentTagsModal,
  DataDocumentTags,
  DeleteDocumentTagsModal,
  FormDocumentTagsValues,
} from "@/interface/documents-tag.interface";
import {
  useCreateDocumentTags,
  useDeleteDocumentTags,
  useDocumentTags,
  useUpdateDocumentTags,
} from "@/services/document-tags/useDocumentTags";
import { FilterIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon } from "@/style/icon";
import {
  ConfigProvider,
  DatePicker,
  Modal,
  Table,
  TablePaginationConfig,
  TableProps,
  message,
} from "antd";
import { FilterValue } from "antd/es/table/interface";
import { Key, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDateRangeFormat } from "@/hook/useDateRangeFormat";

export default function DocumentTagsPage() {
  const [isShowModalFilter, setIsShowModalFilter] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isShowDelete, setIsShowDelete] = useState<DeleteDocumentTagsModal>({
    open: false,
    type: "selection",
    data: {
      data: null,
      selectedRowKeys: [],
    },
  });
  const [stateAddAndEditModal, setStateAddAndEditModal] = useState<AddAndEditDocumentTagsModal>({
    open: false,
    data: null,
    type: "add",
  });
  const [dataDocTag, setDataDocTag] = useState<DataDocumentTags[]>();

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
    },
  });

  const {
    control: controlAddAndEdit,
    handleSubmit: handleSubmitAddAndEdit,
    reset: resetAddAndEdit,
    setValue: setValueAddAndEdit,
  } = useForm<FormDocumentTagsValues>({
    defaultValues: {
      code: "",
      name: "",
    },
  });

  const columns: TableProps<DataDocumentTags>["columns"] = [
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
      title: "Code",
      sorter: true,
      dataIndex: "code",
      key: "code",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black" />;
      },
    },
    {
      title: "Tag Name",
      sorter: true,
      dataIndex: "name",
      key: "name",
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black" />;
      },
    },
    {
      title: "Update At",
      dataIndex: "updatedAt",
      sorter: true,
      key: "updatedAt",
      render: (text: Date) => UseConvertDateFormat(text),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex justify-center items-center cursor-pointer">
            <PencilIcon
              onClick={() => {
                setValueAddAndEdit("code", record.code);
                setValueAddAndEdit("name", record.name);

                setStateAddAndEditModal({
                  open: true,
                  data: record,
                  type: "edit",
                });
              }}
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
      setDataDocTag([]);
    }
  };

  const debounceSearch = useDebounce(watchFilter("search"), 1000);

  const {
    data: dataDocumentTags,
    isPending: isPendingDocumentTags,
    refetch: refetchDocumentTags,
  } = useDocumentTags({
    query: {
      search: debounceSearch,
      page: tableParams.pagination?.current,
      limit: tableParams.pagination?.pageSize,
      orderBy: useOrderTableParams(tableParams),
      updated_at_start: useDateRangeFormat(getValuesFilter("date")[0] as any),
      updated_at_end: useDateRangeFormat(getValuesFilter("date")[1] as any),
    },
  });

  useEffect(() => {
    if (dataDocumentTags?.data?.data) {
      const { data: mainData } = dataDocumentTags.data;
      const { data: dataListTable, meta } = mainData;

      setDataDocTag(
        dataListTable?.map((item: DataDocumentTags) => ({
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
  }, [dataDocumentTags]);

  const resetIsShowDelete = () => {
    setIsShowDelete({
      open: false,
      data: null,
      type: "",
    });
  };

  const onSubmitFilter = () => {
    refetchDocumentTags();
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
            data?.data?.find((el: any) => el.key === data?.selectedRowKeys[0])?.name
          } ?`;
    } else {
      return `Are you sure to delete document ${data?.name} ?`;
    }
  };

  const { mutate: deleteDocumentTags, isPending: isPendingDeleteDocumentTags }: any =
    useDeleteDocumentTags({
      options: {
        onSuccess: () => {
          messageApi.open({
            type: "success",
            content: "Success delete document tag",
          });

          refetchDocumentTags();
          resetIsShowDelete();
          setSelectedRowKeys([]);
        },
      },
    });

  useEffect(() => {
    refetchDocumentTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tableParams)]);

  const { mutate: createDocumentTags, isPending: isPendingCreateDocumentTags } =
    useCreateDocumentTags({
      options: {
        onSuccess: () => {
          messageApi.open({
            type: "success",
            content: "Success create document tag",
          });

          resetAddAndEdit();
          refetchDocumentTags();
          setStateAddAndEditModal({
            data: null,
            open: false,
            type: "",
          });
        },
      },
    });

  const { mutate: updateDocumentTags, isPending: isPendingUpdateDocumentTags } =
    useUpdateDocumentTags({
      id: stateAddAndEditModal.data?.id,
      options: {
        onSuccess: () => {
          messageApi.open({
            type: "success",
            content: "Success update document tag",
          });

          resetAddAndEdit();
          refetchDocumentTags();
          setStateAddAndEditModal({
            data: null,
            open: false,
            type: "",
          });
        },
      },
    });

  const onSubmitAddAndEdit = (data: FormDocumentTagsValues) => {
    if (stateAddAndEditModal.type === "add") {
      createDocumentTags(data);
    } else {
      updateDocumentTags(data);
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
              setStateAddAndEditModal({
                data: null,
                open: true,
                type: "add",
              })
            }
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
                data: { data: dataDocTag, selectedRowKeys },
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
            dataSource={dataDocTag}
            loading={
              isPendingDocumentTags || isPendingCreateDocumentTags || isPendingUpdateDocumentTags
            }
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
                loading={isPendingDeleteDocumentTags}
                disabled={isPendingDeleteDocumentTags}
                type="button"
                onClick={() => {
                  const rawData = selectedRowKeys.join(",");

                  deleteDocumentTags({
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

      <Modal
        title={`${stateAddAndEditModal.type === "edit" ? "Edit" : "Add"} document tag`}
        open={stateAddAndEditModal.open}
        onCancel={() => {
          resetAddAndEdit();
          setStateAddAndEditModal({
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
                  resetAddAndEdit();
                  setStateAddAndEditModal({
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
                onClick={handleSubmitAddAndEdit(onSubmitAddAndEdit)}
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
              control={controlAddAndEdit}
              rules={{
                required: "Code is required",
              }}
              name="code"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  onChange={onChange}
                  error={error}
                  onBlur={onBlur}
                  value={value}
                  name="code"
                  type="text"
                  required
                  placeholder="Enter code"
                  classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                  classNameLabel="block text-xl font-semibold text-black"
                  label="Code"
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={controlAddAndEdit}
              rules={{
                required: "Tag name is required",
              }}
              name="name"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  onChange={onChange}
                  error={error}
                  onBlur={onBlur}
                  value={value}
                  name="name"
                  type="text"
                  required
                  placeholder="Enter tag name"
                  classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                  classNameLabel="block text-xl font-semibold text-black"
                  label="Tag name"
                />
              )}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
