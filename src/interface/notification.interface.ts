import { CommonResponseType, DataStatusMessageResponseType } from "@/interface/common";

export interface NotificationType {
  id: number;
  userId: number;
  documentId: number;
  title: string;
  date: string;
}

interface DataMessageStatusType extends DataStatusMessageResponseType {
  data: NotificationType[];
}

export interface DataResponseNotificationType extends CommonResponseType {
  data: DataMessageStatusType;
}
