import { InputNumber, InputNumberProps } from 'primereact/inputnumber';

export type CPTInputNumberProps = InputNumberProps;

export const CPTInputNumber = (props: CPTInputNumberProps) => {
  return <InputNumber {...props} />;
};

