import {
  FormFilterValues,
  UserType,
  DataStatusMessageResponseType,
  MetaType,
  CommonResponseType,
} from "@/interface/common";
import { Key } from "react";
import { DataDocumentTags } from "@/interface/documents-tag.interface";
import { DataRawDashboardType } from "@/interface/dashboard.interface";

export interface FormFilterValuesDocuments extends FormFilterValues {
  latest_action_filter?: string[];
}

export interface MakersType {
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

export interface DataInfoDocumentType {
  createdBy: string;
  createdByAvatarPath: string;
  updatedByAvatarPath: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  id: number;
}

export interface DocumentCollaboratorsType {
  id: number;
  documentId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: UserType;
}

interface DocumentLogType {
  id: number;
  documentId: number;
  userId: number;
  supportingDocumentPath: null;
  supportingDocumentNote: null;
  versionHistoryDocumentPath: string;
  action: string;
  createdAt: string;
  updatedAt: string;
  user: UserType;
}

export interface DocumentAuthorizersType {
  id: number;
  documentId: number;
  userId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: UserType;
}

export interface DocumentRecipientsType {
  id: number;
  documentId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: UserType;
}

export interface DocumentTagsType {
  id: number;
  masterDocumentTagId: number;
  documentId: number;
  createdAt: string;
  updatedAt: string;
  tag: DataDocumentTags;
}

export interface DeleteDocumentModal {
  open: boolean;
  type: string;
  data?: { data: DataResDocument[] | null; selectedRowKeys: Key[] } | null;
}

export type FormDocumentValues = {
  document_name: string;
  document_number: string;
  memoId: string;
  text_remarks: string;
  numeric_remarks: string;
  document_tag_id: string[];
  document_collaborator_id: string[];
  document_path: any;
  document_authorizer_id: string[];
  document_recipient_id: string[];
  document_note: string;
  status?: string;
  id?: string;
  action?: string;
};

export interface UserListType {
  id: string;
  label: string;
}

export interface DataTypeActionHistory {
  id: number;
  documentId: number;
  userId: number;
  supportingDocumentPath: null;
  supportingDocumentNote: null;
  versionHistoryDocumentPath: string;
  action: string;
  createdAt: string;
  updatedAt: string;
  user: UserType;
}

export interface DataInfoType {
  id: number;
  documentId: number;
  userId: number;
  supportingDocumentPath: null;
  supportingDocumentNote: null;
  versionHistoryDocumentPath: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditDocumentsModal {
  open: boolean;
  data?: any;
}

interface CreatedAndUpdateByDocumentType {
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

export interface DataResDocument {
  id: number;
  userId: number;
  memoId: string;
  documentName: string;
  documentNumber: string;
  textRemarks: string;
  numericRemarks: number;
  documentPath: string;
  documentNote: string;
  action: string;
  createdAt: string;
  updatedByUserId: null;
  updatedAt: string;
  createdBy: CreatedAndUpdateByDocumentType;
  documentTags: DocumentTagsType[];
  currentUserRole: string;
  status: string;
  documentCollaborators: DocumentCollaboratorsType[];
  documentAuthorizers: DocumentAuthorizersType[];
  documentRecipients: DocumentRecipientsType[];
  documentLogs: DocumentLogType[];
  updatedBy: CreatedAndUpdateByDocumentType;
}

interface DataMessageStatusType extends DataStatusMessageResponseType {
  data: {
    meta: MetaType;
    data: DataResDocument[];
  };
}

interface DataMessageDocumentByIdType extends DataStatusMessageResponseType {
  data: DataResDocument;
}

export interface DataResponseDocumentType extends CommonResponseType {
  data: DataMessageStatusType;
}

export interface DataResponseDocumentByIdType extends CommonResponseType {
  data: DataMessageDocumentByIdType;
}

interface DataResRawCreateDocument extends DataStatusMessageResponseType {
  data: {
    userId: number;
    memoId: string;
    documentName: string;
    documentNumber: string;
    textRemarks: string;
    numericRemarks: string;
    documentPath: string;
    documentNote: string;
    createdAt: string;
    updatedAt: string;
    id: number;
  };
}

export interface ResCreateDocumentType extends CommonResponseType {
  data: DataResRawCreateDocument;
}
