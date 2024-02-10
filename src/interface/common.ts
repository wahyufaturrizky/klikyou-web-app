import { DataDocumentsType } from "@/interface/documents.interface";
import { Key } from "react";
export interface OptionInterface {
  label: string;
  value: string;
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
