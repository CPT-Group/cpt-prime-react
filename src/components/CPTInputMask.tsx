import { InputMask, InputMaskProps } from 'primereact/inputmask';

export type CPTInputMaskProps = InputMaskProps;

export const CPTInputMask = (props: CPTInputMaskProps) => {
  return <InputMask {...props} />;
};

