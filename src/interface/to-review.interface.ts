import { DataResDocument } from "@/interface/documents.interface";
export interface ApproveAndRejectToReviewModal {
  open: boolean;
  data: DataResDocument | null;
  type: "approve" | "reject" | "process" | "";
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
