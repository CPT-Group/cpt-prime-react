import { Sidebar, SidebarProps } from 'primereact/sidebar';
import { forwardRef } from 'react';

export interface CPTSidebarProps extends SidebarProps {
  // Pass-through with full PrimeReact type safety
}

export const CPTSidebar = forwardRef<Sidebar, CPTSidebarProps>(
  (props: CPTSidebarProps, ref) => {
    return <Sidebar {...props} ref={ref} />;
  }
);

CPTSidebar.displayName = 'CPTSidebar';

