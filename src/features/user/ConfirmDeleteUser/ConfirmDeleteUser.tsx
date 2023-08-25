import { useState } from 'react';
import { Modal, ModalBody, ModalTitle } from '@/components/Modal/Modal';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { Button } from '@/components/Button/Button';

type ConfirmDeleteUserProps = {
    onConfirm: () => void;
    loading?: boolean;
    disabled?: boolean;
};

export const ConfirmDeleteUser = ({
    onConfirm,
    loading,
    disabled
}: ConfirmDeleteUserProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const onOk = () => {
        onClose();
        onConfirm();
    };

    const onOpen = () => setIsOpen(true);

    const onClose = () => setIsOpen(false);

    return (
        <>
            <Button
                onClick={onOpen}
                variant="danger"
                loading={loading}
                disabled={disabled}
            >
                Delete
            </Button>

            <Modal open={isOpen} onClose={onClose}>
                <ModalTitle>Delete User</ModalTitle>
                <ModalBody>
                    Are you sure you want to delete this user account? All of
                    the data will be permanently removed. This action cannot be
                    undone.
                </ModalBody>
                <ButtonGroup>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={onOk}>
                        Delete
                    </Button>
                </ButtonGroup>
            </Modal>
        </>
    );
};
