import { Modal as AntdModal, ModalProps } from "antd";

import { classNames } from "../../utils";

type ModalType = ModalProps;

function Modal({ children, className, ...props }: ModalType) {
	return (
		<AntdModal
			centered
			// className={classNames('max-w-3xl py-2 overflow-x-hidden w-full', className || '')}
			className={classNames("py-2 overflow-x-hidden w-full", className || "")}
			destroyOnClose
			footer={null}
			maskClosable={false}
			width="100%"
			{...props}
		>
			{children}
		</AntdModal>
	);
}

Modal.confirm = AntdModal.confirm;

export default Modal;
