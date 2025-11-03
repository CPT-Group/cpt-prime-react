import { Slider, SliderProps } from 'primereact/slider';

export type CPTSliderProps = SliderProps;

export const CPTSlider = (props: CPTSliderProps) => {
  return <Slider {...props} />;
};

