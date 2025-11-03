import { Chip, ChipProps } from 'primereact/chip';

export type CPTChipProps = ChipProps;

export const CPTChip = (props: CPTChipProps) => {
  return <Chip {...props} />;
};

