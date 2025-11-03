import { Tag, TagProps } from 'primereact/tag';

export type CPTTagProps = TagProps;

export const CPTTag = (props: CPTTagProps) => {
  return <Tag {...props} />;
};

