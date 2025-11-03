import { Terminal, TerminalProps } from 'primereact/terminal';
import { forwardRef } from 'react';

export type CPTTerminalProps = TerminalProps;

export const CPTTerminal = forwardRef<Terminal, CPTTerminalProps>(
  (props: CPTTerminalProps, ref) => {
    return <Terminal {...props} ref={ref} />;
  }
);

CPTTerminal.displayName = 'CPTTerminal';

