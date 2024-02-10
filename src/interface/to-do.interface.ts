export interface DataToDoType {
  id: string;
  docName: string;
  tags: string[];
  file: string;
  status: string;
  updatedAt: string;
}

export interface ApproveAndRejectToDoModal {
  open: boolean;
  data: DataToDoType | null;
  type: "approve" | "reject" | "";
}

export interface DataToDoType {
  id: string;
  docName: string;
  tags: string[];
  file: string;
  status: string;
  updatedAt: string;
  approval: string;
}

export type FormToDoValues = {
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
