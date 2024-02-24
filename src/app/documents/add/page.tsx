"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import InputTextArea from "@/components/InputTextArea";
import Select from "@/components/Select";
import Text from "@/components/Text";
import { TagType } from "@/interface/common";
import { FormDocumentValues, UserListType } from "@/interface/documents.interface";
import { useDocumentTags } from "@/services/document-tags/useDocumentTags";
import { useCreateDocument } from "@/services/document/useDocument";
import { useUserList } from "@/services/user-list/useUserList";
import { BackIcon } from "@/style/icon";
import { UploadOutlined } from "@ant-design/icons";
import { Button as ButtonAntd, ConfigProvider, Spin, Upload, message, UploadFile } from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useDebounce from "@/hook/useDebounce";

export default function AddDocumentPage() {
  const router = useRouter();

  const [dataTag, setDataTag] = useState<DefaultOptionType[]>([]);

  const [isUploadFile, setIsUploadFile] = useState<boolean>(false);

  const [dataCollaborator, setDataCollaborator] = useState<DefaultOptionType[]>([]);
  const [dataAuthorizer, setDataAuthorizer] = useState<DefaultOptionType[]>([]);
  const [dataRecipient, setDataRecipient] = useState<DefaultOptionType[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [searchTagDocument, setSearchTagDocument] = useState<string>("");
  const [searchCollaboratorDocument, setSearchCollaboratorDocument] = useState<string>("");
  const [searchSearchRecipientDocumentDocument, setSearchSearchRecipientDocumentDocument] =
    useState<string>("");
  const [searchSearchAuthorizerDocumentDocument, setSearchSearchAuthorizerDocumentDocument] =
    useState<string>("");

  const debounceSearchTagDocument = useDebounce(searchTagDocument, 800);
  const debounceSearchCollaboratorDocument = useDebounce(searchCollaboratorDocument, 800);
  const debounceSearchRecipientDocument = useDebounce(searchSearchRecipientDocumentDocument, 800);
  const debounceSearchAuthorizerDocument = useDebounce(searchSearchAuthorizerDocumentDocument, 800);

  const [messageApi, contextHolder] = message.useMessage();

  const { control, handleSubmit, setValue } = useForm<FormDocumentValues>({
    defaultValues: {
      document_name: "",
      document_number: "",
      text_remarks: "",
      numeric_remarks: "",
      document_tag_id: [],
      document_collaborator_id: [],
      document_path: "",
      document_note: "",
      document_authorizer_id: [],
      document_recipient_id: [],
    },
  });

  const { mutate: createDocument, isPending: isPendingCreateDocument } = useCreateDocument({
    options: {
      onSuccess: () => {
        messageApi.open({
          type: "success",
          content: "Create document success",
        });

        router.back();
      },
    },
  });

  const { data: dataListTag, isPending: isPendingTag } = useDocumentTags({
    query: {
      search: debounceSearchTagDocument,
    },
  });
  const { data: dataListCollaboratorDocument, isPending: isPendingCollaboratorDocument } =
    useUserList({
      query: {
        search: debounceSearchCollaboratorDocument,
      },
    });

  const { data: dataRecipientList, isPending: isPendingRecipientList } = useUserList({
    query: {
      search: debounceSearchRecipientDocument,
    },
  });

  const { data: dataListAuthorizer, isPending: isPendingAuthorizer } = useUserList({
    query: {
      search: debounceSearchAuthorizerDocument,
    },
  });

  useEffect(() => {
    const fetchDataTag = () => {
      setDataTag(
        dataListTag.data.data.data.map((itemTag: TagType) => ({
          label: itemTag.name,
          value: itemTag.id,
        }))
      );
    };

    const fetchDataAuthorizerList = () => {
      setDataAuthorizer(
        dataListAuthorizer?.data?.data.map((itemTag: UserListType) => ({
          label: itemTag.label,
          value: itemTag.id,
        }))
      );
    };

    const fetchDataListRecipientDocument = () => {
      setDataRecipient(
        dataRecipientList?.data?.data.map((itemTag: UserListType) => ({
          label: itemTag.label,
          value: itemTag.id,
        }))
      );
    };

    const fetchDataListCollaboratorDocument = () => {
      setDataCollaborator(
        dataListCollaboratorDocument?.data?.data.map((itemTag: UserListType) => ({
          label: itemTag.label,
          value: itemTag.id,
        }))
      );
    };

    if (dataListTag) {
      fetchDataTag();
    }

    if (dataListCollaboratorDocument) {
      fetchDataListCollaboratorDocument();
    }

    if (dataRecipientList) {
      fetchDataListRecipientDocument();
    }

    if (dataListAuthorizer) {
      fetchDataAuthorizerList();
    }
  }, [dataListTag, dataRecipientList, dataListCollaboratorDocument, dataListAuthorizer]);

  const onSubmit = (data: FormDocumentValues) => {
    const {
      document_name,
      document_number,
      text_remarks,
      numeric_remarks,
      document_tag_id,
      document_collaborator_id,
      document_authorizer_id,
      document_recipient_id,
      document_path,
      document_note,
    } = data;

    let formdata = new FormData();

    formdata.append("document_name", document_name);
    formdata.append("document_number", document_number);
    formdata.append("text_remarks", text_remarks);
    formdata.append("document_note", document_note);
    formdata.append("numeric_remarks", numeric_remarks);
    formdata.append("document_path", document_path.file.originFileObj);
    formdata.append("document_tag_id", document_tag_id.join(","));
    formdata.append("document_collaborator_id", document_collaborator_id.join(","));
    formdata.append("document_authorizer_id", document_authorizer_id.join(","));
    formdata.append("document_recipient_id", document_recipient_id.join(","));

    createDocument(formdata);
  };

  return (
    <div className="p-6">
      {contextHolder}
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
                      name="document_name"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="document_name"
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
                      name="text_remarks"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="text_remarks"
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
                      name="document_tag_id"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select
                          mode="multiple"
                          name="document_tag_id"
                          options={dataTag}
                          onChange={onChange}
                          tokenSeparators={[","]}
                          value={value}
                          styleSelect={{ width: "100%" }}
                          required
                          error={error}
                          label="Tags"
                          classNameLabel="block text-lg font-semibold text-black"
                          onBlur={() => {
                            setSearchTagDocument("");
                          }}
                          onSearch={(val: string) => setSearchTagDocument(val)}
                          notFoundContent={isPendingTag ? <Spin size="small" /> : null}
                          filterOption={false}
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
                      name="document_number"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="document_number"
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
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Please enter a number",
                        },
                      }}
                      name="numeric_remarks"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <Input
                          onChange={onChange}
                          error={error}
                          onBlur={onBlur}
                          value={value}
                          name="numeric_remarks"
                          type="number"
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
                      name="document_collaborator_id"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select
                          mode="multiple"
                          name="document_collaborator_id"
                          options={dataCollaborator}
                          onChange={onChange}
                          tokenSeparators={[","]}
                          value={value}
                          styleSelect={{ width: "100%" }}
                          required
                          error={error}
                          label="Collaborators"
                          classNameLabel="block text-lg font-semibold text-black"
                          notFoundContent={
                            isPendingCollaboratorDocument ? <Spin size="small" /> : null
                          }
                          filterOption={false}
                          onBlur={() => {
                            setSearchCollaboratorDocument("");
                          }}
                          onSearch={(val: string) => setSearchCollaboratorDocument(val)}
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
                <div className="mb-6">
                  <Text label="Document file" className="mb-2 text-lg font-semibold text-black" />

                  <Controller
                    control={control}
                    name="document_path"
                    render={({ field: { onChange }, fieldState: { error } }) => {
                      return (
                        <div>
                          <ConfigProvider
                            theme={{
                              token: {
                                colorPrimary: "#0AADE0",
                              },
                            }}
                          >
                            <Upload
                              multiple={false}
                              maxCount={1}
                              fileList={fileList}
                              name="document_path"
                              headers={{ authorization: "authorization-text" }}
                              onChange={(info) => {
                                setIsUploadFile(true);
                                setFileList(info.fileList);

                                if (info.file.status !== "uploading") {
                                  console.log(info.file, info.fileList);
                                }
                                if (info.file.status === "done") {
                                  message.success(`${info.file.name} file uploaded successfully`);
                                  onChange(info);
                                  setIsUploadFile(false);
                                } else if (info.file.status === "error") {
                                  message.error(`${info.file.name} file upload failed.`);
                                  setIsUploadFile(false);
                                }
                              }}
                            >
                              <ButtonAntd type="primary" icon={<UploadOutlined />}></ButtonAntd>
                            </Upload>
                          </ConfigProvider>

                          {error && (
                            <Text
                              className="text-[#EB5757] font-roboto mt-2 font-bold text-sm"
                              label={String(error.message)}
                            />
                          )}
                        </div>
                      );
                    }}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="document_note"
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                      <InputTextArea
                        onChange={onChange}
                        error={error}
                        onBlur={onBlur}
                        value={value}
                        name="document_note"
                        placeholder="Enter note"
                        classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                        classNameLabel="block text-xl font-semibold text-black"
                        label="Note"
                      />
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
                        required: "Authorizers is required",
                      }}
                      name="document_authorizer_id"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Select
                          mode="multiple"
                          name="document_authorizer_id"
                          options={dataAuthorizer}
                          onChange={onChange}
                          tokenSeparators={[","]}
                          value={value}
                          styleSelect={{ width: "100%" }}
                          required
                          error={error}
                          label="Authorizers"
                          classNameLabel="block text-lg font-semibold text-black"
                          notFoundContent={isPendingAuthorizer ? <Spin size="small" /> : null}
                          filterOption={false}
                          onBlur={() => {
                            setSearchSearchAuthorizerDocumentDocument("");
                          }}
                          onSearch={(val: string) => setSearchSearchAuthorizerDocumentDocument(val)}
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
                    name="document_recipient_id"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <Select
                        mode="multiple"
                        name="document_recipient_id"
                        options={dataRecipient}
                        onChange={onChange}
                        tokenSeparators={[","]}
                        value={value}
                        styleSelect={{ width: "100%" }}
                        required
                        error={error}
                        label="Recipients"
                        classNameLabel="block text-lg font-semibold text-black"
                        notFoundContent={isPendingRecipientList ? <Spin size="small" /> : null}
                        filterOption={false}
                        onBlur={() => {
                          setSearchSearchRecipientDocumentDocument("");
                        }}
                        onSearch={(val: string) => setSearchSearchRecipientDocumentDocument(val)}
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
          loading={isPendingCreateDocument || isUploadFile}
          disabled={isPendingCreateDocument || isUploadFile}
          onClick={handleSubmit(onSubmit)}
          label={isPendingCreateDocument || isUploadFile ? "Loading..." : "Save"}
          className="flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-white shadow-sm bg-primary-blue hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      </div>
    </div>
  );
}
