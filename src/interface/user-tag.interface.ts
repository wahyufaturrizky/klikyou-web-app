import { Key } from "react";
export interface DataUserTags {
  id: string;
  code: string;
  documentType: string;
  updatedAt: Date;
  createdAt: Date;
}

export type FormUserTagsValues = {
  code: string;
  documentType: string;
};

export interface DeleteUserTagsModal {
  open: boolean;
  type: string;
  data: { data?: DataUserTags[] | null; selectedRowKeys: Key[] } | null;
}

export interface AddAndEditUserTagsModal {
  open: boolean;
  data: DataUserTags | null;
  type: "add" | "edit" | "";
}
