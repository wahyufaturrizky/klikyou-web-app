"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import InputTextArea from "@/components/InputTextArea";
import Select from "@/components/Select";
import Text from "@/components/Text";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import { TagType, UserType } from "@/interface/common";
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
import { useDocumentById, useUpdateDocument } from "@/services/document/useDocument";
import { useUserList } from "@/services/user-list/useUserList";
import {
  BackIcon,
  DownloadIcon,
  FileIcon,
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
  message,
  UploadFile,
} from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UseBgColorStatus } from "@/hook/useBgColorStatus";
import { UseBgColorAction } from "@/hook/useBgColorAction";

export default function ViewEditDocumentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [dataTag, setDataTag] = useState<DefaultOptionType[]>([]);
  const [dataInfo, setDataInfo] = useState<DataInfoDocumentType[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dataLogHistory, setDataLogHistory] = useState<DataTypeActionHistory[]>([]);

  const [dataCollaborator, setDataCollaborator] = useState<DefaultOptionType[]>([]);
  const [dataAuthorizer, setDataAuthorizer] = useState<DefaultOptionType[]>([]);
  const [dataRecipient, setDataRecipient] = useState<DefaultOptionType[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const [isEdit, setIsEdit] = useState<boolean>(id[0] === "view" ? false : true);

  const [stateEditDocumentInfoModal, setStateEditDocumentInfoModal] = useState<EditDocumentsModal>({
    open: false,
    data: null,
  });

  const [stateEditFileAndAuthModal, setStateEditFileAndAuthModal] = useState<EditDocumentsModal>({
    open: false,
    data: null,
  });

  const [stateEditRecipientAndProcessModal, setStateEditRecipientAndProcessModal] =
    useState<EditDocumentsModal>({
      open: false,
      data: null,
    });

  const { control, handleSubmit, setValue, watch, getValues } = useForm<FormDocumentValues>({
    defaultValues: {
      document_name: "",
      memoId: "",
      document_number: "",
      id: "",
      text_remarks: "",
      numeric_remarks: "",
      status: "",
      document_tag_id: [],
      action: "",
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
        refetchDocumentId();

        messageApi.open({
          type: "success",
          content: "Update document success",
        });

        setStateEditDocumentInfoModal({
          open: false,
          data: null,
        });

        setStateEditFileAndAuthModal({
          open: false,
          data: null,
        });

        setStateEditRecipientAndProcessModal({
          open: false,
          data: null,
        });
      },
    },
  });

  const onSubmit = (data: FormDocumentValues) => {
    delete data.status;
    delete data.id;
    delete data.action;

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
    formdata.append(
      "document_path",
      document_path?.file?.originFileObj ? document_path.file.originFileObj : document_path
    );
    formdata.append("document_tag_id", document_tag_id.join(","));
    formdata.append("document_collaborator_id", document_collaborator_id.join(","));
    formdata.append("document_authorizer_id", document_authorizer_id.join(","));
    formdata.append("document_recipient_id", document_recipient_id.join(","));

    updateDocument(formdata);
  };

  const {
    data: dataDocument,
    isPending: isPendingDocument,
    refetch: refetchDocumentId,
  } = useDocumentById({
    id: id[1],
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
        action,
        documentLogs,
        createdBy,
        updatedBy,
        memoId,
      } = rawData;

      setDataLogHistory(documentLogs);

      setDataInfo([
        {
          createdBy: createdBy?.username,
          createdAt: createdBy?.createdAt,
          updatedBy: updatedBy?.username,
          updatedAt: updatedBy?.updatedAt,
          id: id,
          createdByAvatarPath: createdBy?.avatarPath,
          updatedByAvatarPath: updatedBy?.avatarPath,
        },
      ]);

      setValue("document_name", documentName);
      setValue("memoId", memoId);
      setValue("action", action);
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

  const columnsLogHistory: TableProps<DataTypeActionHistory>["columns"] = [
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
              className="h-[32px] w-[32px] rounded-full"
            />
            <Text label={text.username} className="text-base font-normal text-black" />
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: string) => {
        let bgColorAction = "";

        if (text?.includes("Rejected")) {
          bgColorAction = "bg-red";
        } else if (text?.includes("Approved")) {
          bgColorAction = "bg-green";
        } else if (text?.includes("Updated")) {
          bgColorAction = "bg-warn";
        } else if (text?.includes("Uploaded")) {
          bgColorAction = "bg-link";
        } else if (text?.includes("pending")) {
          bgColorAction = "bg-link";
        }

        return (
          <Text
            label={text}
            className={`text-base inline-block font-normal text-white py-1 px-2 rounded-full ${bgColorAction}`}
          />
        );
      },
    },
    {
      title: "Note",
      dataIndex: "supportingDocumentNote",
      key: "supportingDocumentNote",
      render: (text: string) => {
        return (
          <div className="flex items-center gap-2 cursor-pointer">
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
        return (
          <div
            onClick={() => window.open(text, "_blank")}
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
        return (
          <div
            onClick={() => window.open(text, "_blank")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FileIcon
              style={{
                height: 32,
                width: 32,
                color: "#2166E9",
              }}
            />

            <Text label={text} className="text-base font-normal text-link" />
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
              className="h-[32px] w-[32px] rounded-full"
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
              className="h-[32px] w-[32px] rounded-full"
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
                        "action",
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
                      action: "Latest action",
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
                              mapping === "action"
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
                  <Link rel="noopener noreferrer" target="_blank" href={getValues("document_path")}>
                    {getValues("document_path")}
                  </Link>
                </div>

                <Text label="Note" className="text-xl font-semibold text-black" />
                <Text
                  label={getValues("document_note")}
                  className="text-base font-normal text-black"
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
                        "action",
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
                        "document_note",
                        "document_authorizer_id",
                        "action",
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
                    disabled
                    onClick={() => setIsEdit(!isEdit)}
                    label="Certificate"
                    icon={<ProtectIcon />}
                    className="gap-2 flex justify-center items-center rounded-md bg-primary-gray px-6 py-1.5 text-lg font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                onClick={handleSubmit(onSubmit)}
                label="Yes"
                loading={isPendingUpdateDocument}
                disabled={isPendingUpdateDocument}
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
                  options={dataTag}
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
                  options={dataCollaborator}
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

      {/* Update file and authorizers */}

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
                onClick={handleSubmit(onSubmit)}
                label="Yes"
                loading={isPendingUpdateDocument}
                disabled={isPendingUpdateDocument}
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
                        headers={{
                          authorization: "authorization-text",
                        }}
                        onChange={(info) => {
                          setFileList(info.fileList);
                          if (info.file.status !== "uploading") {
                            console.log(info.file, info.fileList);
                          }
                          if (info.file.status === "done") {
                            onChange(info);
                            message.success(`${info.file.name} file uploaded successfully`);
                          } else if (info.file.status === "error") {
                            message.error(`${info.file.name} file upload failed.`);
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
                  onChange={onChange}
                  options={dataAuthorizer}
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
      </Modal>

      {/* Update recipients and process */}

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
                loading={isPendingUpdateDocument}
                disabled={isPendingUpdateDocument}
                type="button"
                onClick={handleSubmit(onSubmit)}
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
                  options={dataRecipient}
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
