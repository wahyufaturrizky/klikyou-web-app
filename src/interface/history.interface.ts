import { Key } from "react";
export interface DataHistoryType {
  id: string;
  docName: string;
  tags: string[];
  file: string;
  status: string;
  updatedAt: string;
  approval: string;
}

export interface DeleteHistoryModal {
  open: boolean;
  type: string;
  data: { data: DataHistoryType[] | null; selectedRowKeys: Key[] } | null;
}

export interface ApproveAndRejectHistoryModal {
  open: boolean;
  data: DataHistoryType | null;
  type: "approve" | "reject" | "";
}

export type FormHistoryValues = {
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

export interface DataTypeActionHistory {
  id: string;
  user: string;
  act: string;
  note: string;
  file: string;
  fileVerHistory: string;
  updatedAt: Date;
}

export interface DataTypeInfo {
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
