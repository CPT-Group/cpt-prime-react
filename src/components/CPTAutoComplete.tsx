import { AutoComplete, AutoCompleteProps } from 'primereact/autocomplete';

export type CPTAutoCompleteProps = AutoCompleteProps;

export const CPTAutoComplete = (props: CPTAutoCompleteProps) => {
  return <AutoComplete {...props} />;
};

