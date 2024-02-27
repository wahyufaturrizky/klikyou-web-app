"use client";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Text from "@/components/Text";
import { FormValueInternalPageType } from "@/interface/internal-page.interface";
import { useInternalPage, useUpdateInternalPage } from "@/services/internal-page/useInternalPage";
import { Alert, GetProps, Spin, Tree, TreeDataNode, message } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

const treeData: TreeDataNode[] = [
  {
    title: "Documents",
    key: "0-0",
  },
  {
    title: "Approvals",
    key: "0-1",
    children: [
      { title: "To Review", key: "0-1-0", isLeaf: true },
      { title: "History", key: "0-1-1", isLeaf: true },
    ],
  },
  {
    title: "Received",
    key: "0-2",
    children: [
      { title: "To Do", key: "0-2-0", isLeaf: true },
      { title: "Processed", key: "0-2-1", isLeaf: true },
    ],
  },
  {
    title: "Master",
    key: "0-3",
    children: [
      { title: "Document tags", key: "0-3-0", isLeaf: true },
      { title: "User tags", key: "0-3-1", isLeaf: true },
    ],
  },
  {
    title: "Settings",
    key: "0-4",
  },
];

export default function InternalPage() {
  const [messageApi, contextHolder] = message.useMessage();

  const { control, handleSubmit, setValue } = useForm<FormValueInternalPageType>({
    defaultValues: {
      status: "Active",
    },
  });

  const {
    data: dataInternalPage,
    refetch: refetchInternalPage,
    isPending: isPendingInternalPage,
  } = useInternalPage({});

  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };

  const onExpand: DirectoryTreeProps["onExpand"] = (keys, info) => {
    console.log("Trigger Expand", keys, info);
  };

  const { mutate: updateInternalPage, isPending: isPendingUpdateInternalPage } =
    useUpdateInternalPage({
      options: {
        onSuccess: (res: any) => {
          if (res?.status) {
            refetchInternalPage();

            messageApi.open({
              type: "success",
              content: "Success update internal page",
            });
          }
        },
      },
    });

  const onSubmit = (data: FormValueInternalPageType) => {
    updateInternalPage({
      status: data.status === "Active" ? true : false,
    });
  };

  useEffect(() => {
    if (dataInternalPage) {
      const { data } = dataInternalPage.data;

      localStorage.setItem("viewOnly", JSON.stringify(data.status));

      setValue("status", data.status ? "Active" : "Inactive");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataInternalPage]);

  const optionInternalPage = [
    {
      label: "Active",
      value: "Active",
    },
    {
      label: "Inactive",
      value: "Inactive",
    },
  ];

  return (
    <div className="p-6">
      {contextHolder}
      {isPendingInternalPage && <Spin fullscreen />}
      <div className="flex gap-4 items-center">
        <Text
          label="Change internal setting"
          className="text-3xl font-normal text-secondary-blue"
        />
      </div>

      <div className="gap-6 flex">
        <div className="w-1/2">
          <Text label="Access & features settings" className="mt-6 text-2xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="mb-6">
              <Alert
                message="Note: This settings will only affect non Superadmin user (Company Admin and Admin)"
                type="warning"
                showIcon
              />
            </div>

            <div className="mb-6">
              <Controller
                control={control}
                rules={{
                  required: "status is required",
                }}
                name="status"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    name="status"
                    options={optionInternalPage}
                    onChange={onChange}
                    value={value}
                    error={error}
                    styleSelect={{ width: "100%" }}
                    label="Create, update, and delete data"
                    classNameLabel="block text-lg font-semibold text-black"
                  />
                )}
              />
            </div>

            <Text label="Note: The affected menus are:" className="text-black" />

            <DirectoryTree
              multiple
              defaultExpandAll
              onSelect={onSelect}
              onExpand={onExpand}
              treeData={treeData}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center mt-6">
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          label={isPendingUpdateInternalPage ? "Loading..." : "Update"}
          disabled={isPendingUpdateInternalPage}
          loading={isPendingUpdateInternalPage}
          className="flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-white shadow-sm bg-primary-blue hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      </div>
    </div>
  );
}
