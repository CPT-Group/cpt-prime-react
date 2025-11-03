import { Editor, EditorProps } from 'primereact/editor';

export type CPTEditorProps = EditorProps;

export const CPTEditor = (props: CPTEditorProps) => {
  return <Editor {...props} />;
};

