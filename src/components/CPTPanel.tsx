import { Panel, PanelProps } from 'primereact/panel';

export type CPTPanelProps = PanelProps;

export const CPTPanel = (props: CPTPanelProps) => {
  return <Panel {...props} />;
};

