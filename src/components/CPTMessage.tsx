import { Message, MessageProps } from 'primereact/message';

export type CPTMessageProps = MessageProps;

export const CPTMessage = (props: CPTMessageProps) => {
  return <Message {...props} />;
};

