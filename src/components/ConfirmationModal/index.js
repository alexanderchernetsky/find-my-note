import { Modal } from 'antd';

const ConfirmationModal = ({text = '', onOk, onCancel}) => {
    return (
        <Modal
            title="Are you sure?"
            centered
            visible={true}
            onOk={onOk}
            onCancel={onCancel}
            width={500}
        >
            <p>{text}</p>
        </Modal>
    )
}

export default ConfirmationModal;
