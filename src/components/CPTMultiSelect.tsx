import { MultiSelect, MultiSelectProps } from 'primereact/multiselect';

export type CPTMultiSelectProps = MultiSelectProps;

export const CPTMultiSelect = (props: CPTMultiSelectProps) => {
  return <MultiSelect {...props} />;
};

