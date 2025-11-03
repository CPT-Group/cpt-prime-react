import { ColorPicker, ColorPickerProps } from 'primereact/colorpicker';

export type CPTColorPickerProps = ColorPickerProps;

export const CPTColorPicker = (props: CPTColorPickerProps) => {
  return <ColorPicker {...props} />;
};

