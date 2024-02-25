"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Text from "@/components/Text";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import useDebounce from "@/hook/useDebounce";
import { RoleType } from "@/interface/common";
import { DataDocumentTags } from "@/interface/documents-tag.interface";
import {
  DataMyProfileType,
  FormProfileValues,
  ResUpdateMyProfileType,
} from "@/interface/my-profile.interface";
import { useDocumentTags } from "@/services/document-tags/useDocumentTags";
import { useProfile, useUpdateProfile } from "@/services/profile/useProfile";
import { useRole } from "@/services/role/useRole";
import { BackIcon, PencilIcon } from "@/style/icon";
import { FileType, beforeUpload, getBase64 } from "@/utils/imageUpload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { ConfigProvider, Spin, Table, TableProps, Upload, message } from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ProfilePage() {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [dataRole, setDataRole] = useState<DefaultOptionType[]>([]);

  const [dataTag, setDataTag] = useState<DefaultOptionType[] | undefined>([]);

  const [searchRole, setSearchRole] = useState<string>("");
  const debounceSearchRole = useDebounce(searchRole, 800);

  const [avatarPathRaw, setAvatarPathRaw] = useState<UploadChangeParam<UploadFile<any>>>();
  const [loadingImageAvatar, setLoadingImageAvatar] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const { watch, control, handleSubmit, setValue, getValues } = useForm<FormProfileValues>({
    defaultValues: {
      avatar_path: "",
      first_name: "",
      last_name: "",
      tags: [],
      role_id: 0,
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    data: dataProfile,
    refetch: refetchProfile,
    isPending: isPendingProfile,
  } = useProfile({});

  const { data: dataListRole, isPending: isPendingRole } = useRole({
    query: {
      search: debounceSearchRole,
    },
  });

  const { data: dataListTag, isPending: isPendingTag } = useDocumentTags({});

  useEffect(() => {
    const fetchDataRole = () => {
      setDataRole(
        dataListRole.data.data.map((itemRole: RoleType) => ({
          label: itemRole.levelName,
          value: itemRole.id,
        }))
      );
    };

    const fetchDataTag = () => {
      setDataTag(
        dataListTag?.data.data.data.map((itemTag: DataDocumentTags) => ({
          label: itemTag.name,
          value: itemTag.id,
        }))
      );
    };

    if (dataListRole) {
      fetchDataRole();
    }

    if (dataListTag) {
      fetchDataTag();
    }
  }, [dataListRole, dataListTag]);

  useEffect(() => {
    if (dataProfile) {
      const { data: dataRaw } = dataProfile.data;

      setValue("avatar_path", dataRaw?.avatarPath);
      setValue("first_name", dataRaw?.firstName);
      setValue("last_name", dataRaw?.lastName);
      setValue("tags", dataRaw?.tags);
      setValue("role_id", dataRaw?.role.id);
      setValue("username", dataRaw?.username);
      setValue("email", dataRaw?.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProfile]);

  const { mutate: createUserManagement, isPending: isPendingCreateUserManagement } =
    useUpdateProfile({
      options: {
        onSuccess: (res: ResUpdateMyProfileType) => {
          if (res.status === 200) {
            messageApi.open({
              type: "success",
              content: "Success update profile",
            });

            refetchProfile();
          }
        },
      },
    });

  const columns: TableProps<DataMyProfileType>["columns"] = [
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
              className="h-[32px] w-[32px] rounded-full object-cover"
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
      render: (text: string) => {
        return (
          <div className="gap-2 flex items-center">
            <ImageNext
              src="/placeholder-profile.png"
              width={32}
              height={32}
              alt="logo-klikyou"
              className="h-[32px] w-[32px] rounded-full object-cover"
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

  const data: DataMyProfileType[] = [];

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

    createUserManagement(formdata);
  };

  const uploadButton = (
    <button className="border border-0 bg-none" type="button">
      {loadingImageAvatar ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="mt-2">Upload</div>
    </button>
  );

  const isLoading = isPendingRole || isPendingProfile || isPendingTag;

  return (
    <div className="p-6">
      {contextHolder}
      {isLoading && <Spin fullscreen />}
      <div className="flex gap-4 items-center">
        {isEdit && <BackIcon style={{ color: "#2379AA" }} onClick={() => setIsEdit(false)} />}
        <Text
          label={isEdit ? "Profile detail" : "Edit profile"}
          className="text-3xl font-normal text-secondary-blue"
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
          <Text label="User info" className="mt-6 text-2xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex">
              <div className="w-1/2">
                <Text label="Profile photo" className="text-xl font-semibold text-black" />

                <div className="flex justify-center mt-6">
                  {isEdit ? (
                    <Controller
                      control={control}
                      name="avatar_path"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <div>
                          <Upload
                            multiple={false}
                            maxCount={1}
                            name="avatar_path"
                            listType="picture-circle"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={(info) => {
                              setLoadingImageAvatar(true);
                              setAvatarPathRaw(info);
                              if (info.file.status === "uploading") {
                                console.log(info.file, info.fileList);
                              }
                              if (info.file.status === "done") {
                                message.success(`${info.file.name} file uploaded successfully`);

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
                                className="h-[100px] w-[100px] rounded-full object-cover"
                              />
                            ) : (
                              uploadButton
                            )}
                          </Upload>

                          {error && (
                            <Text
                              className="text-[#EB5757] font-roboto mt-2 font-bold text-sm"
                              label={String(error.message)}
                            />
                          )}
                        </div>
                      )}
                    />
                  ) : (
                    <ImageNext
                      src={getValues("avatar_path") || "/placeholder-profile.png"}
                      width={100}
                      priority={true}
                      height={100}
                      alt="logo-klikyou"
                      className="h-[100px] w-[100px] rounded-full object-cover"
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
                            classNameLabel="block text-xl font-semibold text-black"
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
                            classNameLabel="block text-xl font-semibold text-black"
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
                            options={dataTag}
                            tokenSeparators={[","]}
                            value={value}
                            styleSelect={{ width: "100%" }}
                            required
                            error={error}
                            label="Tags"
                            classNameLabel="block text-xl font-semibold text-black"
                          />
                        )}
                      />
                    </div>

                    <div className="mb-6">
                      <Controller
                        control={control}
                        rules={{
                          required: "role is required",
                        }}
                        name="role_id"
                        render={({ field: { onChange, value }, fieldState: { error } }) => {
                          return (
                            <Select
                              name="role_id"
                              onChange={onChange}
                              options={dataRole}
                              value={value}
                              styleSelect={{ width: "100%" }}
                              required
                              error={error}
                              label="Role"
                              classNameLabel="block text-xl font-semibold text-black"
                              onBlur={() => {
                                setSearchRole("");
                              }}
                              onSearch={(val: string) => setSearchRole(val)}
                              notFoundContent={isPendingRole ? <Spin size="small" /> : null}
                              filterOption={false}
                            />
                          );
                        }}
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
                          <div className="mb-6" key={labelMap[mapping]}>
                            <Text
                              label={labelMap[mapping]}
                              className="text-xl font-semibold text-black"
                            />

                            {mapping === "tags" ? (
                              <div className="flex gap-2 flex-wrap mt-2">
                                {valueMap[mapping]?.map((item: string) => (
                                  <Text
                                    key={item}
                                    label={item}
                                    className="text-base font-normal text-white rounded-full py-2 px-4 bg-gray-dark"
                                  />
                                ))}
                              </div>
                            ) : (
                              <Text
                                label={
                                  mapping === "role_id"
                                    ? dataProfile?.data?.data?.role?.levelName
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
          <Text label="Account info" className="mt-6 text-2xl font-bold text-black" />

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
                            classNameLabel="block text-xl font-semibold text-black"
                            label="Password"
                          />
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Text label="Username" className="text-xl font-semibold text-black" />

                    <Text
                      label={getValues("username")}
                      className="text-base font-normal text-black"
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
                        // rules={{
                        //   validate: (value) =>
                        //     value === control._formValues.password || "The passwords do not match",
                        // }}
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
                            classNameLabel="block text-xl font-semibold text-black"
                            label="Re-type password"
                          />
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Text label="Email address" className="text-xl font-semibold text-black" />

                    <Text label={getValues("email")} className="text-base font-normal text-black" />
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
              setIsEdit(false);
            }}
            label="Cancel"
            className="flex border border-primary-blue justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-primary-blue shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            loading={isPendingCreateUserManagement || loadingImageAvatar}
            disabled={isPendingCreateUserManagement || loadingImageAvatar}
            label={isPendingCreateUserManagement || loadingImageAvatar ? "Loading..." : "Save"}
            className="flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-white shadow-sm bg-primary-blue hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />
        </div>
      ) : (
        <div>
          <Text label="Data info" className="mt-6 text-2xl font-bold text-black" />

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
    </div>
  );
}
