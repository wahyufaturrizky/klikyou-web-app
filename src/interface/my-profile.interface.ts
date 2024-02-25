import { CommonResponseType, DataStatusMessageResponseType } from "@/interface/common";
import { CreatedAndUpdateByDocumentType } from "@/interface/documents.interface";

export type FormProfileValues = {
  avatar_path: string;
  first_name: string;
  last_name: string;
  tags: number[] | string[];
  role_id?: number;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export interface DataMyProfileType {
  key: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

interface ModuleMyProfileType {
  id: number;
  roleId: number;
  name: string;
  c: number;
  r: number;
  u: number;
  d: number;
  createdAt: string;
  updatedAt: string;
}

interface RoleMyProfileYpe {
  id: number;
  levelName: string;
  createdAt: string;
  updatedAt: string;
  modules: ModuleMyProfileType[];
}

interface MasterUserTagType {
  id: number;
  code: string;
  documentType: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserTagMyProfile {
  id: number;
  userId: number;
  masterUserTagId: number;
  createdAt: string;
  updatedAt: string;
  masterUserTag: MasterUserTagType;
}

export interface DataPureMyprofileType {
  id: number;
  roleId: number;
  avatarPath: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  role: RoleMyProfileYpe;
  userTag: UserTagMyProfile[];
  tags: string[];
  createBy: {
    user: CreatedAndUpdateByDocumentType;
    action: string;
    date: string;
  };
  updatedBy: {
    user: CreatedAndUpdateByDocumentType;
    action: string;
    date: string;
  };
}

interface DataResRawUpdateMyProfile extends DataStatusMessageResponseType {
  data: DataPureMyprofileType;
}

export interface ResUpdateMyProfileType extends CommonResponseType {
  data: DataResRawUpdateMyProfile;
}

interface DataMyPrfoileRawType extends DataStatusMessageResponseType {
  data: DataPureMyprofileType;
}

export interface DataResponseMyProfileType extends CommonResponseType {
  data: DataMyPrfoileRawType;
}
