import { Chart, ChartProps } from 'primereact/chart';

export type CPTChartProps = ChartProps;

export const CPTChart = (props: CPTChartProps) => {
  return <Chart {...props} />;
};

