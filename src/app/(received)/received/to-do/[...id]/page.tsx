"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import InputTextArea from "@/components/InputTextArea";
import Text from "@/components/Text";
import { useActionApproveRejectProcess } from "@/hook/useActionApproveRejectProcess";
import { UseBgColorAction } from "@/hook/useBgColorAction";
import { UseBgColorStatus } from "@/hook/useBgColorStatus";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import {
  ApproveRejectProcessModal,
  FormApproveRejectProcessValues,
  UserType,
} from "@/interface/common";
import { DataDocumentTags } from "@/interface/documents-tag.interface";
import {
  DataInfoDocumentType,
  DataTypeActionHistory,
  DocumentAuthorizersType,
  DocumentCollaboratorsType,
  DocumentRecipientsType,
  DocumentTagsType,
  EditDocumentsModal,
  FormDocumentValues,
  UserListType,
} from "@/interface/documents.interface";
import { ColumnsType } from "@/interface/user-management.interface";
import { useDocumentTags } from "@/services/document-tags/useDocumentTags";
import { useDocumentApproveRejectProcess, useDocumentById } from "@/services/document/useDocument";
import { useUserList } from "@/services/user-list/useUserList";
import {
  BackIcon,
  DownloadIcon,
  FileIcon,
  OpenIcon,
  PeopleCheckIcon,
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
  UploadFile,
  message,
} from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

// Author, Software Architect, Software Engineer, Software Developer : https://www.linkedin.com/in/wahyu-fatur-rizky

