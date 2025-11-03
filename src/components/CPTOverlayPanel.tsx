import { OverlayPanel, OverlayPanelProps } from 'primereact/overlaypanel';
import { forwardRef } from 'react';

export type CPTOverlayPanelProps = OverlayPanelProps;

export const CPTOverlayPanel = forwardRef<OverlayPanel, CPTOverlayPanelProps>(
  (props: CPTOverlayPanelProps, ref) => {
    return <OverlayPanel {...props} ref={ref} />;
  }
);

CPTOverlayPanel.displayName = 'CPTOverlayPanel';

