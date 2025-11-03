import { Dock, DockProps } from 'primereact/dock';

export type CPTDockProps = DockProps;

export const CPTDock = (props: CPTDockProps) => {
  return <Dock {...props} />;
};

