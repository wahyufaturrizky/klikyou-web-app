"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import InputTextArea from "@/components/InputTextArea";
import Select from "@/components/Select";
import Text from "@/components/Text";
import UseDateTimeFormat from "@/hook/useDateFormat";
import { useDocumentTags } from "@/services/document-tags/useDocumentTags";
import { useDocumentById, useUpdateDocument } from "@/services/document/useDocument";
import { useUserList } from "@/services/user-list/useUserList";
import {
  BackIcon,
  DownloadIcon,
  HistoryIcon,
  OpenIcon,
  PencilIcon,
  ProtectIcon,
} from "@/style/icon";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button as ButtonAntd,
  ConfigProvider,
  Modal,
  Spin,
  Table,
  TableProps,
  Upload,
  UploadProps,
  message,
} from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormDocumentValues, UserListType } from "../add/page";
import { DataDocumentsType } from "../page";
import { TagType } from "@/interface/common";

interface DataTypeActionHistory {
  id: string;
  user: string;
  act: string;
  note: string;
  file: string;
  fileVerHistory: string;
  updatedAt: Date;
}

interface DataTypeInfo {
  id: string;
  createBy: string;
  createAt: Date;
  updateBy: string;
  updatedAt: Date;
}

interface EditModal {
  open: boolean;
  data?: DataTypeInfo | null;
}

