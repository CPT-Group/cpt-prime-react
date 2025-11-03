import { DataView, DataViewProps } from 'primereact/dataview';

export type CPTDataViewProps = DataViewProps;

export const CPTDataView = (props: CPTDataViewProps) => {
  return <DataView {...props} />;
};

