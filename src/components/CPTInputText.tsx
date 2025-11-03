import { InputText, InputTextProps } from 'primereact/inputtext';

export type CPTInputTextProps = InputTextProps;

export const CPTInputText = (props: CPTInputTextProps) => {
  return <InputText {...props} />;
};

