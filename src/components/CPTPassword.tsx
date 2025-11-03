import { Password, PasswordProps } from 'primereact/password';

export type CPTPasswordProps = PasswordProps;

export const CPTPassword = (props: CPTPasswordProps) => {
  return <Password {...props} />;
};

