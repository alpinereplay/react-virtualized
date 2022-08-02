export type CellDataGetterParams = {
  columnData: any | null | undefined;
  dataKey: string;
  rowData: any;
};
export type CellRendererParams = {
  cellData: any | null | undefined;
  columnData: any | null | undefined;
  dataKey: string;
  rowData: any;
  rowIndex: number;
};
export type HeaderRowRendererParams = {
  className: string;
  columns: Array<any>;
  style: any;
};
export type HeaderRendererParams = {
  columnData: any | null | undefined;
  dataKey: string;
  disableSort: boolean | null | undefined;
  label: any | null | undefined;
  sortBy: string | null | undefined;
  sortDirection: string | null | undefined;
};
export type RowRendererParams = {
  className: string;
  columns: Array<any>;
  index: number;
  isScrolling: boolean;
  onRowClick: ((...args: Array<any>) => any) | null | undefined;
  onRowDoubleClick: ((...args: Array<any>) => any) | null | undefined;
  onRowMouseOver: ((...args: Array<any>) => any) | null | undefined;
  onRowMouseOut: ((...args: Array<any>) => any) | null | undefined;
  rowData: any;
  style: any;
  key: string;
};