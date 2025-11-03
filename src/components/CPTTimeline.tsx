import { Timeline, TimelineProps } from 'primereact/timeline';

export type CPTTimelineProps = TimelineProps;

export const CPTTimeline = (props: CPTTimelineProps) => {
  return <Timeline {...props} />;
};

