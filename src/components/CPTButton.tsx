import { Button, ButtonProps } from 'primereact/button';

export type CPTButtonProps = ButtonProps;

export const CPTButton = (props: CPTButtonProps) => {
  return <Button {...props} />;
};

