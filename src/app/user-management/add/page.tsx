"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Text from "@/components/Text";
import { RoleType } from "@/interface/common";
import { DataUserTags } from "@/interface/user-tag.interface";
import { useRole } from "@/services/role/useRole";
import { useCreateUserManagement } from "@/services/user-management/useUserManagement";
import { useUserTags } from "@/services/user-tags/useUserTags";
import { BackIcon } from "@/style/icon";
import { FileType, beforeUpload, getBase64 } from "@/utils/imageUpload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Spin, Upload, message } from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useDebounce from "@/hook/useDebounce";
import { FormProfileValues } from "@/interface/my-profile.interface";

// Author, Software Architect, Software Engineer, Software Developer : https://www.linkedin.com/in/wahyu-fatur-rizky

export default function AddProfilePage() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [avatarPathRaw, setAvatarPathRaw] = useState<UploadChangeParam<UploadFile<any>>>();
  const [loadingImageAvatar, setLoadingImageAvatar] = useState<boolean>(false);
  const [dataRole, setDataRole] = useState<DefaultOptionType[]>([]);
  const [dataUserTag, setDataUserTag] = useState<DefaultOptionType[]>([]);

  const [searchUserTag, setSearchUserTag] = useState<string>("");
  const [searchRole, setSearchRole] = useState<string>("");

  const { control, handleSubmit } = useForm<FormProfileValues>({
    defaultValues: {
      avatar_path: "",
      first_name: "",
      last_name: "",
      tags: [],
      role_id: undefined,
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const debounceSearchUserTag = useDebounce(searchUserTag, 800);
  const debounceSearchRole = useDebounce(searchRole, 800);

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

  const { mutate: createUserManagement, isPending: isPendingCreateUserManagement } =
    useCreateUserManagement({
      options: {
        onSuccess: (res: any) => {
          if (res.status === 200) {
            messageApi.open({
              type: "success",
              content: "Success create user",
            });

            router.back();
          }
        },
        onError: () => {
          messageApi.open({
            type: "error",
            content: "Failed create user",
          });
        },
      },
    });

  const onSubmit = (data: FormProfileValues) => {
    delete data.confirmPassword;

    const { username, email, password, first_name, last_name, tags, role_id } = data;

    const formdata = new FormData();
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

  return (
    <div className="p-6">
      {contextHolder}
      <div className="flex gap-4 items-center">
        <BackIcon
          style={{ color: "#2379AA", height: 24, width: 24 }}
          onClick={() => router.back()}
        />
        <Text label="Add user" className="text-2xl font-normal text-secondary-blue" />
      </div>

      <div className="gap-6 flex">
        <div className="w-1/2">
          <Text label="User info asd" className="mt-6 text-xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex">
              <div className="w-1/2">
                <Text label="Profile photo" className="text-lg font-semibold text-black" />

                <div className="flex justify-center mt-6">
                  <Controller
                    control={control}
                    name="avatar_path"
                    rules={{
                      required: "Avatar is required",
                    }}
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
                </div>
              </div>

              <div className="w-1/2">
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
                          options={dataUserTag}
                          tokenSeparators={[","]}
                          value={value}
                          styleSelect={{ width: "100%" }}
                          required
                          error={error}
                          label="Tags"
                          classNameLabel="block text-lg font-semibold text-black"
                          onBlur={() => {
                            setSearchUserTag("");
                          }}
                          onSearch={(val: string) => setSearchUserTag(val)}
                          notFoundContent={isPendingUserTag ? <Spin size="small" /> : null}
                          filterOption={false}
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
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select
                          name="role_id"
                          options={dataRole}
                          onChange={onChange}
                          value={value}
                          styleSelect={{ width: "100%" }}
                          required
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
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <Text label="Account info" className="mt-6 text-xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex">
              <div className="w-1/2 px-2">
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

                <div>
                  <div className="mt-6">
                    <Controller
                      control={control}
                      name="password"
                      rules={{
                        required: "Password is required",
                      }}
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          required
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
              </div>

              <div className="w-1/2 px-2">
                <div>
                  <Controller
                    control={control}
                    name="email"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
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
                          required
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center mt-6">
        <Button
          type="button"
          onClick={() => router.back()}
          label="Cancel"
          className="flex border border-primary-blue justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-primary-blue shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />

        <Button
          type="button"
          loading={isPendingCreateUserManagement || loadingImageAvatar}
          disabled={isPendingCreateUserManagement || loadingImageAvatar}
          onClick={handleSubmit(onSubmit)}
          label={isPendingCreateUserManagement || loadingImageAvatar ? "Loading..." : "Save"}
          className="flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-white shadow-sm bg-primary-blue hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      </div>
    </div>
  );
}
