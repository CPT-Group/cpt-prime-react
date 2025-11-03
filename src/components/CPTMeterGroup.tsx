import { MeterGroup, MeterGroupProps } from 'primereact/metergroup';

export type CPTMeterGroupProps = MeterGroupProps;

export const CPTMeterGroup = (props: CPTMeterGroupProps) => {
  return <MeterGroup {...props} />;
};

