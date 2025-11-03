import { ConfirmDialog, ConfirmDialogProps } from 'primereact/confirmdialog';
import { forwardRef } from 'react';

export type CPTConfirmDialogProps = ConfirmDialogProps;

export const CPTConfirmDialog = forwardRef<ConfirmDialog, CPTConfirmDialogProps>(
  (props: CPTConfirmDialogProps, ref) => {
    return <ConfirmDialog {...props} ref={ref} />;
  }
);

CPTConfirmDialog.displayName = 'CPTConfirmDialog';

