import { TableProps } from "antd";
import { Key } from "react";
import { DataHistoryType } from "@/interface/history.interface";

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

export interface DataUserManagementType {
  id: string;
  name: string;
  email: string;
  level: string;
  firstName: string;
  username: string;
  roleId: number;
  lastName: string;
  role: RoleResType;
  tags: string;
  avatarPath: string;
  updateAt: Date;
}

export interface DeleteUserManagementModal {
  open: boolean;
  type: string;
  data: { data: DataUserManagementType[] | null; selectedRowKeys: Key[] } | null;
}

export interface DeleteUserManagementModal {
  open: boolean;
  type: string;
  data: { data: DataUserManagementType[] | null; selectedRowKeys: Key[] } | null;
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
