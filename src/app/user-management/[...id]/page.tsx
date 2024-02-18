"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Text from "@/components/Text";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import { RoleType } from "@/interface/common";
import { FormProfileValues } from "@/interface/my-profile.interface";
import {
  ColumnsType,
  DataInfoUserManagementType,
  DeleteUserManagementModal,
} from "@/interface/user-management.interface";
import { DataUserTags } from "@/interface/user-tag.interface";
import { useRole } from "@/services/role/useRole";
import {
  useDeleteUserManagement,
  useUpdateUserManagement,
  useUserManagementById,
} from "@/services/user-management/useUserManagement";
import { useUserTags } from "@/services/user-tags/useUserTags";
import { BackIcon, PencilIcon, TrashIcon } from "@/style/icon";
import { FileType, beforeUpload, getBase64 } from "@/utils/imageUpload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { ConfigProvider, Modal, Spin, Table, Upload, message } from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ViewEditProfile({ params }: { params: { id: string } }) {
  const { id } = params;

  const [messageApi, contextHolder] = message.useMessage();

  const [dataRole, setDataRole] = useState<DefaultOptionType[]>([]);
  const [dataInfo, setDataInfo] = useState<DataInfoUserManagementType[]>([]);
  const [dataUserTag, setDataUserTag] = useState<DefaultOptionType[]>([]);

  const router = useRouter();
  const [avatarPathRaw, setAvatarPathRaw] = useState<UploadChangeParam<UploadFile<any>>>();
  const [isEdit, setIsEdit] = useState<boolean>(id[0] === "view" ? false : true);
  const [loadingImageAvatar, setLoadingImageAvatar] = useState<boolean>(false);

  const [isShowDelete, setIsShowDelete] = useState<DeleteUserManagementModal>({
    open: false,
    type: "selection",
    data: {
      data: null,
      selectedRowKeys: [],
    },
  });

  const { watch, control, handleSubmit, getValues, setValue } = useForm<FormProfileValues>({
    defaultValues: {
      avatar_path: "/placeholder-profile.png",
      first_name: "",
      last_name: "",
      tags: [],
      role_id: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { data: dataListRole, isPending: isPendingrole } = useRole();
  const { data: dataListUserTag, isPending: isPendingUserTag } = useUserTags();

  useEffect(() => {
    const fetchDatarole = () => {
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
      fetchDatarole();
    }

    if (dataListUserTag) {
      fetchDataUserTag();
    }
  }, [dataListRole, dataListUserTag]);

  const columnsDataInfo: ColumnsType<DataInfoUserManagementType> = [
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text: string, record: DataInfoUserManagementType) => {
        return (
          <div className="gap-2 flex items-center">
            <ImageNext
              src={record.createdByAvatarPath || "/placeholder-profile.png"}
              width={32}
              priority
              height={32}
              alt="logo-klikyou"
              className="h-[32px] w-[32px] rounded-full"
            />
            <Text label={text} className="text-base font-normal text-black" />
          </div>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: Date) => UseConvertDateFormat(text),
    },
    {
      title: "Updated By",
      dataIndex: "updatedBy",
      key: "updatedBy",
      render: (text: string, record: DataInfoUserManagementType) => {
        return (
          <div className="gap-2 flex items-center">
            <ImageNext
              src={record.updatedByAvatarPath || "/placeholder-profile.png"}
              width={32}
              priority
              height={32}
              alt="logo-klikyou"
              className="h-[32px] w-[32px] rounded-full"
            />
            <Text label={text} className="text-base font-normal text-black" />
          </div>
        );
      },
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text: Date) => UseConvertDateFormat(text),
    },
  ];

  const { mutate: updateUserManagement, isPending: isPendingUpdateUserManagement } =
    useUpdateUserManagement({
      id: id[1],
      options: {
        onSuccess: () => {
          messageApi.open({
            type: "success",
            content: "Update document success",
          });
          router.back();
        },
      },
    });

  const onSubmit = (data: FormProfileValues) => {
    delete data.confirmPassword;

    const { username, email, password, first_name, last_name, tags, role_id } = data;

    let formdata = new FormData();

    formdata.append("username", username);
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("first_name", first_name);
    formdata.append("last_name", last_name);
    formdata.append("tags", JSON.stringify(tags));
    formdata.append("role_id", JSON.stringify(role_id));
    formdata.append("avatar_path", avatarPathRaw?.file.originFileObj as any);

    updateUserManagement(formdata);
  };

  const { data: dataUserManagement, isPending: isPendingUserManagement } = useUserManagementById({
    id: id[1],
    options: {
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (dataUserManagement) {
      const { data: mainData } = dataUserManagement;
      const { data: rawData } = mainData;

      const {
        avatarPath,
        firstName,
        lastName,
        tags,
        role,
        username,
        email,
        createBy,
        updatedBy,
        id,
      } = rawData;

      setDataInfo([
        {
          createdBy: createBy?.user?.username,
          createdAt: createBy?.user?.createdAt,
          updatedBy: updatedBy?.user?.username,
          updatedAt: updatedBy?.user?.updatedAt,
          id: id,
          createdByAvatarPath: createBy?.user?.avatarPath,
          updatedByAvatarPath: updatedBy?.user?.avatarPath,
        },
      ]);

      setValue("avatar_path", avatarPath);
      setValue("first_name", firstName);
      setValue("last_name", lastName);
      setValue("tags", JSON.parse(tags));
      setValue("role_id", role.id);
      setValue("username", username);
      setValue("email", email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUserManagement]);

  const uploadButton = (
    <button className="border border-0 bg-none" type="button">
      {loadingImageAvatar ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="mt-2">Upload</div>
    </button>
  );

  const { mutate: deleteUserManagement, isPending: isPendingDeleteUserManagement }: any =
    useDeleteUserManagement({
      options: {
        onSuccess: () => {
          messageApi.open({
            type: "success",
            content: "Delete document success",
            duration: 1,
            onClose: () => router.back(),
          });
        },
      },
    });

  const renderConfirmationText = (type: any, data: any) => {
    switch (type) {
      case "single":
        return `Are you sure to delete document ${data?.data?.data?.email} ?`;
      default:
        break;
    }
  };

  const isLoading = isPendingUserManagement || isPendingrole || isPendingUserTag;

  return (
    <div className="p-6">
      {contextHolder}
      {isLoading && <Spin fullscreen />}

      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <BackIcon
            style={{ color: "#2379AA", height: 24, width: 24 }}
            onClick={() => router.back()}
          />
          <Text
            label={isEdit ? "Edit user" : "User detail"}
            className="text-2xl font-normal text-secondary-blue"
          />
        </div>

        {!isEdit && (
          <Button
            type="button"
            onClick={() =>
              setIsShowDelete({
                open: true,
                type: "single",
                data: dataUserManagement,
              })
            }
            label="Delete"
            icon={
              <TrashIcon
                style={{
                  color: "#F44550",
                }}
              />
            }
            className="flex border justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-red border-red"
          />
        )}
      </div>

      {!isEdit && (
        <Button
          type="button"
          onClick={() => setIsEdit(!isEdit)}
          label="Edit"
          icon={<PencilIcon />}
          className="mt-6 gap-2 flex justify-center items-center rounded-md bg-primary-blue px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      )}

      <div className="gap-6 flex">
        <div className="w-1/2">
          <Text label="User info" className="mt-6 text-xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex">
              <div className="w-1/2">
                <Text label="Profile photo" className="text-lg font-semibold text-black" />

                <div className="flex justify-center mt-6">
                  {isEdit ? (
                    <Controller
                      control={control}
                      name="avatar_path"
                      render={({ field: { onChange, value } }) => (
                        <div>
                          <Upload
                            multiple={false}
                            maxCount={1}
                            name="avatar_path"
                            listType="picture-circle"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={(info) => {
                              setAvatarPathRaw(info);

                              if (info.file.status === "uploading") {
                                setLoadingImageAvatar(true);
                                return;
                              }
                              if (info.file.status === "done") {
                                // Get this url from response in real world.
                                getBase64(info.file.originFileObj as FileType, (url) => {
                                  setLoadingImageAvatar(false);
                                  onChange(url);
                                });
                              }
                            }}
                          >
                            {value ? (
                              <ImageNext
                                src={value}
                                width={100}
                                height={100}
                                alt="logo-klikyou"
                                className="h-[100px] w-[100px] rounded-full"
                              />
                            ) : (
                              uploadButton
                            )}
                          </Upload>
                        </div>
                      )}
                    />
                  ) : (
                    <ImageNext
                      src={getValues("avatar_path")}
                      width={100}
                      height={100}
                      alt="logo-klikyou"
                      className="h-[100px] w-[100px] rounded-full"
                    />
                  )}
                </div>
              </div>

              <div className="w-1/2">
                {isEdit ? (
                  <div>
                    <div className="mb-6">
                      <Controller
                        control={control}
                        rules={{
                          required: "First name is required",
                        }}
                        name="first_name"
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <Input
                            onChange={onChange}
                            error={error}
                            onBlur={onBlur}
                            value={value}
                            name="first_name"
                            type="text"
                            required
                            placeholder="Enter first name"
                            classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                            classNameLabel="block text-lg font-semibold text-black"
                            label="First Name"
                          />
                        )}
                      />
                    </div>

                    <div className="mb-6">
                      <Controller
                        control={control}
                        rules={{
                          required: "Last name is required",
                        }}
                        name="last_name"
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <Input
                            onChange={onChange}
                            error={error}
                            onBlur={onBlur}
                            value={value}
                            name="last_name"
                            type="text"
                            required
                            placeholder="Enter last name"
                            classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                            classNameLabel="block text-lg font-semibold text-black"
                            label="Last Name"
                          />
                        )}
                      />
                    </div>

                    <div className="mb-6">
                      <Controller
                        control={control}
                        rules={{
                          required: "tags is required",
                        }}
                        name="tags"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <Select
                            mode="multiple"
                            name="tags"
                            onChange={onChange}
                            tokenSeparators={[","]}
                            value={value}
                            options={dataUserTag}
                            styleSelect={{ width: "100%" }}
                            required
                            error={error}
                            label="Tags"
                            classNameLabel="block text-lg font-semibold text-black"
                          />
                        )}
                      />
                    </div>

                    <div className="mb-6">
                      <Controller
                        control={control}
                        rules={{
                          required: "Role is required",
                        }}
                        name="role_id"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <Select
                            name="role_id"
                            onChange={onChange}
                            options={dataRole}
                            value={value}
                            styleSelect={{ width: "100%" }}
                            required
                            label="Role"
                            classNameLabel="block text-lg font-semibold text-black"
                          />
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {Object.keys(watch())
                      .filter(
                        (filtering) =>
                          ![
                            "avatar_path",
                            "username",
                            "email",
                            "confirmPassword",
                            "password",
                          ].includes(filtering)
                      )
                      .map((mapping) => {
                        const labelMap: any = {
                          first_name: "First name",
                          last_name: "Last name",
                          tags: "Tags",
                          role_id: "Role",
                        };

                        const valueMap: any = watch();
                        console.log("@dataUserManagement", dataUserManagement);

                        return (
                          <div className="mb-6" key={mapping}>
                            <Text
                              label={labelMap[mapping]}
                              className="text-lg font-semibold text-black"
                            />
                            {mapping === "tags" ? (
                              <div className="flex gap-2 flex-wrap mt-2">
                                {dataUserTag
                                  ?.filter((filteringTag: DefaultOptionType) =>
                                    valueMap[mapping]?.includes(filteringTag.value)
                                  )
                                  .map((item: DefaultOptionType) => (
                                    <Text
                                      key={String(item.label)}
                                      label={String(item.label)}
                                      className="text-base font-normal text-white rounded-full py-2 px-4 bg-gray-dark"
                                    />
                                  ))}
                              </div>
                            ) : (
                              <Text
                                label={
                                  mapping === "role_id"
                                    ? dataUserManagement?.data?.data?.role?.levelName
                                    : valueMap[mapping]
                                }
                                className="text-sm font-normal text-black"
                              />
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <Text label="Account info" className="mt-6 text-xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex">
              <div className="w-1/2 px-2">
                {isEdit ? (
                  <div>
                    <div>
                      <Controller
                        control={control}
                        name="username"
                        rules={{
                          required: "Username is required",
                        }}
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <Input
                            onChange={onChange}
                            error={error}
                            onBlur={onBlur}
                            value={value}
                            name="username"
                            type="text"
                            placeholder="Enter username"
                            classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                            classNameLabel="block text-xl font-semibold text-black"
                            label="username"
                          />
                        )}
                      />
                    </div>

                    <div className="mt-6">
                      <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <Input
                            onChange={onChange}
                            error={error}
                            onBlur={onBlur}
                            value={value}
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                            classNameLabel="block text-lg font-semibold text-black"
                            label="Password"
                          />
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {" "}
                    <Text label="Username " className="text-lg font-semibold text-black" />
                    <Text
                      label={getValues("username")}
                      className="text-sm font-normal text-black"
                    />
                  </div>
                )}
              </div>

              <div className="w-1/2 px-2">
                {isEdit ? (
                  <div>
                    <div>
                      <Controller
                        control={control}
                        name="email"
                        rules={{
                          required: "Email is required",
                        }}
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <Input
                            onChange={onChange}
                            error={error}
                            onBlur={onBlur}
                            value={value}
                            required
                            name="email"
                            type="email"
                            placeholder="Enter email"
                            classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                            classNameLabel="block text-xl font-semibold text-black"
                            label="Email"
                          />
                        )}
                      />
                    </div>

                    <div className="mt-6">
                      <Controller
                        control={control}
                        rules={{
                          validate: (value) =>
                            value === control._formValues.password || "The passwords do not match",
                        }}
                        name="confirmPassword"
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <Input
                            onChange={onChange}
                            error={error}
                            onBlur={onBlur}
                            value={value}
                            name="confirmPassword"
                            type="password"
                            placeholder="Enter confirm password"
                            classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                            classNameLabel="block text-lg font-semibold text-black"
                            label="Re-type password"
                          />
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Text label="Email address" className="text-lg font-semibold text-black" />

                    <Text label={getValues("email")} className="text-sm font-normal text-black" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEdit ? (
        <div className="flex gap-4 items-center mt-6">
          <Button
            type="button"
            onClick={() => {
              if (id[0] === "edit") {
                router.back();
              } else {
                setIsEdit(false);
              }
            }}
            label="Cancel"
            className="flex border border-primary-blue justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-primary-blue shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />

          <Button
            type="button"
            loading={isPendingUpdateUserManagement}
            disabled={isPendingUpdateUserManagement}
            onClick={handleSubmit(onSubmit)}
            label="Save"
            className="flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-white shadow-sm bg-primary-blue hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />
        </div>
      ) : (
        <div>
          <Text label="Data info" className="mt-6 text-xl font-bold text-black" />

          <div className="p-2 bg-white rounded-md mt-6">
            <ConfigProvider
              theme={{
                components: {
                  Table: {
                    lineWidth: 0,
                    headerBg: "white",
                  },
                },
              }}
            >
              <Table
                columns={columnsDataInfo}
                dataSource={dataInfo}
                pagination={false}
                rowKey={(record) => record.id}
              />
            </ConfigProvider>
          </div>
        </div>
      )}

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
                  deleteUserManagement({
                    ids: [id],
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
