import { DataTable, DataTableProps, DataTableValueArray } from 'primereact/datatable';
import { PropsWithChildren } from 'react';

export type CPTDataTableProps<TValue extends DataTableValueArray = DataTableValueArray> = PropsWithChildren<DataTableProps<TValue>>;

export const CPTDataTable = <TValue extends DataTableValueArray = DataTableValueArray,>(props: CPTDataTableProps<TValue>) => {
  return <DataTable {...props} />;
};

