"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import InputTextArea from "@/components/InputTextArea";
import Text from "@/components/Text";
import { FileType, beforeUpload, getBase64 } from "@/utils/imageUpload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useUserManagement,
  useUpdateUserManagement,
} from "@/services/user-management/useUserManagement";
import { useSettings, useUpdateSettings } from "@/services/settings/useSettings";

type FormSettingsValues = {
  imgProfile: string;
  name: string;
  address: string;
  npwp: string;
  telp: string;
  email: string;
};

export default function SettingsPage() {
  const [loadingImageAvatar, setLoadingImageAvatar] = useState<boolean>(false);

  const { control, handleSubmit, setValue } = useForm<FormSettingsValues>({
    defaultValues: {
      imgProfile: "/placeholder-profile.png",
      name: "",
      address: "",
      npwp: "",
      telp: "",
      email: "",
    },
  });

  const { data: dataSettings, refetch: refetchSettings } = useSettings();

  const { mutate: updateUserManagement, isPending: isPendingUpdateUserManagement } =
    useUpdateSettings({
      options: {
        onSuccess: () => {
          refetchSettings();
        },
      },
    });

  const onSubmit = (data: FormSettingsValues) => {
    updateUserManagement(data);
  };

  const uploadButton = (
    <button className="border border-0 bg-none" type="button">
      {loadingImageAvatar ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="mt-2">Upload</div>
    </button>
  );

  useEffect(() => {
    if (dataSettings) {
      setValue("imgProfile", dataSettings.imgProfile);
      setValue("name", dataSettings.name);
      setValue("address", dataSettings.address);
      setValue("npwp", dataSettings.npwp);
    }
  }, [dataSettings]);

  return (
    <div className="p-6">
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
                      name="name"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="name"
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
                      name="address"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <InputTextArea
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="address"
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
                          type="number"
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
                      name="telp"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="telp"
                          type="number"
                          required
                          placeholder="Enter telp"
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
          disabled={isPendingUpdateUserManagement}
          loading={isPendingUpdateUserManagement}
          className="flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-white shadow-sm bg-primary-blue hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      </div>
    </div>
  );
}
