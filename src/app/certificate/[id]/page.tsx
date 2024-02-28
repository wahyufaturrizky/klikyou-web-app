"use client";
import ImageNext from "@/components/Image";
import Text from "@/components/Text";
import UseConvertDateFormat from "@/hook/useConvertDateFormat";
import {
  DocumentAuthorizersType,
  DocumentCollaboratorsType,
  DocumentRecipientsType,
  DocumentTagsType,
  FormDocumentValues,
} from "@/interface/documents.interface";
import { useDocumentById } from "@/services/document/useDocument";
import { CheckIcon } from "@/style/icon";
import { Spin } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

// Author, Software Architect, Software Engineer, Software Developer : https://www.linkedin.com/in/wahyu-fatur-rizky

export default function ViewEditDocumentPage({ params }: Readonly<{ params: { id: string } }>) {
  const { id } = params;

  const { setValue, watch } = useForm<FormDocumentValues>({
    defaultValues: {
      document_name: "",
      document_number: "",
      memoId: "",
      id: undefined,
      text_remarks: "",
      numeric_remarks: undefined,
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

  const { data: dataDocument, isPending: isPendingDocument } = useDocumentById({
    id: Number(id),
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
        memoId,
      } = rawData;

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

  const isLoading = isPendingDocument;

  return (
    <section>
      {isLoading && <Spin fullscreen />}
      <div className="flex min-h-full flex-1 flex-col justify-start px-6 py-12 lg:px-8 bg-gradient-certificate bg-center h-lvh overflow-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <ImageNext
            src="/logo-klikyou.svg"
            width={406}
            height={139}
            priority
            alt="logo-klikyou"
            className="mx-auto h-auto w-[270px] object-cover"
          />

          <Text
            label="Verifikasi Persetujuan Elektronik"
            className="mt-10 text-center text-2xl font-semibold text-black"
          />

          <Text
            label="Digital approval verification"
            className="mt-2 text-center text-base font-light italic text-black"
          />

          <Text
            label="PT. KlikYou mentakan bahwa:"
            className="mt-10 text-center text-2xl font-light text-black"
          />

          <Text
            label="PT. KlikYou states that"
            className="mt-2 text-center text-base font-light italic text-black"
          />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl bg-white rounded-md p-6 shadow-xl border">
          <div className="space-y-6">
            {Object.keys(watch())
              .filter(
                (filtering) =>
                  ![
                    "document_authorizer_id",
                    "document_recipient_id",
                    "document_path",
                    "text_remarks",
                    "status",
                    "document_tag_id",
                    "document_note",
                    "id",
                    "numeric_remarks",
                    "latestApproval",
                    "document_collaborator_id",
                    "action",
                  ].includes(filtering)
              )
              .map((mapping) => {
                const labelMap: any = {
                  document_name: {
                    id: "Nama dokumen",
                    en: "Document name",
                  },
                  document_number: {
                    id: "Nomor dokumen",
                    en: "Document number",
                  },
                  memoId: {
                    id: "Memo ID",
                    en: "Memo ID",
                  },
                };

                const valueMap: any = watch();

                return (
                  <div className="mb-6" key={mapping}>
                    <Text
                      label={labelMap[mapping].id}
                      className="text-base font-normal text-black"
                    />

                    <Text
                      label={labelMap[mapping].en}
                      className="text-sm font-light italic text-black"
                    />

                    <Text label={valueMap[mapping]} className="text-xl font-bold text-black mt-1" />
                  </div>
                );
              })}

            <Text
              label="Telah disetujui oleh pengguna Klikyou sebagai berikut"
              className="text-2xl font-light text-black"
            />

            <Text
              label="Has been approved by Klikyou user as follows"
              className="text-base font-light italic text-black"
            />

            {dataDocument?.data?.data?.documentAuthorizers?.map(
              (itemAuth: DocumentAuthorizersType) => {
                return (
                  <div key={itemAuth.id} className="bg-[#EFF2F5] p-4 rounded flex gap-2">
                    <ImageNext
                      src={itemAuth.user.avatarPath || "/placeholder-profile.png"}
                      width={48}
                      height={48}
                      priority
                      alt="placeholder"
                      className="w-auto h-auto rounded-full object-cover"
                    />

                    <div>
                      <Text
                        label={itemAuth?.user?.firstName + " " + itemAuth?.user?.lastName}
                        className="text-base font-base text-black"
                      />

                      <Text
                        label={`Timestamp: ${UseConvertDateFormat(itemAuth?.updatedAt)}`}
                        className="text-base font-base text-black"
                      />
                    </div>
                  </div>
                );
              }
            )}

            <div className="flex justify-center">
              <CheckIcon
                style={{
                  color: "#23C464",
                }}
              />
            </div>

            <Text
              label="Adalah benar dan tercatat dalam audit trail kami"
              className="text-xl text-center font-bold text-black"
            />

            <Text
              label="That is true and recorded in our audit trail"
              className="text-base text-center font-light italic text-black"
            />

            <Text
              label="Untuk memastikan kebenaran pernyataan ini pastikan URL pada browser anda adalah https://klikyou.com"
              className="text-xl text-center font-bold text-black"
            />

            <Text
              label="If you wish to check the validity of this statement, please ensure the URL https://klikyou.com"
              className="text-base text-center font-light italic text-black"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