export default function ViewEditDocumentPage({ params }: Readonly<{ params: { id: string } }>) {
  const router = useRouter();
  const { id } = params;

  const [dataTag, setDataTag] = useState<DefaultOptionType[] | undefined>([]);
  const [stateViewNoteAndFileVersionModal, setStateViewNoteAndFileVersionModal] =
    useState<EditDocumentsModal>({
      open: false,
      data: null,
    });
  const [dataInfo, setDataInfo] = useState<DataInfoDocumentType[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [isUploadFile, setIsUploadFile] = useState<boolean>(false);

  const [dataLogHistory, setDataLogHistory] = useState<DataTypeActionHistory[]>([]);

  const [dataCollaborator, setDataCollaborator] = useState<DefaultOptionType[]>([]);
  const [dataAuthorizer, setDataAuthorizer] = useState<DefaultOptionType[]>([]);
  const [dataRecipient, setDataRecipient] = useState<DefaultOptionType[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const [stateApproveAndRejectModal, setStateApproveAndRejectModal] =
    useState<ApproveRejectProcessModal>({
      open: false,
      data: null,
      type: "approve",
    });

  const { setValue, getValues } = useForm<FormDocumentValues>({
    defaultValues: {
      document_name: "",
      memoId: "",
      document_number: "",
      id: undefined,
      text_remarks: "",
      numeric_remarks: undefined,
      status: "",
      document_tag_id: [],
      latestAction: "",
      document_collaborator_id: [],
      document_path: "",
      document_authorizer_id: [],
      document_recipient_id: [],
      document_note: "",
    },
  });

  const {
    control: controlApproveRejectEdit,
    handleSubmit: handleSubmitApproveRejectEdit,
    reset: resetApproveRejectEdit,
  } = useForm<FormApproveRejectProcessValues>({
    defaultValues: {
      supporting_document_note: "",
      supporting_document_path: null,
    },
  });

  const { data: dataListTag, isPending: isPendingTag } = useDocumentTags({});
  const { data: dataListUserList, isPending: isPendingUserList } = useUserList();

  useEffect(() => {
    const fetchDataTag = () => {
      setDataTag(
        dataListTag?.data.data.data.map((itemTag: DataDocumentTags) => ({
          label: itemTag.name,
          value: itemTag.id,
        }))
      );
    };

    const fetchDataUserList = () => {
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

    if (dataListUserList) {
      fetchDataUserList();
    }
  }, [dataListTag, dataListUserList]);

  const { data: dataDocument, isPending: isPendingDocument } = useDocumentById({
    id: Number(id[1]),
    options: {
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (dataDocument?.data?.data) {
      const { data: mainData } = dataDocument;
      const { data: rawData } = mainData;

      const {
        documentName,
        documentNumber,
        textRemarks,
        numericRemarks,
        documentTags,
        documentCollaborators,
        documentAuthorizers,
        documentRecipients,
        documentPath,
        documentNote,
        status,
        id,
        latestAction,
        documentLogs,
        createdBy,
        updatedBy,
        memoId,
        createdAt,
        updatedAt,
      } = rawData;

      setDataLogHistory(documentLogs);

      setDataInfo([
        {
          createdBy: `${createdBy?.firstName} ${createdBy?.lastName}`,
          createdAt: createdAt,
          updatedBy: updatedBy ? `${updatedBy?.firstName} ${updatedBy?.lastName}` : "",
          updatedAt: updatedAt,
          id: id,
          createdByAvatarPath: createdBy?.avatarPath,
          updatedByAvatarPath: updatedBy?.avatarPath,
        },
      ]);

      setValue("document_name", documentName);
      setValue("memoId", memoId);
      setValue("latestAction", latestAction);
      setValue("id", id);
      setValue("document_number", documentNumber);
      setValue("text_remarks", textRemarks);
      setValue("numeric_remarks", numericRemarks);
      setValue("document_path", documentPath);
      setValue("document_note", documentNote);
      setValue("status", status);
      setValue(
        "document_tag_id",
        documentTags.map((itemTag: DocumentTagsType) => itemTag.masterDocumentTagId)
      );
      setValue(
        "document_collaborator_id",
        documentCollaborators.map(
          (itemCollaborator: DocumentCollaboratorsType) => itemCollaborator.userId
        )
      );
      setValue(
        "document_authorizer_id",
        documentAuthorizers.map((itemAuthorizer: DocumentAuthorizersType) => itemAuthorizer.userId)
      );
      setValue(
        "document_recipient_id",
        documentRecipients.map((itemRecipient: DocumentRecipientsType) => itemRecipient.userId)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDocument]);

  const { mutate: updateApproveRejectProcess, isPending: isPendingApproveRejectProcess } =
    useDocumentApproveRejectProcess({
      id: id[1],
      action: useActionApproveRejectProcess(stateApproveAndRejectModal.type),
      options: {
        onSuccess: (res: any) => {
          if (res?.status === 200) {
            messageApi.open({
              type: "success",
              content: "Success " + stateApproveAndRejectModal.type,
            });

            resetApproveRejectEdit();

            setStateApproveAndRejectModal({
              data: null,
              open: false,
              type: "",
            });

            router.back();
          }
        },
      },
    });

  const columnsLogHistory: TableProps<DataTypeActionHistory>["columns"] = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (text: string, record: DataTypeActionHistory, index: number) => {
        return (
          <Text
            label={String(dataLogHistory.length - index)}
            className="text-base font-normal text-black"
          />
        );
      },
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text: UserType) => {
        return (
          <div className="gap-2 flex items-center">
            <ImageNext
              src={text.avatarPath || "/placeholder-profile.png"}
              width={32}
              height={32}
              alt="logo-klikyou"
              priority
              className="h-[32px] w-[32px] rounded-full object-cover"
            />
            <Text
              label={`${text.firstName} ${text.lastName}`}
              className="text-base font-normal text-black"
            />
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: string) => {
        return (
          <Text
            label={text}
            className={`text-base inline-block font-normal text-white py-1 px-2 rounded-full ${UseBgColorAction(
              text
            )}`}
          />
        );
      },
    },
    {
      title: "Note",
      dataIndex: "supportingDocumentNote",
      key: "supportingDocumentNote",
      render: (text: string, record: DataTypeActionHistory) => {
        return (
          <div
            onClick={() =>
              setStateViewNoteAndFileVersionModal({
                open: true,
                data: record,
              })
            }
            className="flex items-center gap-2 cursor-pointer"
          >
            <OpenIcon
              style={{
                height: 32,
                width: 32,
                color: "#2166E9",
              }}
            />

            <Text label={text} className="text-base font-normal text-black" />
          </div>
        );
      },
    },
    {
      title: "Supporting File",
      dataIndex: "supportingDocumentPath",
      key: "supportingDocumentPath",
      render: (text: string) => {
        if (!text) {
          return;
        }
        return (
          <div
            onClick={() => text && window.open(text, "_blank")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <DownloadIcon
              style={{
                height: 32,
                width: 32,
                color: "#2166E9",
              }}
            />

            <Text label="Download" className="text-base font-normal text-link" />
          </div>
        );
      },
    },
    {
      title: "File version history",
      dataIndex: "versionHistoryDocumentPath",
      key: "versionHistoryDocumentPath",
      render: (text: string) => {
        const fileName = text?.split("/").pop();
        if (!text) {
          return;
        }

        return (
          <div
            onClick={() => text && window.open(text, "_blank")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FileIcon
              style={{
                height: 32,
                width: 32,
                color: "#2166E9",
              }}
            />

            <Text label={String(fileName)} className="text-base font-normal text-link" />
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

  const columnsInfo: ColumnsType<DataInfoDocumentType> = [
    {
      title: "Created by",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text: string, record: DataInfoDocumentType) => {
        return (
          <div className="gap-2 flex items-center">
            <ImageNext
              src={record.createdByAvatarPath || "/placeholder-profile.png"}
              width={32}
              height={32}
              alt="logo-klikyou"
              className="h-[32px] w-[32px] rounded-full object-cover"
              priority
            />
            <Text label={text} className="text-base font-normal text-black" />
          </div>
        );
      },
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: Date) => UseConvertDateFormat(text),
    },
    {
      title: "Updated by",
      dataIndex: "updatedBy",
      key: "updatedBy",
      render: (text: string, record: DataInfoDocumentType) => {
        return (
          <div className="gap-2 flex items-center">
            <ImageNext
              src={record.updatedByAvatarPath || "/placeholder-profile.png"}
              width={32}
              height={32}
              alt="logo-klikyou"
              className="h-[32px] w-[32px] rounded-full object-cover"
              priority
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

  const onSubmitApproveRejectEdit = (data: FormApproveRejectProcessValues) => {
    const { supporting_document_note, supporting_document_path } = data;

    let formdata = new FormData();

    formdata.append("supporting_document_note", supporting_document_note);
    formdata.append("supporting_document_path", supporting_document_path?.file.originFileObj);

    updateApproveRejectProcess(formdata);
  };

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

      <div className="flex gap-4 items-center my-4">
        <Button
          type="button"
          onClick={() =>
            setStateApproveAndRejectModal({
              open: true,
              data: null,
              type: "process",
            })
          }
          label="Mark as Processed"
          icon={
            <PeopleCheckIcon
              style={{
                height: 32,
                width: 32,
                color: "white",
              }}
            />
          }
          className="text-white gap-2 flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold shadow-sm bg-primary-purple hover:bg-primary/70 active:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      </div>

      <div className="gap-6 flex">
        <div className="w-1/2">
          <Text label="Document info" className="mt-6 text-xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                {Object.keys(getValues())
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
                        "latestAction",
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

                    const valueMap: any = getValues();

                    return (
                      <div className="mb-6" key={mapping}>
                        <Text
                          label={labelMap[mapping]}
                          className="text-xl font-semibold text-black"
                        />
                        {mapping === "document_tag_id" ? (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {dataTag
                              ?.filter((filteringTag: DefaultOptionType) =>
                                valueMap.document_tag_id.includes(filteringTag.value)
                              )
                              .map((item: DefaultOptionType) => (
                                <Text
                                  key={String(item.label)}
                                  label={String(item.label)}
                                  className="text-base font-normal text-white rounded-full py-2 px-4 bg-gray-dark"
                                />
                              ))}
                          </div>
                        ) : (
                          <Text
                            label={valueMap[mapping]}
                            className={`${
                              mapping === "status"
                                ? `inline-block text-white rounded-full py-2 px-4 ${UseBgColorStatus(
                                    valueMap[mapping]
                                  )}`
                                : "text-black"
                            } text-base font-normal`}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>

              <div className="w-1/2">
                {Object.keys(getValues())
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
                      latestAction: "Latest action",
                    };

                    const valueMap: any = getValues();

                    return (
                      <div className="mb-6" key={mapping}>
                        <Text
                          label={labelMap[mapping]}
                          className="text-xl font-semibold text-black"
                        />
                        {mapping === "document_collaborator_id" ? (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {dataCollaborator
                              ?.filter((filteringTag: DefaultOptionType) =>
                                valueMap.document_collaborator_id.includes(filteringTag.value)
                              )
                              .map((item: DefaultOptionType) => (
                                <Text
                                  key={String(item.label)}
                                  label={String(item.label)}
                                  className="text-base font-normal text-white rounded-full py-2 px-4 bg-gray-dark"
                                />
                              ))}
                          </div>
                        ) : (
                          <Text
                            label={valueMap[mapping]}
                            className={`${
                              mapping === "latestAction"
                                ? `inline-block text-white rounded-full py-2 px-4 ${UseBgColorAction(
                                    valueMap[mapping]
                                  )}`
                                : "text-black"
                            } text-base font-normal`}
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

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <div className="mb-6">
                  <Text
                    label="Latest document file"
                    className="mb-2 text-lg font-semibold text-black"
                  />
                  <Link rel="noopener noreferrer" target="_blank" href={getValues("document_path")}>
                    {getValues("document_path")?.file?.name
                      ? getValues("document_path")?.file?.name
                      : getValues("document_path")?.split("/").pop()}
                  </Link>
                </div>
              </div>

              <div className="w-1/2">
                {Object.keys(getValues())
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
                        "latestAction",
                      ].includes(filtering)
                  )
                  .map((mapping) => {
                    const labelMap: any = {
                      document_authorizer_id: "Authorizers",
                    };

                    const valueMap: any = getValues();

                    return (
                      <div className="mb-6" key={mapping}>
                        <Text
                          label={labelMap[mapping]}
                          className="text-xl font-semibold text-black"
                        />
                        {mapping === "document_authorizer_id" ? (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {dataAuthorizer
                              ?.filter((filteringTag: DefaultOptionType) =>
                                valueMap.document_authorizer_id.includes(filteringTag.value)
                              )
                              .map((item: DefaultOptionType) => (
                                <Text
                                  key={String(item.label)}
                                  label={String(item.label)}
                                  className="text-base font-normal text-white rounded-full py-2 px-4 bg-gray-dark"
                                />
                              ))}
                          </div>
                        ) : (
                          <Text
                            label={valueMap[mapping]}
                            className={`${
                              mapping === "status"
                                ? `inline-block text-white rounded-full py-2 px-4 ${UseBgColorStatus(
                                    valueMap[mapping]
                                  )}`
                                : "text-black"
                            } text-base font-normal`}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <Text label="Recipients and process" className="mt-6 text-xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                {Object.keys(getValues())
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
                        "document_note",
                        "document_authorizer_id",
                        "latestAction",
                      ].includes(filtering)
                  )
                  .map((mapping) => {
                    const labelMap: any = {
                      document_recipient_id: "Recipients",
                    };

                    const valueMap: any = getValues();

                    return (
                      <div className="mb-6" key={mapping}>
                        <Text
                          label={labelMap[mapping]}
                          className="text-xl font-semibold text-black"
                        />
                        {mapping === "document_recipient_id" ? (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {dataRecipient
                              ?.filter((filteringTag: DefaultOptionType) =>
                                valueMap.document_recipient_id.includes(filteringTag.value)
                              )
                              .map((item: DefaultOptionType) => (
                                <Text
                                  key={String(item.label)}
                                  label={String(item.label)}
                                  className="text-base font-normal text-white rounded-full py-2 px-4 bg-gray-dark"
                                />
                              ))}
                          </div>
                        ) : (
                          <Text
                            label={valueMap[mapping]}
                            className={`${
                              mapping === "status"
                                ? `inline-block text-white rounded-full py-2 px-4 ${UseBgColorStatus(
                                    valueMap[mapping]
                                  )}`
                                : "text-black"
                            } text-base font-normal`}
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
                    disabled={
                      !["Fully approved", "Fully processed"]?.includes(
                        getValues("status") as string
                      )
                    }
                    onClick={() => window.open(`/certificate/${id[1]}`, "_blank")}
                    label="Certificate"
                    icon={<ProtectIcon />}
                    className={`${
                      ["Fully approved", "Fully processed"]?.includes(getValues("status") as string)
                        ? "bg-primary-blue"
                        : "bg-primary-gray"
                    } cursor-pointer gap-2 flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  />
                </div>
              )}
              columns={columnsLogHistory}
              dataSource={dataLogHistory}
              scroll={{ x: 1500 }}
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

      {/* Notes and file version history */}
      <Modal
        title="Note detail"
        open={stateViewNoteAndFileVersionModal.open}
        onCancel={() => {
          setStateViewNoteAndFileVersionModal({
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
                  setStateViewNoteAndFileVersionModal({
                    open: false,
                    data: null,
                  });
                }}
                label="Cancel"
                className="flex border border-primary-blue justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-primary-blue shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
          </div>
        }
      >
        <div>
          <div className="mb-6">
            <Text label="Note" className="text-xl font-semibold text-black" />
            <Text
              label={stateViewNoteAndFileVersionModal?.data?.supportingDocumentNote}
              className="text-base font-normal text-black"
            />
          </div>

          <div className="mb-6">
            <Text label="Supporting files" className="mb-2 text-lg font-semibold text-black" />

            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={stateViewNoteAndFileVersionModal?.data?.supportingDocumentPath || ""}
            >
              {stateViewNoteAndFileVersionModal?.data?.supportingDocumentPath?.split("/").pop()}
            </Link>
          </div>
        </div>
      </Modal>

      <Modal
        title={`${stateApproveAndRejectModal.type === "process" ? "Process" : ""} document`}
        open={stateApproveAndRejectModal.open}
        onCancel={() => {
          resetApproveRejectEdit();
          setStateApproveAndRejectModal({
            open: false,
            data: null,
            type: "",
          });
        }}
        footer={
          <div className="flex justify-end items-center">
            <div className="flex gap-4 items-center">
              <Button
                type="button"
                disabled={isPendingApproveRejectProcess}
                loading={isPendingApproveRejectProcess}
                onClick={() => {
                  resetApproveRejectEdit();
                  setStateApproveAndRejectModal({
                    open: false,
                    data: null,
                    type: "",
                  });
                }}
                label="Cancel"
                className="flex border border-primary-blue justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-primary-blue shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />

              <Button
                type="button"
                disabled={isPendingApproveRejectProcess || isUploadFile}
                loading={isPendingApproveRejectProcess || isUploadFile}
                onClick={handleSubmitApproveRejectEdit(onSubmitApproveRejectEdit)}
                label={
                  isPendingApproveRejectProcess || isUploadFile ? "Loading..." : "Mark as Processed"
                }
                icon={
                  <PeopleCheckIcon
                    style={{
                      height: 32,
                      width: 32,
                      color: "white",
                    }}
                  />
                }
                className="flex gap-2 justify-center items-center rounded-md bg-primary-purple px-6 py-1.5 text-lg font-semibold text-white hover:bg-primary-purple/70 active:bg-primary-purple/90"
              />
            </div>
          </div>
        }
      >
        <div>
          <div className="mb-6">
            <Controller
              control={controlApproveRejectEdit}
              name="supporting_document_note"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <InputTextArea
                  onChange={onChange}
                  error={error}
                  onBlur={onBlur}
                  value={value}
                  name="supporting_document_note"
                  placeholder="Enter note"
                  classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                  classNameLabel="block text-xl font-semibold text-black"
                  label="Note"
                />
              )}
            />
          </div>

          <div>
            <Text
              label="Upload supporting files"
              className="mb-2 text-lg font-semibold text-black"
            />

            <Controller
              control={controlApproveRejectEdit}
              name="supporting_document_path"
              render={({ field: { onChange }, fieldState: { error } }) => (
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
                      name="supporting_document_path"
                      headers={{
                        authorization: "authorization-text",
                      }}
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
              )}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
