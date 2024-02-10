export interface DataToReviewType {
  id: string;
  docName: string;
  tags: string[];
  file: string;
  status: string;
  updatedAt: string;
}

export interface ApproveAndRejectToReviewModal {
  open: boolean;
  data: DataToReviewType | null;
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
