import { ColumnGroup, ColumnGroupProps } from 'primereact/columngroup';

export type CPTColumnGroupProps = ColumnGroupProps;

export const CPTColumnGroup = (props: CPTColumnGroupProps) => {
  return <ColumnGroup {...props} />;
};

