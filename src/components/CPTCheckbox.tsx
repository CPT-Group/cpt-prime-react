import { Checkbox, CheckboxProps } from 'primereact/checkbox';

export type CPTCheckboxProps = CheckboxProps;

export const CPTCheckbox = (props: CPTCheckboxProps) => {
  return <Checkbox {...props} />;
};

