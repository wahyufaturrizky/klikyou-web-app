import { DataStatusMessageResponseType, CommonResponseType } from "@/interface/common";
export interface CompanyProfileType {
  companyAddress: string;
  companyImagePath: string;
  companyName: string;
  createdAt: string;
  deletedAt: null;
  email: string;
  id: number;
  npwp: string;
  tel: string;
  updatedAt: string;
}

export type FormSettingsValues = {
  company_image_path: string;
  company_name: string;
  company_address: string;
  npwp: string;
  tel: string;
  email: string;
};

interface DataResRawSettings extends DataStatusMessageResponseType {
  data: CompanyProfileType;
}

export interface ResUpdateDocumentType extends CommonResponseType {
  data: DataResRawSettings;
}
