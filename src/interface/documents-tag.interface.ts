import { Key } from "react";
export interface DataDocumentTags {
  id: string | number;
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
