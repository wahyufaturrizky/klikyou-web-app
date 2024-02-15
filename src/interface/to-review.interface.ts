import { DataStatusMessageResponseType, MetaType } from "@/interface/common";
import { CommonResponseType } from "./common";
import { DataDocumentTags } from "@/interface/documents-tag.interface";
import { DocumentTagsType } from "@/interface/documents.interface";

export interface ApproveAndRejectToReviewModal {
  open: boolean;
  data: DataResToReview | null;
  type: "approve" | "reject" | "";
}

export type FormToReviewValues = {
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

interface CreatedByToReviewType {
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

export interface DataResToReview {
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
  createdBy: CreatedByToReviewType;
  documentTags: DocumentTagsType[];
  currentUserRole: string;
  status: string;
}

interface DataMessageStatusDashboardType extends DataStatusMessageResponseType {
  data: {
    meta: MetaType;
    data: DataResToReview[];
  };
}

export interface DataResponseToReviewType extends CommonResponseType {
  data: DataMessageStatusDashboardType;
}
