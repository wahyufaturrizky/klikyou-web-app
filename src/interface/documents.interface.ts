import { FormFilterValues } from "@/interface/common";
import { DataDocumentTags } from "@/interface/documents-tag.interface";
import { Key } from "react";

export interface FormFilterValuesDocuments extends FormFilterValues {
  currentUserRole: string[];
}

interface MakersType {
  id: number;
  roleId: number;
  avatarPath: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}

interface DocumentCollaboratorsType {
  id: number;
  roleId: number;
  avatarPath: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  tags: null;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}

interface DocumentAuthorizersType {
  id: number;
  roleId: number;
  avatarPath: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  tags: null;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}

interface DocumentRecipientsType {
  id: number;
  roleId: number;
  avatarPath: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  tags: null;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}

export interface DataDocumentsType {
  document_name: string;
  id: string;
  document_number: string;
  text_remakrs: string;
  numeric_remarks: number;
  documentPath: string;
  currentUserRole: string;
  status: string;
  action: string;
  makers: MakersType;
  document_tags: DataDocumentTags[];
  document_collaborators: DocumentCollaboratorsType[];
  document_authorizers: DocumentAuthorizersType[];
  document_recipients: DocumentRecipientsType[];
}

export interface DeleteDocumentModal {
  open: boolean;
  type: string;
  data?: { data: DataDocumentsType[] | null; selectedRowKeys: Key[] } | null;
}

export type FormDocumentValues = {
  document_name: string;
  document_number: string;
  text_remarks: string;
  numeric_remarks: string;
  document_tag_id: string[];
  document_collaborator_id: string[];
  document_path: any;
  document_authorizer_id: string[];
  document_recipient_id: string[];
  document_note: string;
};

export interface UserListType {
  id: string;
  label: string;
}

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

export interface EditDocumentsModal {
  open: boolean;
  data?: DataTypeInfo | null;
}
