import { Upload as AntdUpload } from 'antd';

import type { UploadProps } from 'antd';

import classNames from '../../utils/classnames';

export type UploadType = UploadProps & {
  error?: string;
  label?: string;
  labelClassName?: string;
};

function Upload({ label, labelClassName, error, ...props }: UploadType) {
  const labelClass = classNames('form-field-label', labelClassName || '');

  return (
    <>
      {label && (
        <label className={`${error ? 'text-red-500' : ''} ${labelClass}`} htmlFor={props.id}>
          {label}
        </label>
      )}
      <AntdUpload style={{ width: '100%' }} {...props} />
    </>
  );
}

export function UploadDragger({ label, labelClassName, error, ...props }: UploadType) {
  const labelClass = classNames('form-field-label', labelClassName || '');

  return (
    <>
      {label && (
        <label className={`${error ? 'text-red-500' : ''} ${labelClass}`} htmlFor={props.id}>
          {label}
        </label>
      )}
      <AntdUpload.Dragger style={{ width: '100%' }} {...props} />

      {/* <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibited from uploading company
                  data or other banned files.
                </p> */}
    </>
  );
}

export default Upload;
