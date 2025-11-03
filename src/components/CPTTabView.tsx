import { TabView, TabViewProps } from 'primereact/tabview';

export type CPTTabViewProps = TabViewProps;

export const CPTTabView = (props: CPTTabViewProps) => {
  return <TabView {...props} />;
};

