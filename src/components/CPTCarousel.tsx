import { Carousel, CarouselProps } from 'primereact/carousel';

export type CPTCarouselProps = CarouselProps;

export const CPTCarousel = (props: CPTCarouselProps) => {
  return <Carousel {...props} />;
};

