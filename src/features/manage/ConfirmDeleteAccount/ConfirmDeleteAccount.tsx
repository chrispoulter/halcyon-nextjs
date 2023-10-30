import { useState } from 'react';
import { Modal, ModalBody, ModalTitle } from '@/components/Modal/Modal';
import { ButtonGroup } from '@/components/Button/ButtonGroup';
import { Button } from '@/components/Button/Button';

type ConfirmDeleteAccountProps = {
    onConfirm: () => void;
    loading?: boolean;
    disabled?: boolean;
};

export const ConfirmDeleteAccount = ({
    onConfirm,
    loading,
    disabled
}: ConfirmDeleteAccountProps) => {
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
                Delete Account
            </Button>

            <Modal open={isOpen} onClose={onClose}>
                <ModalTitle>Delete Account</ModalTitle>
                <ModalBody>
                    Are you sure you want to delete your account? All of your
                    data will be permanently removed. This action cannot be
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
