"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import Text from "@/components/Text";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import useDebounce from "@/hook/useDebounce";
import { useOrderTableParams } from "@/hook/useOrderTableParams";
import { FormFilterValues, RoleType } from "@/interface/common";
import {
  ColumnsType,
  DeleteUserManagementModal,
  RoleResType,
} from "@/interface/user-management.interface";
import {
  useDeleteBulkUserManagement,
  useUserManagement,
} from "@/services/user-management/useUserManagement";
import { FilterIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon } from "@/style/icon";
import { ConfigProvider, DatePicker, Modal, Table, TablePaginationConfig, Spin } from "antd";
import { FilterValue } from "antd/es/table/interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRole } from "@/services/role/useRole";
import { useUserTags } from "@/services/user-tags/useUserTags";
import { DataUserTags } from "@/interface/user-tag.interface";
import { DefaultOptionType } from "antd/es/cascader";
import Select from "@/components/Select";
import { useDateRangeFormat } from "@/hook/useDateRangeFormat";
import { DataPureMyprofileType } from "@/interface/my-profile.interface";

export default function UserManagementPage() {
  const router = useRouter();
  const [isShowModalFilter, setIsShowModalFilter] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [dataRole, setDataRole] = useState<DefaultOptionType[]>([]);

  const [searchRole, setSearchRole] = useState<string>("");

  const debounceSearchRole = useDebounce(searchRole, 800);

  const [dataUserTag, setDataUserTag] = useState<DefaultOptionType[]>([]);

  const [searchSearchUserTag, setSearchSearchUserTag] = useState<string>("");

  const debounceSearchUserTag = useDebounce(searchSearchUserTag, 800);

  const [isShowDelete, setIsShowDelete] = useState<DeleteUserManagementModal>({
    open: false,
    type: "selection",
    data: {
      data: null,
      selectedRowKeys: [],
    },
  });
  const [dataListUser, setDataListUser] = useState<DataPureMyprofileType[]>([]);

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
      filter_type: [],
    },
  });

  const { data: dataListRole, isPending: isPendingRole } = useRole({
    query: {
      search: debounceSearchRole,
    },
  });

  const { data: dataListUserTag, isPending: isPendingUserTag } = useUserTags({
    query: {
      search: debounceSearchUserTag,
    },
  });

  useEffect(() => {
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

    const fetchDataUserTag = () => {
      setDataUserTag(
        dataListUserTag.data.data.data.map((itemTag: DataUserTags) => ({
          label: itemTag.documentType,
          value: itemTag.id,
        }))
      );
    };

    if (dataListRole) {
      fetchDataRole();
    }

    if (dataListUserTag) {
      fetchDataUserTag();
    }
  }, [dataListRole, dataListUserTag]);

  const columns: ColumnsType<DataPureMyprofileType> = [
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
      title: "User full name",
      dataIndex: "username",
      key: "username",
      sorter: true,
      render: (text: string, record: DataPureMyprofileType) => {
        const { avatarPath, firstName, lastName, id } = record;
        return (
          <div className="gap-2 flex items-center">
            <ImageNext
              src={avatarPath || "/placeholder-profile.png"}
              priority
              width={32}
              height={32}
              alt="logo-klikyou"
              className="h-[32px] w-[32px] rounded-full object-cover"
            />
            <Link href={`/user-management/view/${id}`}>
              <Text label={`${firstName} ${lastName}`} className="text-base font-normal" />
            </Link>
          </div>
        );
      },
    },
    {
      title: "Email address",
      dataIndex: "email",
      key: "email",
      sorter: true,
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black" />;
      },
    },
    {
      title: "Level",
      dataIndex: "role",
      key: "role",
      sorter: true,
      render: (text: RoleResType) => {
        return <Text label={text.levelName} className="text-base font-normal text-black" />;
      },
    },
    {
      title: "Update At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: true,
      render: (text: Date) => UseConvertDateFormat(text),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex justify-center items-center cursor-pointer">
            <PencilIcon
              onClick={() => router.push(`/user-management/edit/${record.id}`)}
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
      setDataListUser([]);
    }
  };

  const debounceSearch = useDebounce(watchFilter("search"), 1000);

  const {
    data: dataUserManagement,
    isPending: isPendingUserManagement,
    refetch: refetchDocumentUserManagement,
  } = useUserManagement({
    query: {
      search: debounceSearch,
      filter_type: (getValuesFilter("filter_type") ?? [""]).join(","),
      filter_tag: (getValuesFilter("filter_tag") ?? [""]).join(","),
      page: tableParams.pagination?.current,
      limit: tableParams.pagination?.pageSize,
      orderBy: useOrderTableParams(tableParams),
      updated_at_start: useDateRangeFormat(getValuesFilter("date")?.[0] as any),
      updated_at_end: useDateRangeFormat(getValuesFilter("date")?.[1] as any),
    },
  });

  useEffect(() => {
    refetchDocumentUserManagement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tableParams)]);

  useEffect(() => {
    if (dataUserManagement) {
      const { data: mainData } = dataUserManagement.data;
      const { data: dataListTable, meta } = mainData;

      setDataListUser(
        dataListTable?.map((item: DataPureMyprofileType) => ({
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
  }, [dataUserManagement]);

  const resetIsShowDelete = () => {
    setIsShowDelete({
      open: false,
      data: null,
      type: "",
    });
  };

  const onSubmitFilter = () => {
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
            data?.data?.find((el: any) => el.key === data?.selectedRowKeys[0])?.email
          } ?`;
    } else {
      return `Are you sure to delete document ${data?.email} ?`;
    }
  };

  const { mutate: deleteUserManagement, isPending: isPendingDeleteUserManagement }: any =
    useDeleteBulkUserManagement({
      options: {
        onSuccess: (res: any) => {
          if (res?.status === 200) {
            refetchDocumentUserManagement();
            resetIsShowDelete();
            setSelectedRowKeys([]);
          }
        },
      },
    });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button
            type="button"
            onClick={() => router.push("/user-management/add")}
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
                data: { data: dataListUser, selectedRowKeys },
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
            dataSource={dataListUser}
            scroll={{ x: 1500 }}
            loading={isPendingUserManagement || isPendingRole || isPendingUserTag}
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
                  options={dataUserTag}
                  tokenSeparators={[","]}
                  value={value}
                  styleSelect={{ width: "100%" }}
                  error={error}
                  label="Tags"
                  classNameLabel="block text-lg font-semibold text-black"
                  notFoundContent={isPendingUserTag ? <Spin size="small" /> : null}
                  filterOption={false}
                  onBlur={() => {
                    setSearchSearchUserTag("");
                  }}
                  onSearch={(val: string) => setSearchSearchUserTag(val)}
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
                  mode="multiple"
                  tokenSeparators={[","]}
                  name="filter_type"
                  options={dataRole}
                  onChange={onChange}
                  value={value}
                  styleSelect={{ width: "100%" }}
                  label="Role"
                  classNameLabel="block text-lg font-semibold text-black"
                  onBlur={() => {
                    setSearchRole("");
                  }}
                  onSearch={(val: string) => setSearchRole(val)}
                  notFoundContent={isPendingRole ? <Spin size="small" /> : null}
                  filterOption={false}
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
