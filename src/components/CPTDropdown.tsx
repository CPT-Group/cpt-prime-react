import { Dropdown, DropdownProps } from 'primereact/dropdown';

export type CPTDropdownProps = DropdownProps;

export const CPTDropdown = (props: CPTDropdownProps) => {
  return <Dropdown {...props} />;
};

