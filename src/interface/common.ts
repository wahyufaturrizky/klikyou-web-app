import { useOrderTableParams } from "@/hook/useOrderTableParams";
export interface OptionInterface {
  label: string;
  value: string;
}

export interface QueryType {
  search: string;
  status: string;
  role?: string;
  page: number;
  limit: number;
  orderBy: string;
  updated_at_start: string;
  updated_at_end: string;
  history?: number;
  currentUserRole?: string;
}

export interface RoleType {
  createdAt: string;
  id: number;
  levelName: string;
  updatedAt: string;
}

export interface TagType {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type FormFilterValues = {
  search: string;
  date: string;
  status: string[];
  role: string[];
};

export type FormApproveRejectProcessValues = {
  supporting_document_note: string;
  supporting_document_path: any;
};

export interface TagType {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

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
