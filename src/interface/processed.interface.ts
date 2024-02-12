export type FormProcessedValues = {
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

export interface DataProcessedType {
  id: string;
  docName: string;
  tags: string[];
  file: string;
  status: string;
  updatedAt: string;
}