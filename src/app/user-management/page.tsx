"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import Text from "@/components/Text";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import useDebounce from "@/hook/useDebounce";
import { TableParams } from "@/interface/Table";
import {
  useDeleteBulkUserManagement,
  useDeleteUserManagement,
  useUserManagement,
} from "@/services/user-management/useUserManagement";
import { FilterIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon } from "@/style/icon";
import { Checkbox, ConfigProvider, DatePicker, Modal, Table, TableProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export interface OptionInterface {
  label: string;
  value: string;
}

interface ModuleRoleType {
  id: number;
  roleId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface RoleResType {
  id: number;
  levelName: string;
  createdAt: string;
  updatedAt: string;
  modules: ModuleRoleType[];
}

export interface DataUserManagementType {
  id: string;
  name: string;
  email: string;
  level: string;
  firstName: string;
  username: string;
  roleId: number;
  lastName: string;
  role: RoleResType;
  tags: string;
  avatarPath: string;
  updateAt: Date;
}

type FormFilterValues = {
  search: string;
  date: string;
  status: string[];
  role: string[];
};

interface DeleteModal {
  open: boolean;
  type: string;
  data: { data: DataUserManagementType[] | null; selectedRowKeys: Key[] } | null;
}

export default function UserManagementPage() {
  const router = useRouter();
  const [isShowModalFilter, setIsShowModalFilter] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isShowDelete, setShowDelete] = useState<DeleteModal>({
    open: false,
    type: "selection",
    data: {
      data: null,
      selectedRowKeys: [],
    },
  });
  const [dataListUser, setDataListUser] = useState<DataUserManagementType[]>([]);

  const [tableParams, setTableParams] = useState<TableParams>({
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

  const columns: TableProps<DataUserManagementType>["columns"] = [
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
      render: (text: string, record: DataUserManagementType) => {
        const { avatarPath, firstName, lastName, id } = record;
        return (
          <div className="gap-2 flex items-center">
            <ImageNext
              src={avatarPath || "/placeholder-profile.png"}
              priority
              width={32}
              height={32}
              alt="logo-klikyou"
              className="h-[32px] w-[32px] rounded-full"
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
      render: (text: string) => {
        return <Text label={text} className="text-base font-normal text-black" />;
      },
    },
    {
      title: "Level",
      dataIndex: "role",
      key: "role",
      render: (text: RoleResType) => {
        return <Text label={text.levelName} className="text-base font-normal text-black" />;
      },
    },
    {
      title: "Update At",
      dataIndex: "updatedAt",
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

  const handleTableChange: TableProps["onChange"] = (pagination, filters, sorter) => {
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
      date: getValuesFilter("date"),
      status: getValuesFilter("status").join(","),
      role: getValuesFilter("role").join(","),
      page: tableParams.pagination?.current,
      limit: tableParams.pagination?.pageSize,
    },
  });

  useEffect(() => {
    if (dataUserManagement) {
      const { data: mainData } = dataUserManagement.data;
      const { data: dataListTable, meta } = mainData;

      setDataListUser(
        dataListTable.map((item: DataUserManagementType) => ({
          ...item,
          key: item.id,
        }))
      );

      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: meta.total,
        },
      });
    }
  }, [dataUserManagement]);

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

  const resetShowDelete = () => {
    setShowDelete({
      open: false,
      data: null,
      type: "",
    });
  };

  const onSubmitFilter = (data: FormFilterValues) => {
    refetchDocumentUserManagement();
    setIsShowModalFilter(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const renderConfirmationText = (type: any, data: any) => {
    switch (type) {
      case "selection":
        return data.selectedRowKeys.length > 1
          ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
          : `Are you sure to delete document ${
              data?.data?.find((el: any) => el.key === data?.selectedRowKeys[0])?.email
            } ?`;
      default:
        return `Are you sure to delete document ${data?.name} ?`;
    }
  };

  const { mutate: deleteUserManagement, isPending: isPendingDeleteUserManagement }: any =
    useDeleteBulkUserManagement({
      options: {
        onSuccess: () => {
          refetchDocumentUserManagement();
          resetShowDelete();
          setSelectedRowKeys([]);
        },
      },
    });

  useEffect(() => {
    refetchDocumentUserManagement();
  }, [JSON.stringify(tableParams)]);

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
              setShowDelete({
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
            loading={isPendingUserManagement}
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

      <Modal
        title="Confirm Delete"
        open={isShowDelete.open}
        onCancel={() => {
          setShowDelete({
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
                  setShowDelete({
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
