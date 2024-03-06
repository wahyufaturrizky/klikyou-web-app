import { DataResDocument } from "@/interface/documents.interface";
import { Dayjs } from "dayjs";
export interface OptionInterface {
  label: string;
  value: string;
}

export type ModalType = "approve" | "reject" | "process" | "";

export interface ApproveRejectProcessModal {
  open: boolean;
  data: DataResDocument | null;
  type: ModalType;
}

export interface QueryType {
  search?: string;
  filter_status?: string;
  role?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  updated_at_start?: string;
  updated_at_end?: string;
  history?: number;
  filter_type?: string;
  filter_tag?: string;
  filter_latest_action?: string;
  filter_approval?: string;
}

export interface RoleType {
  createdAt: string;
  id: number;
  levelName: string;
  updatedAt: string;
}

export type FormFilterValues = {
  search?: string;
  date: string | Dayjs[];
  status?: string[];
  filter_approval?: string[];
  role?: string[];
  filter_tag?: string[];
  filter_type?: string[];
};

export type FormApproveRejectProcessValues = {
  supporting_document_note: string;
  supporting_document_path: any;
};

export interface UserType {
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

interface HeadersResponseType {
  "content-length": string;
  "content-type": string;
}

interface TransitionalConfigType {
  silentJSONParsing: boolean;
  forcedJSONParsing: boolean;
  clarifyTimeoutError: boolean;
}

interface EnvResponseType {}

interface HeadersConfigType {
  Accept: string;
}

interface ParamsConfigType {
  prearrangedDiscount: string;
  type: string;
  viewType: string;
}

interface ConfigResponseType {
  transitional: TransitionalConfigType;
  adapter: string[];
  transformRequest: null[];
  transformResponse: null[];
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: string;
  maxBodyLength: string;
  env: EnvResponseType;
  headers: HeadersConfigType;
  url: string;
  method: string;
  params: ParamsConfigType;
}

interface RequestResponseType {}

export interface CommonResponseType {
  status: number;
  statusText: string;
  headers: HeadersResponseType;
  config: ConfigResponseType;
  request: RequestResponseType;
}

export interface DataStatusMessageResponseType {
  status: string;
  message: string;
}

export interface MetaType {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: null | string;
  previousPageUrl: null | string;
}
