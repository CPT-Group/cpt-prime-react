import { VirtualScroller, VirtualScrollerProps } from 'primereact/virtualscroller';

export type CPTVirtualScrollerProps = VirtualScrollerProps;

export const CPTVirtualScroller = (props: CPTVirtualScrollerProps) => {
  return <VirtualScroller {...props} />;
};

