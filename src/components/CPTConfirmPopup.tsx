import { ConfirmPopup, ConfirmPopupProps } from 'primereact/confirmpopup';

export type CPTConfirmPopupProps = ConfirmPopupProps;

export const CPTConfirmPopup = (props: CPTConfirmPopupProps) => {
  return <ConfirmPopup {...props} />;
};

