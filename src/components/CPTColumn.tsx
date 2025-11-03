import { Column, ColumnProps } from 'primereact/column';

export type CPTColumnProps = ColumnProps;

export const CPTColumn = (props: CPTColumnProps) => {
  return <Column {...props} />;
};

