"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import InputTextArea from "@/components/InputTextArea";
import Select from "@/components/Select";
import Text from "@/components/Text";
import { UseBgColorAction } from "@/hook/useBgColorAction";
import { UseBgColorStatus } from "@/hook/useBgColorStatus";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import useDebounce from "@/hook/useDebounce";
import { UserType } from "@/interface/common";
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
  ResUpdateDocumentType,
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
  UploadFile,
  message,
} from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ViewEditDocumentPage({ params }: Readonly<{ params: { id: string } }>) {
  const router = useRouter();
  const { id } = params;

  const [dataTag, setDataTag] = useState<DefaultOptionType[] | undefined>([]);
  const [dataInfo, setDataInfo] = useState<DataInfoDocumentType[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [isUploadFile, setIsUploadFile] = useState<boolean>(false);

  const [searchTagDocument, setSearchTagDocument] = useState<string>("");
  const [searchCollaboratorDocument, setSearchCollaboratorDocument] = useState<string>("");
  const [searchSearchRecipientDocumentDocument, setSearchSearchRecipientDocumentDocument] =
    useState<string>("");
  const [searchSearchAuthorizerDocumentDocument, setSearchSearchAuthorizerDocumentDocument] =
    useState<string>("");

  const [dataLogHistory, setDataLogHistory] = useState<DataTypeActionHistory[]>([]);

  const [dataCollaborator, setDataCollaborator] = useState<DefaultOptionType[]>([]);
  const [dataAuthorizer, setDataAuthorizer] = useState<DefaultOptionType[]>([]);
  const [dataRecipient, setDataRecipient] = useState<DefaultOptionType[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const debounceSearchTagDocument = useDebounce(searchTagDocument, 800);
  const debounceSearchCollaboratorDocument = useDebounce(searchCollaboratorDocument, 800);
  const debounceSearchRecipientDocument = useDebounce(searchSearchRecipientDocumentDocument, 800);
  const debounceSearchAuthorizerDocument = useDebounce(searchSearchAuthorizerDocumentDocument, 800);

  const [stateEditDocumentInfoModal, setStateEditDocumentInfoModal] = useState<EditDocumentsModal>({
    open: false,
    data: null,
  });

  const [stateEditFileAndAuthModal, setStateEditFileAndAuthModal] = useState<EditDocumentsModal>({
    open: false,
    data: null,
  });

  const [stateViewNoteAndFileVersionModal, setStateViewNoteAndFileVersionModal] =
    useState<EditDocumentsModal>({
      open: false,
      data: null,
    });

  const [stateEditRecipientAndProcessModal, setStateEditRecipientAndProcessModal] =
    useState<EditDocumentsModal>({
      open: false,
      data: null,
    });

  const { control, handleSubmit, setValue, getValues } = useForm<FormDocumentValues>({
    defaultValues: {
      document_name: "",
      memoId: "",
      document_number: "",
      id: 0,
      text_remarks: "",
      numeric_remarks: 0,
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
        dataListTag?.data.data.data.map((itemTag: DataDocumentTags) => ({
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

  const { mutate: updateDocument, isPending: isPendingUpdateDocument } = useUpdateDocument({
    id: id[1],
    options: {
      onSuccess: (res: ResUpdateDocumentType) => {
        if (res.status === 200) {
          refetchDocumentId();
          setSearchTagDocument("");
          setSearchCollaboratorDocument("");
          setSearchSearchRecipientDocumentDocument("");
          setSearchSearchAuthorizerDocumentDocument("");

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
        }
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
    formdata.append("numeric_remarks", String(numeric_remarks));
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
    isRefetching: isRefetchingDocumentId,
  } = useDocumentById({
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
        status,
        id,
        action,
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
      setValue("action", action);
      setValue("id", id);
      setValue("document_number", documentNumber);
      setValue("text_remarks", textRemarks);
      setValue("numeric_remarks", numericRemarks);
      setValue("document_path", documentPath);
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

  const isLoading = isPendingDocument || isRefetchingDocumentId;

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
                      action: "Latest action",
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
                        "action",
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
                        "action",
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
                    disabled={!getValues("status")?.includes("Fully approved")}
                    onClick={() => window.open(`/certificate/${id[1]}`, "_blank")}
                    label="Certificate"
                    icon={<ProtectIcon />}
                    className={`${
                      getValues("status")?.includes("Fully approved")
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

      {/* Edit Document Info Modal */}

      <Modal
        title="Edit document info"
        open={stateEditDocumentInfoModal.open}
        onCancel={() => {
          refetchDocumentId();
          setSearchTagDocument("");
          setSearchCollaboratorDocument("");
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
                  refetchDocumentId();
                  setSearchTagDocument("");
                  setSearchCollaboratorDocument("");
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
                  required
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
                  required
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
                  onBlur={() => {
                    setSearchTagDocument("");
                  }}
                  onChange={onChange}
                  onSearch={(val: string) => setSearchTagDocument(val)}
                  tokenSeparators={[","]}
                  notFoundContent={isPendingTag ? <Spin size="small" /> : null}
                  filterOption={false}
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
                  notFoundContent={isPendingCollaboratorDocument ? <Spin size="small" /> : null}
                  filterOption={false}
                  onBlur={() => {
                    setSearchCollaboratorDocument("");
                  }}
                  onSearch={(val: string) => setSearchCollaboratorDocument(val)}
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
          refetchDocumentId();
          setSearchSearchAuthorizerDocumentDocument("");
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

                  setSearchSearchAuthorizerDocumentDocument("");

                  refetchDocumentId();
                }}
                label="Cancel"
                className="flex border border-primary-blue justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-primary-blue shadow-sm hover:bg-white/70 active:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />

              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                label={isPendingUpdateDocument || isUploadFile ? "Loading..." : "Yes"}
                loading={isPendingUpdateDocument || isUploadFile}
                disabled={isPendingUpdateDocument || isUploadFile}
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
                          setIsUploadFile(true);
                          setFileList(info?.fileList);
                          if (info.file.status !== "uploading") {
                            console.log(info.file, info.fileList);
                          }
                          if (info.file.status === "done") {
                            onChange(info);
                            message.success(`${info.file.name} file uploaded successfully`);

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

      {/* Update recipients and process */}

      <Modal
        title="Update recipients and process"
        open={stateEditRecipientAndProcessModal.open}
        onCancel={() => {
          setStateEditRecipientAndProcessModal({
            open: false,
            data: null,
          });

          refetchDocumentId();

          setSearchSearchRecipientDocumentDocument("");
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
                  refetchDocumentId();

                  setSearchSearchRecipientDocumentDocument("");
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
      </Modal>
    </div>
  );
}
