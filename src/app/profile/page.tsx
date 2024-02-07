"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Text from "@/components/Text";
import UseDateTimeFormat from "@/hook/useDateFormat";
import { useCreateProfile, useProfile, useUpdateProfile } from "@/services/profile/useProfile";
import { BackIcon, PencilIcon } from "@/style/icon";
import { FileType, beforeUpload, getBase64 } from "@/utils/imageUpload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { ConfigProvider, Spin, Table, TableProps, Upload } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DefaultOptionType } from "antd/es/cascader";
import { UploadChangeParam, UploadFile } from "antd/es/upload";

type FormProfileValues = {
  avatar_path: string;
  first_name: string;
  last_name: string;
  tags: string[];
  role_id: string[];
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

interface DataType {
  key: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

interface RoleType {
  createdAt: string;
  id: number;
  name: string;
  roleId: number;
  updatedAt: string;
}

export default function ProfilePage() {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [dataRole, setDataRole] = useState<DefaultOptionType[]>([]);
  const [dataTag, setDataTag] = useState<DefaultOptionType[]>([]);
  const [avatarPathRaw, setAvatarPathRaw] = useState<UploadChangeParam<UploadFile<any>>>();
  const [loadingImageAvatar, setLoadingImageAvatar] = useState<boolean>(false);

  const { watch, control, handleSubmit, setValue, getValues } = useForm<FormProfileValues>({
    defaultValues: {
      avatar_path: "",
      first_name: "",
      last_name: "",
      tags: [],
      role_id: [],
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { data: dataProfile, refetch: refetchProfile, isPending: isPendingProfile } = useProfile();

  useEffect(() => {
    if (dataProfile) {
      const { [0]: dataRaw } = dataProfile.data.data;

      const convertRole = dataRaw?.role?.modules.map((itemRole: RoleType) => ({
        label: itemRole.name,
        value: itemRole.id,
      }));

      const convertTag = JSON.parse(dataRaw?.tags).map((itemRole: string) => ({
        label: itemRole,
        value: itemRole,
      }));
      setDataRole(convertRole);
      setDataTag(convertTag);

      setValue("avatar_path", dataRaw?.avatarPath);
      setValue("first_name", dataRaw?.firstName);
      setValue("last_name", dataRaw?.lastName);
      setValue(
        "tags",
        convertTag.map((itemVal: DefaultOptionType) => itemVal.value)
      );
      setValue(
        "role_id",
        convertRole.map((itemVal: DefaultOptionType) => itemVal.value)
      );
      setValue("username", dataRaw?.username);
      setValue("email", dataRaw?.email);
      setValue("password", dataRaw?.password);
    }
  }, [dataProfile]);

  const { mutate: createUserManagement, isPending: isPendingCreateUserManagement } =
    useCreateProfile({
      options: {
        onSuccess: () => {
          refetchProfile();
        },
      },
    });

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

  const onSubmit = (data: FormProfileValues) => {
    delete data.confirmPassword;

    console.log(avatarPathRaw);

    let formdata = new FormData();
    formdata.append("username", "asdf");
    formdata.append("email", "asdfdsaff@gmail.com");
    formdata.append("password", "asdfdasfds");
    formdata.append("first_name", "asdfasdffds");
    formdata.append("last_name", "asdfasdffdsa");
    formdata.append("tags", '["ok","okgas","ok"]');
    formdata.append("role_id", "[]");

    createUserManagement(formdata);
  };

  const uploadButton = (
    <button className="border border-0 bg-none" type="button">
      {loadingImageAvatar ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="mt-2">Upload</div>
    </button>
  );

  return (
    <div className="p-6">
      {isPendingProfile && <Spin fullscreen />}
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
                      src={getValues("avatar_path") || "/placeholder-profile.png"}
                      width={180}
                      priority={true}
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
                        render={({ field: { onChange, value } }) => (
                          <Select
                            mode="tags"
                            name="tags"
                            onChange={onChange}
                            options={dataTag}
                            tokenSeparators={[","]}
                            value={value}
                            styleSelect={{ width: "100%" }}
                            required
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
                        render={({ field: { onChange, value } }) => {
                          return (
                            <Select
                              mode="tags"
                              name="role_id"
                              onChange={onChange}
                              options={dataRole}
                              tokenSeparators={[","]}
                              value={value}
                              styleSelect={{ width: "100%" }}
                              required
                              label="Role"
                              classNameLabel="block text-xl font-semibold text-black"
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
                      .map((mapping, index) => {
                        const labelMap: any = {
                          first_name: "First name",
                          last_name: "Last name",
                          tags: "Tags",
                          role_id: "Role",
                        };

                        const valueMap: any = watch();

                        return (
                          <div className="mb-6" key={mapping + index}>
                            <Text
                              label={labelMap[mapping]}
                              className="text-xl font-semibold text-black"
                            />
                            {mapping === "tags" ? (
                              <div className="flex gap-2 flex-wrap mt-2">
                                {valueMap[mapping]?.map((item: string, indexTag: number) => (
                                  <Text
                                    key={item + indexTag}
                                    label={item}
                                    className="text-base font-normal text-white rounded-full py-2 px-4 bg-[#455C72]"
                                  />
                                ))}
                              </div>
                            ) : mapping === "role_id" ? (
                              <div className="flex gap-2 flex-wrap mt-2">
                                {dataRole?.map((item: DefaultOptionType, indexRole: number) => {
                                  return (
                                    <Text
                                      key={indexRole}
                                      label={item.label as string}
                                      className="text-base font-normal text-white rounded-full py-2 px-4 bg-[#455C72]"
                                    />
                                  );
                                })}
                              </div>
                            ) : (
                              <Text
                                label={valueMap[mapping]}
                                className="text-base font-normal text-black"
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
                <Text label="Username" className="text-xl font-semibold text-black" />

                <Text label={getValues("username")} className="text-base font-normal text-black" />

                {isEdit && (
                  <div>
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
                )}
              </div>

              <div className="w-1/2 px-2">
                <Text label="Email address" className="text-xl font-semibold text-black" />

                <Text label={getValues("email")} className="text-base font-normal text-black" />

                {isEdit && (
                  <div>
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
            loading={isPendingCreateUserManagement}
            disabled={isPendingCreateUserManagement}
            label="Save"
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
