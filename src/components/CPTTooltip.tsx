import { Tooltip, TooltipProps } from 'primereact/tooltip';

export type CPTTooltipProps = TooltipProps;

export const CPTTooltip = (props: CPTTooltipProps) => {
  return <Tooltip {...props} />;
};

