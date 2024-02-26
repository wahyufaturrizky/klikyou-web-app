"use client";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Text from "@/components/Text";
import { FormValueInternalPageType } from "@/interface/internal-page.interface";
import { useInternalPage, useUpdateInternalPage } from "@/services/internal-page/useInternalPage";
import { Spin, message } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export default function InternalPage() {
  const [messageApi, contextHolder] = message.useMessage();

  const { control, handleSubmit, setValue } = useForm<FormValueInternalPageType>({
    defaultValues: {
      status: "",
    },
  });

  const {
    data: dataInternalPage,
    refetch: refetchInternalPage,
    isPending: isPendingInternalPage,
  } = useInternalPage({
    options: {
      refetchOnWindowFocus: false,
    },
  });

  const { mutate: updateInternalPage, isPending: isPendingUpdateInternalPage } =
    useUpdateInternalPage({
      options: {
        onSuccess: (res: any) => {
          if (res?.status) {
            refetchInternalPage();

            messageApi.open({
              type: "success",
              content: "Success update internal page",
            });
          }
        },
      },
    });

  const onSubmit = (data: FormValueInternalPageType) => {
    updateInternalPage(data);
  };

  useEffect(() => {
    if (dataInternalPage) {
      const { data } = dataInternalPage.data;

      setValue("status", data.status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataInternalPage]);

  const optionInternalPage = [
    {
      label: "Active",
      value: "Active",
    },
    {
      label: "Inactive",
      value: "Inactive",
    },
  ];

  return (
    <div className="p-6">
      {contextHolder}
      {isPendingInternalPage && <Spin fullscreen />}
      <div className="flex gap-4 items-center">
        <Text
          label="Change internal setting"
          className="text-3xl font-normal text-secondary-blue"
        />
      </div>

      <div className="gap-6 flex">
        <div className="w-1/2">
          <Text label="Access & features settings" className="mt-6 text-2xl font-bold text-black" />

          <div className="p-6 bg-white rounded-md mt-6">
            <div className="mb-6">
              <Controller
                control={control}
                rules={{
                  required: "status is required",
                }}
                name="status"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    name="status"
                    mode="multiple"
                    options={optionInternalPage}
                    onChange={onChange}
                    value={value}
                    error={error}
                    styleSelect={{ width: "100%" }}
                    label="Status"
                    classNameLabel="block text-lg font-semibold text-black"
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center mt-6">
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          label={isPendingUpdateInternalPage ? "Loading..." : "Update"}
          disabled={isPendingUpdateInternalPage}
          loading={isPendingUpdateInternalPage}
          className="flex justify-center items-center rounded-md px-6 py-1.5 text-lg font-semibold text-white shadow-sm bg-primary-blue hover:bg-primary-blue/70 active:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      </div>
    </div>
  );
}
