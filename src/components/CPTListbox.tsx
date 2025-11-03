import { ListBox, ListBoxProps } from 'primereact/listbox';

export type CPTListboxProps = ListBoxProps;

export const CPTListbox = (props: CPTListboxProps) => {
  return <ListBox {...props} />;
};

