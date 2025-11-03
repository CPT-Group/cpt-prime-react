import { TieredMenu, TieredMenuProps } from 'primereact/tieredmenu';
import { forwardRef } from 'react';

export type CPTTieredMenuProps = TieredMenuProps;

export const CPTTieredMenu = forwardRef<TieredMenu, CPTTieredMenuProps>(
  (props: CPTTieredMenuProps, ref) => {
    return <TieredMenu {...props} ref={ref} />;
  }
);

CPTTieredMenu.displayName = 'CPTTieredMenu';

