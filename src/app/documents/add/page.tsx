"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Text from "@/components/Text";
import { useCreateDocument } from "@/services/document/useDocument";
import { BackIcon } from "@/style/icon";
import { UploadOutlined } from "@ant-design/icons";
import { Button as ButtonAntd, ConfigProvider, Upload, UploadProps, message } from "antd";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

type FormDocumentValues = {
  docName: string;
  docNumber: string;
  textRemarks: string;
  numericRemarks: string;
  tags: string[];
  collaborators: string[];
  file: string;
  authorizers: string[];
  recipients: string[];
};

interface DataType {
  key: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export default function AddDocumentPage() {
  const router = useRouter();

  const { control, handleSubmit, setValue } = useForm<FormDocumentValues>({
    defaultValues: {
      docName: "",
      docNumber: "",
      textRemarks: "",
      numericRemarks: "",
      tags: [],
      collaborators: [],
      file: "",
      authorizers: [],
      recipients: [],
    },
  });

  const { mutate: createDocument, isPending: isPendingCreateDocument } = useCreateDocument({
    options: {
      onSuccess: () => {
        router.back();
      },
    },
  });

  const onSubmit = (data: FormDocumentValues) => {
    createDocument(data);
  };

  const props: UploadProps = {
    name: "file",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        setValue("file", JSON.stringify(info));
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 items-center">
        <BackIcon
          style={{ color: "#2379AA", height: 24, width: 24 }}
          onClick={() => router.back()}
        />
        <Text label="Add document" className="text-2xl font-normal text-secondary-blue" />
      </div>

      <div className="gap-6 flex">
        <div className="w-1/2">
          <Text label="Document info" className="mt-6 text-xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <div>
                  <div className="mb-6">
                    <Controller
                      control={control}
                      rules={{
                        required: "Document name is required",
                      }}
                      name="docName"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="docName"
                          type="text"
                          required
                          placeholder="Enter document name"
                          classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                          classNameLabel="block text-lg font-semibold text-black"
                          label="Document name"
                        />
                      )}
                    />
                  </div>

                  <div className="mb-6">
                    <Controller
                      control={control}
                      rules={{
                        required: "Text remarks is required",
                      }}
                      name="textRemarks"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="textRemarks"
                          type="text"
                          required
                          placeholder="Enter text remarks"
                          classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                          classNameLabel="block text-lg font-semibold text-black"
                          label="Text remarks"
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
                          styleSelect={{ width: "100%" }}
                          required
                          label="Tags"
                          classNameLabel="block text-lg font-semibold text-black"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="w-1/2">
                <div>
                  <div className="mb-6">
                    <Controller
                      control={control}
                      rules={{
                        required: "Document number is required",
                      }}
                      name="docNumber"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="docNumber"
                          type="text"
                          required
                          placeholder="Enter document number"
                          classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                          classNameLabel="block text-lg font-semibold text-black"
                          label="Document number"
                        />
                      )}
                    />
                  </div>

                  <div className="mb-6">
                    <Controller
                      control={control}
                      rules={{
                        required: "Numeric remarks is required",
                      }}
                      name="numericRemarks"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="numericRemarks"
                          type="text"
                          required
                          placeholder="Enter numeric remarks"
                          classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                          classNameLabel="block text-lg font-semibold text-black"
                          label="Numeric remarks"
                        />
                      )}
                    />
                  </div>

                  <div className="mb-6">
                    <Controller
                      control={control}
                      rules={{
                        required: "Collaborators is required",
                      }}
                      name="collaborators"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select
                          mode="tags"
                          name="collaborators"
                          onChange={onChange}
                          tokenSeparators={[","]}
                          value={value}
                          styleSelect={{ width: "100%" }}
                          required
                          label="Collaborators"
                          classNameLabel="block text-lg font-semibold text-black"
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
          <Text label="File and authorizers" className="mt-6 text-xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <div>
                  <Text label="Document file" className="mb-2 text-lg font-semibold text-black" />
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#0AADE0",
                      },
                    }}
                  >
                    <Upload {...props}>
                      <ButtonAntd type="primary" icon={<UploadOutlined />}></ButtonAntd>
                    </Upload>
                  </ConfigProvider>
                </div>
              </div>

              <div className="w-1/2">
                <div>
                  <div className="mb-6">
                    <Controller
                      control={control}
                      rules={{
                        required: "Authorizers is required",
                      }}
                      name="authorizers"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select
                          mode="tags"
                          name="authorizers"
                          onChange={onChange}
                          tokenSeparators={[","]}
                          value={value}
                          styleSelect={{ width: "100%" }}
                          required
                          label="Authorizers"
                          classNameLabel="block text-lg font-semibold text-black"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Text label="Recipients and process" className="mt-6 text-xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <div className="mb-6">
                  <Controller
                    control={control}
                    rules={{
                      required: "Recipients is required",
                    }}
                    name="recipients"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <Select
                        mode="tags"
                        name="recipients"
                        onChange={onChange}
                        tokenSeparators={[","]}
                        value={value}
                        styleSelect={{ width: "100%" }}
                        required
                        label="Recipients"
                        classNameLabel="block text-lg font-semibold text-black"
                      />
                    )}
                  />
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
          loading={isPendingCreateDocument}
          disabled={isPendingCreateDocument}
          onClick={handleSubmit(onSubmit)}
          label="Save"
          className="flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-white shadow-sm bg-primary-blue hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      </div>
    </div>
  );
}
