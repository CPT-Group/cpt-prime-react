import { ContextMenu, ContextMenuProps } from 'primereact/contextmenu';
import { forwardRef } from 'react';

export type CPTContextMenuProps = ContextMenuProps;

export const CPTContextMenu = forwardRef<ContextMenu, CPTContextMenuProps>(
  (props: CPTContextMenuProps, ref) => {
    return <ContextMenu {...props} ref={ref} />;
  }
);

CPTContextMenu.displayName = 'CPTContextMenu';

