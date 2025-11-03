import { ProgressSpinner, ProgressSpinnerProps } from 'primereact/progressspinner';

export type CPTProgressSpinnerProps = ProgressSpinnerProps;

export const CPTProgressSpinner = (props: CPTProgressSpinnerProps) => {
  return <ProgressSpinner {...props} />;
};

