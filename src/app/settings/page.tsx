"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import InputTextArea from "@/components/InputTextArea";
import Text from "@/components/Text";
import { useCreateSettings, useSettings } from "@/services/settings/useSettings";
import { FileType, beforeUpload, getBase64 } from "@/utils/imageUpload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Spin, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { FormSettingsValues } from "@/interface/settings.interface";

export default function SettingsPage() {
  const [loadingImageAvatar, setLoadingImageAvatar] = useState<boolean>(false);
  const [avatarPathRaw, setAvatarPathRaw] = useState<UploadChangeParam<UploadFile<any>>>();

  const [messageApi, contextHolder] = message.useMessage();

  const { control, handleSubmit, setValue } = useForm<FormSettingsValues>({
    defaultValues: {
      company_image_path: "/placeholder-profile.png",
      company_name: "",
      company_address: "",
      npwp: "",
      tel: "",
      email: "",
    },
  });

  const {
    data: dataSettings,
    refetch: refetchSettings,
    isPending: isPendingSettings,
  } = useSettings();

  const { mutate: createUserManagement, isPending: isPendingCreateUserManagement } =
    useCreateSettings({
      options: {
        onSuccess: () => {
          refetchSettings();

          messageApi.open({
            type: "success",
            content: "Success update settings",
          });
        },
      },
    });

  const onSubmit = (data: FormSettingsValues) => {
    const { company_name, company_address, npwp, tel, email } = data;

    let formdata = new FormData();

    formdata.append("company_name", company_name);
    formdata.append("company_address", company_address);
    formdata.append("npwp", npwp);
    formdata.append("tel", tel);
    formdata.append("email", email);
    formdata.append("company_image_path", avatarPathRaw?.file.originFileObj as any);

    createUserManagement(formdata);
  };

  const uploadButton = (
    <button className="border border-0 bg-none" type="button">
      {loadingImageAvatar ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="mt-2">Upload</div>
    </button>
  );

  useEffect(() => {
    if (dataSettings) {
      const { data } = dataSettings.data;

      localStorage.setItem("company_profile", JSON.stringify(data));

      setValue("company_image_path", data.companyImagePath);
      setValue("company_name", data.companyName);
      setValue("company_address", data.companyAddress);
      setValue("npwp", data.npwp);
      setValue("tel", data.tel);
      setValue("email", data.email);
    }
  }, [dataSettings]);

  return (
    <div className="p-6">
      {contextHolder}
      {isPendingSettings && <Spin fullscreen />}
      <div className="flex gap-4 items-center">
        <Text label="Change setting" className="text-3xl font-normal text-secondary-blue" />
      </div>

      <div className="gap-6 flex">
        <div className="w-1/2">
          <Text label="User info" className="mt-6 text-2xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex">
              <div className="w-1/2">
                <Text label="Company logo" className="text-xl font-semibold text-black" />

                <div className="flex justify-center mt-6">
                  <Controller
                    control={control}
                    name="company_image_path"
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Upload
                         multiple={false}
                         maxCount={1}
                          name="company_image_path"
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
                </div>
              </div>

              <div className="w-1/2">
                <div>
                  <div className="mb-6">
                    <Controller
                      control={control}
                      rules={{
                        required: "Company name is required",
                      }}
                      name="company_name"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="company_name"
                          type="text"
                          required
                          placeholder="Enter Company name"
                          classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                          classNameLabel="block text-xl font-semibold text-black"
                          label="Company Name"
                        />
                      )}
                    />
                  </div>

                  <div className="mb-6">
                    <Controller
                      control={control}
                      rules={{
                        required: "Company address is required",
                      }}
                      name="company_address"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <InputTextArea
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="company_address"
                          required
                          placeholder="Enter company address"
                          classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                          classNameLabel="block text-xl font-semibold text-black"
                          label="Company address"
                        />
                      )}
                    />
                  </div>

                  <div className="mb-6">
                    <Controller
                      control={control}
                      rules={{
                        required: "NPWP name is required",
                      }}
                      name="npwp"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="npwp"
                          type="string"
                          required
                          placeholder="Enter NPWP"
                          classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                          classNameLabel="block text-xl font-semibold text-black"
                          label="NPWP"
                        />
                      )}
                    />
                  </div>

                  <div className="mb-6">
                    <Controller
                      control={control}
                      rules={{
                        required: "NPWP name is required",
                      }}
                      name="tel"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="tel"
                          type="string"
                          required
                          placeholder="Enter tel"
                          classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                          classNameLabel="block text-xl font-semibold text-black"
                          label="Telp"
                        />
                      )}
                    />
                  </div>

                  <div className="mb-6">
                    <Controller
                      control={control}
                      rules={{
                        required: "Email name is required",
                      }}
                      name="email"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          placeholder="Enter email"
                          classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                          classNameLabel="block text-xl font-semibold text-black"
                          label="Email"
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
          onClick={handleSubmit(onSubmit)}
          label="Update"
          disabled={isPendingCreateUserManagement}
          loading={isPendingCreateUserManagement}
          className="flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-white shadow-sm bg-primary-blue hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      </div>
    </div>
  );
}
