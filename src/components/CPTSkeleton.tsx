import { Skeleton, SkeletonProps } from 'primereact/skeleton';

export type CPTSkeletonProps = SkeletonProps;

export const CPTSkeleton = (props: CPTSkeletonProps) => {
  return <Skeleton {...props} />;
};

