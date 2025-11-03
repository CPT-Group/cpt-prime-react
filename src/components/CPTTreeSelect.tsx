import { TreeSelect, TreeSelectProps } from 'primereact/treeselect';

export type CPTTreeSelectProps = TreeSelectProps;

export const CPTTreeSelect = (props: CPTTreeSelectProps) => {
  return <TreeSelect {...props} />;
};

