import { CommonResponseType, DataStatusMessageResponseType, MetaType } from "@/interface/common";
import { Key } from "react";

export interface DataDocumentTags {
  id?: number;
  code: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}

export type FormDocumentTagsValues = {
  code: string;
  name: string;
};

export interface DeleteDocumentTagsModal {
  open: boolean;
  type: string;
  data: { data?: DataDocumentTags[] | null; selectedRowKeys: Key[] } | null;
}

export interface AddAndEditDocumentTagsModal {
  open: boolean;
  data: DataDocumentTags | null;
  type: "add" | "edit" | "";
}

interface DataRawDocumentTagType extends DataStatusMessageResponseType {
  data: {
    meta: MetaType;
    data: DataDocumentTags[];
  };
}

export interface DataResponseDocumentTagType extends CommonResponseType {
  data: DataRawDocumentTagType;
}

interface DataRawUpdateDocumentTagType extends DataStatusMessageResponseType {
  data: DataDocumentTags;
}

export interface ResUpdateDocumentTagType extends CommonResponseType {
  data: DataRawUpdateDocumentTagType;
}

interface DataRawDeleteDocumentTagType extends DataStatusMessageResponseType {
  data: string[];
}

export interface ResDeleteDocumentTagType extends CommonResponseType {
  data: DataRawDeleteDocumentTagType;
}
