import { Menu, MenuProps } from 'primereact/menu';
import { forwardRef } from 'react';

export type CPTMenuProps = MenuProps;

export const CPTMenu = forwardRef<Menu, CPTMenuProps>(
  (props: CPTMenuProps, ref) => {
    return <Menu {...props} ref={ref} />;
  }
);

CPTMenu.displayName = 'CPTMenu';

