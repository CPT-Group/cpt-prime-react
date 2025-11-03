import { ToggleButton, ToggleButtonProps } from 'primereact/togglebutton';

export type CPTToggleButtonProps = ToggleButtonProps;

export const CPTToggleButton = (props: CPTToggleButtonProps) => {
  return <ToggleButton {...props} />;
};

