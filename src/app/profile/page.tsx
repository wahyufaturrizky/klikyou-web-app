"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Text from "@/components/Text";
import UseDateTimeFormat from "@/hook/useDateFormat";
import { PencilIcon } from "@/style/icon";
import { Table, TableProps, ConfigProvider } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormProfileValues = {
  imgProfile: string;
  firstName: string;
  lastName: string;
  tags: string[];
  role: string[];
  username: string;
  email: string;
};

interface DataType {
  key: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export default function ProfilePage() {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { watch } = useForm<FormProfileValues>({
    defaultValues: {
      imgProfile: "/placeholder-profile.png",
      firstName: "",
      lastName: "",
      tags: ["Text1", "Text2", "Text3"],
      role: ["Text1", "Text2", "Text3"],
      username: "",
      email: "",
    },
  });

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text: string) => text,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: Date) => UseDateTimeFormat(text),
    },
    {
      title: "Updated By",
      dataIndex: "updatedBy",
      key: "updatedBy",
      render: (text: string) => text,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text: Date) => UseDateTimeFormat(text),
    },
  ];

  const data: DataType[] = [
    {
      key: "1",
      createdBy: "Zayn Malik",
      createdAt: new Date(),
      updatedBy: "Edward Timothy",
      updatedAt: new Date(),
    },
  ];

  return (
    <div>
      <Text label="Profile detail" className="text-3xl font-normal text-secondary-blue" />
      <Button
        type="button"
        onClick={() => setIsEdit(!isEdit)}
        label="Edit"
        icon={<PencilIcon />}
        className="mt-6 flex justify-center items-center rounded-md bg-primary-blue px-6 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      />

      <div className="gap-6 flex">
        <div className="w-1/2">
          <Text label="User info" className="mt-6 text-2xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex">
              <div className="w-1/2">
                <Text label="Profile photo" className="text-xl font-semibold text-black" />

                <div className="flex justify-center">
                  <ImageNext
                    src="/placeholder-profile.png"
                    width={180}
                    height={180}
                    alt="logo-klikyou"
                    className="mx-auto h-auto w-auto"
                  />
                </div>
              </div>

              <div className="w-1/2">
                {Object.keys(watch())
                  .filter((filtering) => !["imgProfile", "username", "email"].includes(filtering))
                  .map((mapping) => {
                    const labelMap: any = {
                      firstName: "First name",
                      lastName: "Last name",
                      tags: "Tags",
                      role: "Role",
                    };

                    const valueMap: any = watch();

                    return (
                      <div className="mb-6" key={mapping}>
                        <Text
                          label={labelMap[mapping]}
                          className="text-xl font-semibold text-black"
                        />
                        {mapping === "tags" || mapping === "role" ? (
                          <div className="flex gap-2 flex-warp mt-2">
                            {valueMap[mapping].map((item: string) => (
                              <Text
                                key={item}
                                label={item}
                                className="text-base font-normal text-white rounded-full py-2 px-4 bg-[#455C72]"
                              />
                            ))}
                          </div>
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
          <Text label="Account info" className="mt-6 text-2xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="flex">
              <div className="w-1/2">
                <Text label="Username " className="text-xl font-semibold text-black" />

                <Text label="superadmin" className="text-base font-normal text-black" />
              </div>

              <div className="w-1/2">
                <Text label="Email address" className="text-xl font-semibold text-black" />

                <Text
                  label="superadmin@goforward.com"
                  className="text-base font-normal text-black"
                />
              </div>
            </div>
          </div>
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
            <Table columns={columns} dataSource={data} pagination={false} />
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
}
