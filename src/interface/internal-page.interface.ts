import { CommonResponseType, DataStatusMessageResponseType } from "@/interface/common";
export interface FormValueInternalPageType {
  status: string;
}

interface DataRawInternalSettingsType extends DataStatusMessageResponseType {
  data: {
    status: boolean;
  };
}

export interface DataResponseInternalSettingsType extends CommonResponseType {
  data: DataRawInternalSettingsType;
}
