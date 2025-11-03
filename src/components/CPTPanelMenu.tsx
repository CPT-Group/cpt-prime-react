import { PanelMenu, PanelMenuProps } from 'primereact/panelmenu';

export type CPTPanelMenuProps = PanelMenuProps;

export const CPTPanelMenu = (props: CPTPanelMenuProps) => {
  return <PanelMenu {...props} />;
};

