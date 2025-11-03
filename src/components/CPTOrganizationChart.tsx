import { OrganizationChart, OrganizationChartProps } from 'primereact/organizationchart';

export type CPTOrganizationChartProps = OrganizationChartProps;

export const CPTOrganizationChart = (props: CPTOrganizationChartProps) => {
  return <OrganizationChart {...props} />;
};

