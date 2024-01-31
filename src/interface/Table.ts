import { GetProp, TableProps } from "antd";

type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}
