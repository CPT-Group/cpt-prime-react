import { Accordion, AccordionProps } from 'primereact/accordion';

export type CPTAccordionProps = AccordionProps;

export const CPTAccordion = (props: CPTAccordionProps) => {
  return <Accordion {...props} />;
};

