import { Dialog, DialogProps } from 'primereact/dialog';

export type CPTDialogProps = DialogProps;

export const CPTDialog = (props: CPTDialogProps) => {
  return <Dialog {...props} />;
};

