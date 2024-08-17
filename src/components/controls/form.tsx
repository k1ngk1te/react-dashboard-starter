import { Form as AntdForm } from 'antd';

import type { FormProps } from 'antd';

export type FormType = FormProps;

function Form({ ...props }) {
  return <AntdForm layout="vertical" {...props} />;
}

Form.Item = AntdForm.Item;
Form.useForm = AntdForm.useForm;

export default Form;
