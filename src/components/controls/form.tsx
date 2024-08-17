import { Form as AntdForm } from 'antd';
import React from 'react';

import type { FormProps } from 'antd';

type FormType = Omit<FormProps, 'children'> & {
  children: React.ReactNode;
};

function Form(props: FormType) {
  return <AntdForm layout="vertical" {...props} />;
}

Form.Item = AntdForm.Item;
Form.useForm = AntdForm.useForm;

export default Form;
