import { FileUpload, FileUploadProps } from 'primereact/fileupload';

export type CPTFileUploadProps = FileUploadProps;

export const CPTFileUpload = (props: CPTFileUploadProps) => {
  const fakeProps = {
    ...props,
    customUpload: true,
    uploadHandler: props.uploadHandler || (() => {
      console.log('Fake file upload');
    }),
  };
  return <FileUpload {...fakeProps} />;
};

