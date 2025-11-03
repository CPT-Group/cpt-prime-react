import { TreeTable, TreeTableProps } from 'primereact/treetable';

export type CPTTreeTableProps = TreeTableProps;

export const CPTTreeTable = (props: CPTTreeTableProps) => {
  return <TreeTable {...props} />;
};

