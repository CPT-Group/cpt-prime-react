import { Rating, RatingProps } from 'primereact/rating';

export type CPTRatingProps = RatingProps;

export const CPTRating = (props: CPTRatingProps) => {
  return <Rating {...props} />;
};

