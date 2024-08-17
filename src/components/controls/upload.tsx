import { CloudUploadOutlined } from '@ant-design/icons';
import { Upload as AntdUpload, UploadFile, UploadProps } from 'antd';
import React from 'react';

import Button from './button';

export type UploadType = UploadProps & {
  error?: string;
  placeholder?: string;
};

function Upload({ children, error, placeholder = 'Upload', ...props }: UploadType) {
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);

  return (
    <>
      <AntdUpload
        beforeUpload={(file) => {
          setFileList([...fileList, file]);

          return false;
        }}
        fileList={fileList}
        onRemove={(file) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          setFileList(newFileList);
        }}
        {...props}
      >
        {children || (
          <Button icon={CloudUploadOutlined} htmlType="button" type="default">
            {placeholder}
          </Button>
        )}
      </AntdUpload>
      {error && <span className="block !text-red-500 form-field-label">{error}</span>}
    </>
  );
}

export default Upload;
