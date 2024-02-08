"use client";
import { DeleteModal } from "@/app/documents/page";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Text from "@/components/Text";
import UseDateTimeFormat from "@/hook/useDateFormat";
import {
  useDeleteUserManagement,
  useUpdateUserManagement,
  useUserManagementById,
} from "@/services/user-management/useUserManagement";
import { BackIcon, PencilIcon, TrashIcon } from "@/style/icon";
import { FileType, beforeUpload, getBase64 } from "@/utils/imageUpload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { ConfigProvider, Modal, Spin, Table, TableProps, Upload, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DataUserManagementType } from "../page";
import { DefaultOptionType } from "antd/es/cascader";
import { useDocumentTags } from "@/services/document-tags/useDocumentTags";
import { useRole } from "@/services/role/useRole";
import { UploadChangeParam, UploadFile } from "antd/es/upload";

type FormProfileValues = {
  avatar_path: string;
  first_name: string;
  last_name: string;
  tags: string[];
  role_id: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

interface role_idType {
  createdAt: string;
  id: number;
  levelName: string;
  updatedAt: string;
}

interface TagType {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface DataType {
  key: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export default function ViewEditProfile({ params }: { params: { id: string } }) {
  const { id } = params;

  const [messageApi, contextHolder] = message.useMessage();

  const [dataRole, setDatarole] = useState<DefaultOptionType[]>([]);
  const [dataTag, setDataTag] = useState<DefaultOptionType[]>([]);

  const router = useRouter();
  const [avatarPathRaw, setAvatarPathRaw] = useState<UploadChangeParam<UploadFile<any>>>();
  const [isEdit, setIsEdit] = useState<boolean>(id[0] === "view" ? false : true);
  const [loadingImageAvatar, setLoadingImageAvatar] = useState<boolean>(false);

  const [isShowDelete, setShowDelete] = useState<DeleteModal>({
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

  const { data: dataListrole_id, isPending: isPendingrole_id } = useRole();
  const { data: dataListTag, isPending: isPendingTag } = useDocumentTags();

  useEffect(() => {
    const fetchDatarole = () => {
      setDatarole(
        dataListrole_id.data.data.map((itemrole_id: role_idType) => ({
          label: itemrole_id.levelName,
          value: itemrole_id.id,
        }))
      );
    };

    const fetchDataTag = () => {
      setDataTag(
        dataListTag.data.data.data.map((itemTag: TagType) => ({
          label: itemTag.name,
          value: itemTag.id,
        }))
      );
    };

    if (dataListrole_id) {
      fetchDatarole();
    }

    if (dataListTag) {
      fetchDataTag();
    }
  }, [dataListrole_id, dataListTag]);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text: string) => {
        return (
          <div className="gap-2 flex items-center">
            <ImageNext
              src="/placeholder-profile.png"
              width={32}
              height={32}
              alt="logo-klikyou"
              className="h-[32px] w-[32px]"
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
      render: (text: Date) => UseDateTimeFormat(text),
    },
    {
      title: "Updated By",
      dataIndex: "updatedBy",
      key: "updatedBy",
      render: (text: string) => {
        return (
          <div className="gap-2 flex items-center">
            <ImageNext
              src="/placeholder-profile.png"
              width={32}
              height={32}
              alt="logo-klikyou"
              className="h-[32px] w-[32px]"
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
      render: (text: Date) => UseDateTimeFormat(text),
    },
  ];

  const data: DataType[] = [
    {
      key: "1",
      createdBy: "Zayn Malik",
      createdAt: new Date(),
      updatedBy: "Edward Timothy",
      updatedAt: new Date(),
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
  });

  useEffect(() => {
    if (dataUserManagement) {
      setValue("avatar_path", dataUserManagement?.data?.avatarPath);
      setValue("first_name", dataUserManagement?.data?.firstName);
      setValue("last_name", dataUserManagement?.data?.lastName);
      setValue("tags", dataUserManagement?.data?.tags);
      setValue("role_id", dataUserManagement?.data?.roleId);
      setValue("username", dataUserManagement?.data?.username);
    }
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
        return `Are you sure to delete document ${data?.name} ?`;
      default:
        break;
    }
  };

  const isLoading = isPendingUserManagement || isPendingrole_id || isPendingTag;

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

        <Button
          type="button"
          onClick={() =>
            setShowDelete({
              open: true,
              type: "single",
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
                            name="avatar_path"
                            listType="picture-circle"
                            showUploadList={false}
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
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
                                width={180}
                                height={180}
                                alt="logo-klikyou"
                                className="h-auto w-auto"
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
                      width={180}
                      height={180}
                      alt="logo-klikyou"
                      className="h-auto w-auto"
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
                            mode="tags"
                            name="tags"
                            onChange={onChange}
                            tokenSeparators={[","]}
                            value={value}
                            options={dataTag}
                            styleSelect={{ width: "100%" }}
                            required
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
                          required: "role_id is required",
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
                            label="role_id"
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

                        return (
                          <div className="mb-6" key={mapping}>
                            <Text
                              label={labelMap[mapping]}
                              className="text-lg font-semibold text-black"
                            />
                            {mapping === "tags" ? (
                              <div className="flex gap-2 flex-wrap mt-2">
                                {valueMap[mapping].map((item: string) => (
                                  <Text
                                    key={item}
                                    label={item}
                                    className="text-sm font-normal text-white rounded-full py-2 px-4 bg-[#455C72]"
                                  />
                                ))}
                              </div>
                            ) : mapping === "role_id" ? (
                              <Text
                                label={dataRole?.[valueMap[mapping]]?.label as string}
                                className="text-base font-normal text-black"
                              />
                            ) : (
                              <Text
                                label={valueMap[mapping]}
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
                        rules={{
                          required: "Password is required",
                        }}
                        name="password"
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <Input
                            onChange={onChange}
                            error={error}
                            onBlur={onBlur}
                            value={value}
                            name="password"
                            type="password"
                            required
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
                          required: "Confirm password is required",
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
                            required
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
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey={(record) => record.key}
              />
            </ConfigProvider>
          </div>
        </div>
      )}

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
