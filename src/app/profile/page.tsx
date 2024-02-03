"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Text from "@/components/Text";
import UseDateTimeFormat from "@/hook/useDateFormat";
import { PencilIcon, BackIcon } from "@/style/icon";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Table, TableProps, ConfigProvider, Upload, UploadProps } from "antd";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FileType, beforeUpload, getBase64 } from "@/utils/imageUpload";

type FormProfileValues = {
  imgProfile: string;
  firstName: string;
  lastName: string;
  tags: string[];
  role: string[];
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface DataType {
  key: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export default function ProfilePage() {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loadingImageAvatar, setLoadingImageAvatar] = useState<boolean>(false);

  const { watch, control, handleSubmit, setValue, getValues } = useForm<FormProfileValues>({
    defaultValues: {
      imgProfile: "/placeholder-profile.png",
      firstName: "",
      lastName: "",
      tags: ["Text1", "Text2", "Text3"],
      role: ["Text1", "Text2", "Text3"],
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
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
    console.log(data);
  };

  const uploadButton = (
    <button className="border border-0 bg-none" type="button">
      {loadingImageAvatar ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="mt-2">Upload</div>
    </button>
  );

  return (
    <div className="p-6">
      <div className="flex gap-4 items-center">
        {isEdit && <BackIcon style={{ color: "#2379AA" }} onClick={() => setIsEdit(false)} />}
        <Text
          label={isEdit ? "Profile detail" : "Edit profile"}
          className="text-3xl font-normal text-secondary-blue"
        />
      </div>

      <Button
        type="button"
        onClick={() => setIsEdit(!isEdit)}
        label="Edit"
        icon={<PencilIcon />}
        className="mt-6 flex justify-center items-center rounded-md bg-primary-blue px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      />

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
                      name="imgProfile"
                      render={({ field: { onChange, value } }) => (
                        <div>
                          <Upload
                            name="imgProfile"
                            listType="picture-circle"
                            showUploadList={false}
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            beforeUpload={beforeUpload}
                            onChange={(info) => {
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
                      src={getValues("imgProfile")}
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
                        name="firstName"
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <Input
                            onChange={onChange}
                            error={error}
                            onBlur={onBlur}
                            value={value}
                            name="firstName"
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
                        name="lastName"
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <Input
                            onChange={onChange}
                            error={error}
                            onBlur={onBlur}
                            value={value}
                            name="lastName"
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
                        name="role"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <Select
                            mode="tags"
                            name="role"
                            onChange={onChange}
                            tokenSeparators={[","]}
                            value={value}
                            styleSelect={{ width: "100%" }}
                            required
                            label="Role"
                            classNameLabel="block text-xl font-semibold text-black"
                          />
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {Object.keys(watch())
                      .filter(
                        (filtering) => !["imgProfile", "username", "email"].includes(filtering)
                      )
                      .map((mapping) => {
                        const labelMap: any = {
                          firstName: "First name",
                          lastName: "Last name",
                          tags: "Tags",
                          role: "Role",
                        };

                        const valueMap: any = watch();

                        return (
                          <div className="mb-6" key={mapping}>
                            <Text
                              label={labelMap[mapping]}
                              className="text-xl font-semibold text-black"
                            />
                            {mapping === "tags" || mapping === "role" ? (
                              <div className="flex gap-2 flex-warp mt-2">
                                {valueMap[mapping].map((item: string) => (
                                  <Text
                                    key={item}
                                    label={item}
                                    className="text-base font-normal text-white rounded-full py-2 px-4 bg-[#455C72]"
                                  />
                                ))}
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
                <Text label="Username " className="text-xl font-semibold text-black" />

                <Text label="superadmin" className="text-base font-normal text-black" />

                {isEdit && (
                  <div>
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

                <Text
                  label="superadmin@goforward.com"
                  className="text-base font-normal text-black"
                />

                {isEdit && (
                  <div>
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
