"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import Text from "@/components/Text";
import UseDateTimeFormat from "@/hook/useDateFormat";
import { useCreateDocument, useDocumentById } from "@/services/document/useDocument";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DataDocumentsType } from "../page";
import Select from "@/components/Select";
import { DefaultOptionType } from "antd/es/cascader";
import { useDocumentTags } from "@/services/document-tags/useDocumentTags";
import { TagType } from "@/app/profile/page";

type FormDocumentValues = {
  docName: string;
  id: string;
  status: string;
  latestApproval: string;
  memoId: string;
  docNumber: string;
  textRemarks: string;
  numericRemarks: string;
  tags: string[];
  collaborators: string[];
  file: string;
  authorizers: string[];
  recipients: string[];
};

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
      docName: "",
      docNumber: "",
      id: "",
      status: "",
      memoId: "",
      textRemarks: "",
      numericRemarks: "",
      latestApproval: "",
      tags: [],
      collaborators: [],
      file: "",
      authorizers: [],
      recipients: [],
    },
  });

  const { data: dataListTag, isPending: isPendingTag } = useDocumentTags();

  useEffect(() => {
    const fetchDataTag = () => {
      setDataTag(
        dataListTag.data.data.data.map((itemTag: TagType) => ({
          label: itemTag.name,
          value: itemTag.id,
        }))
      );
    };

    if (dataListTag) {
      fetchDataTag();
    }
  }, [dataListTag]);

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

  const { data: dataDocument, isPending: isPendingDocument } = useDocumentById({
    id,
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
      dataIndex: "file",
      key: "file",
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

  const data: DataTypeActionHistory[] = [
    {
      id: "1",
      user: "User Authorizer 3",
      act: "Uploaded",
      note: "Uploaded",
      file: "Uploaded",
      fileVerHistory: "Uploaded",
      updatedAt: new Date(),
    },
  ];

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
      dataIndex: "file",
      key: "file",
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

  return (
    <div className="p-6">
      {isPendingDocument && <Spin fullscreen />}

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
                        "docNumber",
                        "id",
                        "numericRemarks",
                        "collaborators",
                        "authorizers",
                        "recipients",
                        "file",
                      ].includes(filtering)
                  )
                  .map((mapping) => {
                    const labelMap: any = {
                      docName: "Document name",
                      memoId: "Memo ID",
                      textRemarks: "Text remarks",
                      status: "Status",
                      tags: "Tags",
                    };

                    const valueMap: any = watch();

                    return (
                      <div className="mb-6" key={mapping}>
                        <Text
                          label={labelMap[mapping]}
                          className="text-xl font-semibold text-black"
                        />
                        {mapping === "tags" ? (
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
                        "authorizers",
                        "recipients",
                        "file",
                        "docName",
                        "memoId",
                        "textRemarks",
                        "status",
                        "tags",
                      ].includes(filtering)
                  )
                  .map((mapping) => {
                    const labelMap: any = {
                      docNumber: "Document number",
                      id: "Data ID",
                      numericRemarks: "Numeric remarks",
                      latestApproval: "Latest approval",
                      collaborators: "Collaborators",
                    };

                    const valueMap: any = watch();

                    return (
                      <div className="mb-6" key={mapping}>
                        <Text
                          label={labelMap[mapping]}
                          className="text-xl font-semibold text-black"
                        />
                        {mapping === "collaborators" ? (
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
                <div>
                  <Text
                    label="Latest document file"
                    className="mb-2 text-lg font-semibold text-black"
                  />
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
                {Object.keys(watch())
                  .filter(
                    (filtering) =>
                      ![
                        "recipients",
                        "file",
                        "docName",
                        "memoId",
                        "textRemarks",
                        "status",
                        "tags",
                        "docNumber",
                        "id",
                        "numericRemarks",
                        "collaborators",
                        "latestApproval",
                      ].includes(filtering)
                  )
                  .map((mapping) => {
                    const labelMap: any = {
                      authorizers: "Authorizers",
                    };

                    const valueMap: any = watch();

                    return (
                      <div className="mb-6" key={mapping}>
                        <Text
                          label={labelMap[mapping]}
                          className="text-xl font-semibold text-black"
                        />
                        {mapping === "collaborators" ? (
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
                        "file",
                        "docName",
                        "memoId",
                        "textRemarks",
                        "status",
                        "tags",
                        "docNumber",
                        "id",
                        "numericRemarks",
                        "collaborators",
                        "latestApproval",
                      ].includes(filtering)
                  )
                  .map((mapping) => {
                    const labelMap: any = {
                      recipients: "Recipients",
                    };

                    const valueMap: any = watch();

                    return (
                      <div className="mb-6" key={mapping}>
                        <Text
                          label={labelMap[mapping]}
                          className="text-xl font-semibold text-black"
                        />
                        {mapping === "collaborators" ? (
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
              name="textRemarks"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  onChange={onChange}
                  error={error}
                  onBlur={onBlur}
                  value={value}
                  name="textRemarks"
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
              }}
              name="numericRemarks"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  onChange={onChange}
                  error={error}
                  onBlur={onBlur}
                  value={value}
                  name="numericRemarks"
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
              name="docName"
              render={({ field: { onChange } }) => (
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#0AADE0",
                    },
                  }}
                >
                  <Upload
                    name="docName"
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    headers={{
                      authorization: "authorization-text",
                    }}
                    onChange={(info) => {
                      if (info.file.status !== "uploading") {
                        console.log(info.file, info.fileList);
                      }
                      if (info.file.status === "done") {
                        message.success(`${info.file.name} file uploaded successfully`);
                        onChange(JSON.stringify(info));
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
