import { Card, CardProps } from 'primereact/card';

export type CPTCardProps = CardProps;

export const CPTCard = (props: CPTCardProps) => {
  return <Card {...props} />;
};

