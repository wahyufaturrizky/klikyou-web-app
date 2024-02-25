import { CommonResponseType, DataStatusMessageResponseType, MetaType } from "@/interface/common";
import { DataPureMyprofileType } from "@/interface/my-profile.interface";
import { TableProps } from "antd";
import { Key } from "react";

export type ColumnsType<T> = TableProps<T>["columns"];

interface ModuleRoleType {
  id: number;
  roleId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleResType {
  id: number;
  levelName: string;
  createdAt: string;
  updatedAt: string;
  modules: ModuleRoleType[];
}

export interface DeleteUserManagementModal {
  open: boolean;
  type: string;
  data: { data: DataPureMyprofileType[] | null; selectedRowKeys: Key[] } | null;
}

export interface DeleteUserManagementByIdModal {
  open: boolean;
  type: string;
  data?: ResUserManagementTypeById | null;
}

export interface DataType {
  key: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export interface RoleIdType {
  createdAt: string;
  id: number;
  levelName: string;
  updatedAt: string;
}

export interface DataInfoUserManagementType {
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  id: number;
  createdByAvatarPath: string;
  updatedByAvatarPath: string;
}

interface DataResUserManagement extends DataStatusMessageResponseType {
  data: {
    meta: MetaType;
    data: DataPureMyprofileType[];
  };
}

export interface ResUserManagementType extends CommonResponseType {
  data: DataResUserManagement;
}

interface DataResUserManagementById extends DataStatusMessageResponseType {
  data: DataPureMyprofileType;
}

export interface ResUserManagementTypeById extends CommonResponseType {
  data: DataResUserManagementById;
}
