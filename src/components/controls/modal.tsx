import { Modal as AntdModal, ModalProps } from 'antd';

import { classNames } from '../../utils';

type ModalType = ModalProps;

function Modal({ children, className, ...props }: ModalType) {
  return (
    <AntdModal
      centered
      className={classNames('max-w-[22rem] sm:max-w-sm overflow-x-hidden w-full', className || '')}
      footer={null}
      width="100%"
      {...props}
    >
      {children}
    </AntdModal>
  );
}

Modal.confirm = AntdModal.confirm;

export default Modal;
