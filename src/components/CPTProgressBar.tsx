import { ProgressBar, ProgressBarProps } from 'primereact/progressbar';

export type CPTProgressBarProps = ProgressBarProps;

export const CPTProgressBar = (props: CPTProgressBarProps) => {
  return <ProgressBar {...props} />;
};

