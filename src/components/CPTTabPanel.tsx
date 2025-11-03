import { TabPanel, TabPanelProps } from 'primereact/tabview';

export type CPTTabPanelProps = TabPanelProps;

export const CPTTabPanel = (props: CPTTabPanelProps) => {
  return <TabPanel {...props} />;
};

