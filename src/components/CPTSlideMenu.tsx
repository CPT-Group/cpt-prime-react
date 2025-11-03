import { SlideMenu, SlideMenuProps } from 'primereact/slidemenu';
import { forwardRef } from 'react';

export type CPTSlideMenuProps = SlideMenuProps;

export const CPTSlideMenu = forwardRef<SlideMenu, CPTSlideMenuProps>(
  (props: CPTSlideMenuProps, ref) => {
    return <SlideMenu {...props} ref={ref} />;
  }
);

CPTSlideMenu.displayName = 'CPTSlideMenu';

