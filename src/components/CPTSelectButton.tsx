import { SelectButton, SelectButtonProps } from 'primereact/selectbutton';

export type CPTSelectButtonProps = SelectButtonProps;

export const CPTSelectButton = (props: CPTSelectButtonProps) => {
  return <SelectButton {...props} />;
};

