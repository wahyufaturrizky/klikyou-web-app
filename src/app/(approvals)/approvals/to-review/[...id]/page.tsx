"use client";
import { DataDocumentsType } from "@/app/documents/page";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Text from "@/components/Text";
import UseDateTimeFormat from "@/hook/useDateFormat";
import { useDocumentById } from "@/services/document/useDocument";
import { useToReviewById } from "@/services/to-view/useToReview";
import { BackIcon, CheckIcon, DownloadIcon, OpenIcon, ProtectIcon, RejectIcon } from "@/style/icon";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button as ButtonAntd,
  ConfigProvider,
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
import { useForm } from "react-hook-form";

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

  const [isEdit, setIsEdit] = useState<boolean>(id[0] === "view" ? false : true);

  const [dataById, setDataById] = useState<DataDocumentsType>();

  const { setValue, watch } = useForm<FormDocumentValues>({
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

  const { data: dataToReviewById, isPending: isPendingToReviewById } = useToReviewById({
    id: id[1],
  });

  useEffect(() => {
    if (dataToReviewById) {
      setDataById(
        dataToReviewById.data.data.map((item: DataDocumentsType) => ({
          ...item,
          key: item.id,
        }))
      );
    }
  }, [dataToReviewById]);

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
      {isPendingToReviewById && <Spin fullscreen />}

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
          onClick={() => {}}
          label="Approve"
          icon={
            <CheckIcon
              style={{
                height: 32,
                width: 32,
                color: "white",
              }}
            />
          }
          className="text-white gap-2 flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold shadow-sm bg-green hover:bg-green/70 active:bg-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />

        <Button
          type="button"
          onClick={() => {}}
          label="Reject"
          icon={
            <RejectIcon
              style={{
                color: "white",
                height: 32,
                width: 32,
              }}
            />
          }
          className="text-white gap-2 flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold shadow-sm bg-red hover:bg-red/70 active:bg-red/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      </div>

      <div className="gap-6 flex">
        <div className="w-1/2">
          <Text label="Document info" className="mt-6 text-xl font-bold text-black" />

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
    </div>
  );
}
