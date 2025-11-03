import { DataViewLayoutOptions, DataViewLayoutOptionsProps } from 'primereact/dataview';

export type CPTDataViewLayoutOptionsProps = DataViewLayoutOptionsProps;

export const CPTDataViewLayoutOptions = (props: CPTDataViewLayoutOptionsProps) => {
  return <DataViewLayoutOptions {...props} />;
};