export default function ViewEditDocumentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [dataTag, setDataTag] = useState<DefaultOptionType[]>([]);

  const [dataCollaborator, setDataCollaborator] = useState<DefaultOptionType[]>([]);
  const [dataAuthorizer, setDataAuthorizer] = useState<DefaultOptionType[]>([]);
  const [dataRecipient, setDataRecipient] = useState<DefaultOptionType[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const [isEdit, setIsEdit] = useState<boolean>(id[0] === "view" ? false : true);

  const [stateEditDocumentInfoModal, setStateEditDocumentInfoModal] = useState<EditModal>({
    open: false,
    data: null,
  });

  const [stateEditFileAndAuthModal, setStateEditFileAndAuthModal] = useState<EditModal>({
    open: false,
    data: null,
  });

  const [stateEditRecipientAndProcessModal, setStateEditRecipientAndProcessModal] =
    useState<EditModal>({
      open: false,
      data: null,
    });

  const [dataById, setDataById] = useState<DataDocumentsType>();

  const { control, handleSubmit, setValue, watch } = useForm<FormDocumentValues>({
    defaultValues: {
      document_name: "",
      document_number: "",
      text_remarks: "",
      numeric_remarks: "",
      document_tag_id: [],
      document_collaborator_id: [],
      document_path: "",
      document_authorizer_id: [],
      document_recipient_id: [],
      document_note: "",
    },
  });

  const { data: dataListTag, isPending: isPendingTag } = useDocumentTags();
  const { data: dataListUserList, isPending: isPendingUserList } = useUserList();

  useEffect(() => {
    const fetchDataTag = () => {
      setDataTag(
        dataListTag.data.data.data.map((itemTag: TagType) => ({
          label: itemTag.name,
          value: itemTag.id,
        }))
      );
    };

    const FetchDataUserList = () => {
      setDataAuthorizer(
        dataListUserList?.data?.data.map((itemTag: UserListType) => ({
          label: itemTag.label,
          value: itemTag.id,
        }))
      );

      setDataCollaborator(
        dataListUserList?.data?.data.map((itemTag: UserListType) => ({
          label: itemTag.label,
          value: itemTag.id,
        }))
      );

      setDataRecipient(
        dataListUserList?.data?.data.map((itemTag: UserListType) => ({
          label: itemTag.label,
          value: itemTag.id,
        }))
      );
    };

    if (dataListTag) {
      fetchDataTag();
    }

    if (dataListTag) {
      FetchDataUserList();
    }
  }, [dataListTag, dataListUserList]);

  const { mutate: updateDocument, isPending: isPendingUpdateDocument } = useUpdateDocument({
    id: id[1],
    options: {
      onSuccess: () => {
        messageApi.open({
          type: "success",
          content: "Update document success",
        });

        // router.back();
      },
    },
  });

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

    formdata.append("document_name", document_name || "");
    formdata.append("document_number", document_number || "");
    formdata.append("text_remarks", text_remarks || "");
    formdata.append("document_note", document_note || "");
    formdata.append("numeric_remarks", numeric_remarks || "");
    formdata.append("document_path", document_path.file.originFileObj);
    formdata.append("document_tag_id", document_tag_id.join(","));
    formdata.append("document_collaborator_id", document_collaborator_id.join(","));
    formdata.append("document_authorizer_id", document_authorizer_id.join(","));
    formdata.append("document_recipient_id", document_recipient_id.join(","));

    updateDocument(formdata);
  };

  const props: UploadProps = {
    name: "document_path",
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
        setValue("document_path", info);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const { data: dataDocument, isPending: isPendingDocument } = useDocumentById({
    id: id[1],
  });

  useEffect(() => {
    if (dataDocument) {
      setDataById(
        dataDocument.data.data.map((item: DataDocumentsType) => ({
          ...item,
          key: item.id,
        }))
      );
    }
  }, [dataDocument]);

  const columns: TableProps<DataTypeActionHistory>["columns"] = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
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
      title: "Action",
      dataIndex: "act",
      key: "act",
      render: (text: string) => {
        return (
          <Text
            label={text}
            className="text-base inline-block font-normal text-white py-1 px-2 rounded-full bg-link"
          />
        );
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text: string) => {
        return (
          <Link className="flex items-center gap-2" href={`/${text}`}>
            <OpenIcon
              style={{
                height: 32,
                width: 32,
              }}
            />

            <Text label={text} className="text-base font-normal text-black" />
          </Link>
        );
      },
    },
    {
      title: "Supporting File",
      dataIndex: "document_path",
      key: "document_path",
      render: (text: string) => {
        return (
          <Link className="flex items-center gap-2" href={`/${text}`}>
            <DownloadIcon
              style={{
                height: 32,
                width: 32,
              }}
            />

            <Text label="Download" className="text-base font-normal text-link" />
          </Link>
        );
      },
    },
    {
      title: "File version history",
      dataIndex: "fileVerHistory",
      key: "fileVerHistory",
      render: (text: string) => {
        return (
          <Link className="flex items-center gap-2" href={`/${text}`}>
            <DownloadIcon
              style={{
                height: 32,
                width: 32,
              }}
            />

            <Text label={text} className="text-base font-normal text-link" />
          </Link>
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

  const data: DataTypeActionHistory[] = [];

  const columnsInfo: TableProps<DataTypeInfo>["columns"] = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
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
      title: "Action",
      dataIndex: "act",
      key: "act",
      render: (text: string) => {
        return (
          <Text
            label={text}
            className="text-base inline-block font-normal text-white py-1 px-2 rounded-full bg-link"
          />
        );
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text: string) => {
        return (
          <Link className="flex items-center gap-2" href={`/${text}`}>
            <OpenIcon
              style={{
                height: 32,
                width: 32,
              }}
            />

            <Text label={text} className="text-base font-normal text-black" />
          </Link>
        );
      },
    },
    {
      title: "Supporting File",
      dataIndex: "document_path",
      key: "document_path",
      render: (text: string) => {
        return (
          <Link className="flex items-center gap-2" href={`/${text}`}>
            <DownloadIcon
              style={{
                height: 32,
                width: 32,
              }}
            />

            <Text label="Download" className="text-base font-normal text-link" />
          </Link>
        );
      },
    },
    {
      title: "File version history",
      dataIndex: "fileVerHistory",
      key: "fileVerHistory",
      render: (text: string) => {
        return (
          <Link className="flex items-center gap-2" href={`/${text}`}>
            <DownloadIcon
              style={{
                height: 32,
                width: 32,
              }}
            />

            <Text label={text} className="text-base font-normal text-link" />
          </Link>
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

  const dataInfo: DataTypeInfo[] = [
    {
      id: "1",
      createBy: "asdasd",
      createAt: new Date(),
      updateBy: "asdasd",
      updatedAt: new Date(),
    },
  ];

  const isLoading = isPendingDocument || isPendingTag || isPendingUserList;

  return (
    <div className="p-6">
      {isLoading && <Spin fullscreen />}
      {contextHolder}

      <div className="flex gap-4 items-center">
        <BackIcon
          style={{ color: "#2379AA", height: 24, width: 24 }}
          onClick={() => router.back()}
        />
        <Text label="Detail document" className="text-2xl font-normal text-secondary-blue" />
      </div>

      <div className="gap-6 flex">
        <div className="w-1/2">
          <Text label="Document info" className="mt-6 text-xl font-bold text-black" />

          <Button
            type="button"
            onClick={() =>
              setStateEditDocumentInfoModal({
                open: true,
              })
            }
            label="Edit"
            icon={<PencilIcon />}
            className="mt-6 gap-2 flex justify-center items-center rounded-md bg-primary-blue px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                {Object.keys(watch())
                  .filter(
                    (filtering) =>
                      ![
                        "document_number",
                        "id",
                        "numeric_remarks",
                        "document_collaborator_id",
                        "document_authorizer_id",
                        "document_recipient_id",
                        "document_path",
                        "document_note",
                      ].includes(filtering)
                  )
                  .map((mapping) => {
                    const labelMap: any = {
                      document_name: "Document name",
                      memoId: "Memo ID",
                      text_remarks: "Text remarks",
                      status: "Status",
                      document_tag_id: "Tags",
                    };

                    const valueMap: any = watch();

                    return (
                      <div className="mb-6" key={mapping}>
                        <Text
                          label={labelMap[mapping]}
                          className="text-xl font-semibold text-black"
                        />
                        {mapping === "document_tag_id" ? (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {valueMap[mapping].map((item: string) => (
                              <Text
                                key={item}
                                label={item}
                                className="text-base font-normal text-white rounded-full py-2 px-4 bg-[#455C72]"
                              />
                            ))}
                          </div>
                        ) : mapping === "status" ? (
                          <Text
                            key={valueMap[mapping]}
                            label={valueMap[mapping]}
                            className="inline-block mt-2 text-base font-normal text-white rounded-full py-2 px-4 bg-[#455C72]"
                          />
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

              <div className="w-1/2">
                {Object.keys(watch())
                  .filter(
                    (filtering) =>
                      ![
                        "document_authorizer_id",
                        "document_recipient_id",
                        "document_path",
                        "document_name",
                        "memoId",
                        "text_remarks",
                        "status",
                        "document_tag_id",
                        "document_note",
                      ].includes(filtering)
                  )
                  .map((mapping) => {
                    const labelMap: any = {
                      document_number: "Document number",
                      id: "Data ID",
                      numeric_remarks: "Numeric remarks",
                      latestApproval: "Latest approval",
                      document_collaborator_id: "Collaborators",
                    };

                    const valueMap: any = watch();

                    return (
                      <div className="mb-6" key={mapping}>
                        <Text
                          label={labelMap[mapping]}
                          className="text-xl font-semibold text-black"
                        />
                        {mapping === "document_collaborator_id" ? (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {valueMap[mapping].map((item: string) => (
                              <Text
                                key={item}
                                label={item}
                                className="text-base font-normal text-white rounded-full py-2 px-4 bg-[#455C72]"
                              />
                            ))}
                          </div>
                        ) : mapping === "status" ? (
                          <Text
                            key={valueMap[mapping]}
                            label={valueMap[mapping]}
                            className="inline-block mt-2 text-base font-normal text-white rounded-full py-2 px-4 bg-[#455C72]"
                          />
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
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <Text label="File and authorizers" className="mt-6 text-xl font-bold text-black" />

          <Button
            type="button"
            onClick={() =>
              setStateEditFileAndAuthModal({
                open: true,
              })
            }
            label="Update"
            icon={<HistoryIcon />}
            className="mt-6 flex gap-2 justify-center items-center rounded-md bg-primary-blue px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <div className="mb-6">
                  <Text
                    label="Latest document file"
                    className="mb-2 text-lg font-semibold text-black"
                  />
                  <Controller
                    control={control}
                    name="document_path"
                    render={() => (
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
                    )}
                  />
                </div>

                <div className="mb-6">
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

                <Button
                  type="button"
                  loading={isPendingUpdateDocument}
                  disabled={isPendingUpdateDocument}
                  onClick={handleSubmit(onSubmit)}
                  label="Save"
                  className="flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-white shadow-sm bg-primary-blue hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                />
              </div>

              <div className="w-1/2">
                {Object.keys(watch())
                  .filter(
                    (filtering) =>
                      ![
                        "document_recipient_id",
                        "document_path",
                        "document_name",
                        "memoId",
                        "text_remarks",
                        "status",
                        "document_tag_id",
                        "document_number",
                        "id",
                        "numeric_remarks",
                        "document_collaborator_id",
                        "latestApproval",
                        "document_note",
                      ].includes(filtering)
                  )
                  .map((mapping) => {
                    const labelMap: any = {
                      document_authorizer_id: "Authorizers",
                    };

                    const valueMap: any = watch();

                    return (
                      <div className="mb-6" key={mapping}>
                        <Text
                          label={labelMap[mapping]}
                          className="text-xl font-semibold text-black"
                        />
                        {mapping === "document_collaborator_id" ? (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {valueMap[mapping].map((item: string) => (
                              <Text
                                key={item}
                                label={item}
                                className="text-base font-normal text-white rounded-full py-2 px-4 bg-[#455C72]"
                              />
                            ))}
                          </div>
                        ) : mapping === "status" ? (
                          <Text
                            key={valueMap[mapping]}
                            label={valueMap[mapping]}
                            className="inline-block mt-2 text-base font-normal text-white rounded-full py-2 px-4 bg-[#455C72]"
                          />
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
            </div>
          </div>

          <Text label="Recipients and process" className="mt-6 text-xl font-bold text-black" />

          <Button
            type="button"
            onClick={() =>
              setStateEditRecipientAndProcessModal({
                open: true,
              })
            }
            label="Edit"
            icon={<PencilIcon />}
            className="mt-6 gap-2 flex justify-center items-center rounded-md bg-primary-blue px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                {Object.keys(watch())
                  .filter(
                    (filtering) =>
                      ![
                        "document_path",
                        "document_name",
                        "memoId",
                        "text_remarks",
                        "status",
                        "document_tag_id",
                        "document_number",
                        "id",
                        "numeric_remarks",
                        "document_collaborator_id",
                        "latestApproval",
                      ].includes(filtering)
                  )
                  .map((mapping) => {
                    const labelMap: any = {
                      document_recipient_id: "Recipients",
                    };

                    const valueMap: any = watch();

                    return (
                      <div className="mb-6" key={mapping}>
                        <Text
                          label={labelMap[mapping]}
                          className="text-xl font-semibold text-black"
                        />
                        {mapping === "document_collaborator_id" ? (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {valueMap[mapping].map((item: string) => (
                              <Text
                                key={item}
                                label={item}
                                className="text-base font-normal text-white rounded-full py-2 px-4 bg-[#455C72]"
                              />
                            ))}
                          </div>
                        ) : mapping === "status" ? (
                          <Text
                            key={valueMap[mapping]}
                            label={valueMap[mapping]}
                            className="inline-block mt-2 text-base font-normal text-white rounded-full py-2 px-4 bg-[#455C72]"
                          />
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
            </div>
          </div>
        </div>
      </div>

      <div>
        <Text label="Actions history" className="mt-6 text-2xl font-bold text-black" />

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
              title={() => (
                <div className="flex items-center gap-4">
                  <Text
                    label="Generate approvals certificate:"
                    className="text-base font-normal text-black"
                  />

                  <Button
                    type="button"
                    disabled
                    onClick={() => setIsEdit(!isEdit)}
                    label="Certificate"
                    icon={<ProtectIcon />}
                    className="gap-2 flex justify-center items-center rounded-md bg-primary-gray px-6 py-1.5 text-lg font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  />
                </div>
              )}
              columns={columns}
              dataSource={data}
              pagination={false}
              rowKey={(record) => record.id}
            />
          </ConfigProvider>
        </div>
      </div>

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
              columns={columnsInfo}
              dataSource={dataInfo}
              pagination={false}
              rowKey={(record) => record.id}
            />
          </ConfigProvider>
        </div>
      </div>

      {/* Edit Document Info Modal */}

      <Modal
        title="Edit document info"
        open={stateEditDocumentInfoModal.open}
        onCancel={() => {
          setStateEditDocumentInfoModal({
            open: false,
            data: null,
          });
        }}
        footer={
          <div className="flex justify-end items-center">
            <div className="flex gap-4 items-center">
              <Button
                type="button"
                onClick={() => {
                  setStateEditDocumentInfoModal({
                    open: false,
                    data: null,
                  });
                }}
                label="Cancel"
                className="flex border border-primary-blue justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-primary-blue shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />

              <Button
                type="button"
                onClick={() =>
                  setStateEditDocumentInfoModal({
                    open: false,
                    data: null,
                  })
                }
                label="Yes"
                className="flex justify-center items-center rounded-md bg-primary-blue px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
          </div>
        }
      >
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
                  classNameLabel="block text-xl font-semibold text-black"
                  label="Document name"
                />
              )}
            />
          </div>

          <div className="mb-6">
            <Controller
              control={control}
              rules={{
                required: "Tag name is required",
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
                  classNameLabel="block text-xl font-semibold text-black"
                  label="Document number"
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
                  placeholder="Enter text remarks"
                  classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                  classNameLabel="block text-xl font-semibold text-black"
                  label="Text remarks"
                />
              )}
            />
          </div>

          <div className="mb-6">
            <Controller
              control={control}
              rules={{
                required: "numeric remarks is required",
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
                  placeholder="Enter numeric remarks"
                  classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                  classNameLabel="block text-xl font-semibold text-black"
                  label="Numeric remarks"
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
                  onChange={onChange}
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
                required: "Collaborators is required",
              }}
              name="document_collaborator_id"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Select
                  mode="multiple"
                  name="document_collaborator_id"
                  onChange={onChange}
                  tokenSeparators={[","]}
                  value={value}
                  styleSelect={{ width: "100%" }}
                  required
                  error={error}
                  label="Collaborators"
                  classNameLabel="block text-xl font-semibold text-black"
                />
              )}
            />
          </div>
        </div>
      </Modal>

      {/* Edit file and authorizers */}

      <Modal
        title="Update file and authorizers"
        open={stateEditFileAndAuthModal.open}
        onCancel={() => {
          setStateEditFileAndAuthModal({
            open: false,
            data: null,
          });
        }}
        footer={
          <div className="flex justify-end items-center">
            <div className="flex gap-4 items-center">
              <Button
                type="button"
                onClick={() => {
                  setStateEditFileAndAuthModal({
                    open: false,
                    data: null,
                  });
                }}
                label="Cancel"
                className="flex border border-primary-blue justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-primary-blue shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />

              <Button
                type="button"
                onClick={() =>
                  setStateEditFileAndAuthModal({
                    open: false,
                    data: null,
                  })
                }
                label="Yes"
                className="flex justify-center items-center rounded-md bg-primary-blue px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
          </div>
        }
      >
        <div>
          <div className="mb-6">
            <Controller
              control={control}
              rules={{
                required: "Document name is required",
              }}
              name="document_path"
              render={({ field: { onChange } }) => (
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#0AADE0",
                    },
                  }}
                >
                  <Upload
                    name="document_path"
                    headers={{
                      authorization: "authorization-text",
                    }}
                    onChange={(info) => {
                      if (info.file.status !== "uploading") {
                        console.log(info.file, info.fileList);
                      }
                      if (info.file.status === "done") {
                        message.success(`${info.file.name} file uploaded successfully`);
                        onChange(info);
                      } else if (info.file.status === "error") {
                        message.error(`${info.file.name} file upload failed.`);
                      }
                    }}
                  >
                    <ButtonAntd type="primary" icon={<UploadOutlined />}></ButtonAntd>
                  </Upload>
                </ConfigProvider>
              )}
            />
          </div>

          <div>
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
                  onChange={onChange}
                  tokenSeparators={[","]}
                  value={value}
                  styleSelect={{ width: "100%" }}
                  required
                  error={error}
                  label="Authorizers"
                  classNameLabel="block text-xl font-semibold text-black"
                />
              )}
            />
          </div>
        </div>
      </Modal>

      {/* Edit recipients and process */}

      <Modal
        title="Update recipients and process"
        open={stateEditRecipientAndProcessModal.open}
        onCancel={() => {
          setStateEditRecipientAndProcessModal({
            open: false,
            data: null,
          });
        }}
        footer={
          <div className="flex justify-end items-center">
            <div className="flex gap-4 items-center">
              <Button
                type="button"
                onClick={() => {
                  setStateEditRecipientAndProcessModal({
                    open: false,
                    data: null,
                  });
                }}
                label="Cancel"
                className="flex border border-primary-blue justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-primary-blue shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />

              <Button
                type="button"
                onClick={() =>
                  setStateEditRecipientAndProcessModal({
                    open: false,
                    data: null,
                  })
                }
                label="Yes"
                className="flex justify-center items-center rounded-md bg-primary-blue px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
          </div>
        }
      >
        <div>
          <div>
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
                  onChange={onChange}
                  tokenSeparators={[","]}
                  value={value}
                  styleSelect={{ width: "100%" }}
                  required
                  error={error}
                  label="Recipients"
                  classNameLabel="block text-xl font-semibold text-black"
                />
              )}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
