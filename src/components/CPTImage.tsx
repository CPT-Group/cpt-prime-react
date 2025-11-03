import { Image, ImageProps } from 'primereact/image';

export type CPTImageProps = ImageProps & {
  alt?: string;
};

export const CPTImage = (props: CPTImageProps) => {
  // Ensure alt prop is always provided for accessibility
  const imageProps = {
    ...props,
    alt: props.alt ?? '',
  };
  // eslint-disable-next-line jsx-a11y/alt-text -- PrimeReact Image component handles alt prop internally
  return <Image {...imageProps} />;
};

