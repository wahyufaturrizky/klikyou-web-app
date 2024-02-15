import { DataStatusMessageResponseType, CommonResponseType } from "@/interface/common";
export interface DataShortestType {
  id: string;
  docName: string;
  status: string;
  elapsedTime: string;
}

export interface DataLowestType {
  id: string;
  docName: string;
  rejected: string;
}

interface DashboardInfoDashboardType {
  total_documents: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface ShortestLongestProcessTimeType {
  id: number;
  name: string;
  processed_count: number;
  total: number;
  status: string;
  elapsed_time: string;
}

interface ProcessTimeDashboardType {
  shortest: ShortestLongestProcessTimeType[];
  longest: ShortestLongestProcessTimeType[];
}

interface LowestHighestApprovalTimeType {
  id: number;
  name: string;
  reject_count: number;
}

interface ApprovalTimeReviewType {
  lowest: LowestHighestApprovalTimeType[];
  highest: LowestHighestApprovalTimeType[];
}

interface DataRawDashboardType {
  dashboard_info: DashboardInfoDashboardType;
  process_time: ProcessTimeDashboardType;
  approval_time: ApprovalTimeReviewType;
}

interface DataMessageStatusDashboardType extends DataStatusMessageResponseType {
  data: DataRawDashboardType;
}

export interface DataResponseDashboardType extends CommonResponseType {
  data: DataMessageStatusDashboardType;
}
