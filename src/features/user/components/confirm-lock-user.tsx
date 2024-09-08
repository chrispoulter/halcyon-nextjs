import { useState } from 'react';
import { Modal, ModalBody, ModalTitle } from '@/components/modal';
import { ButtonGroup } from '@/components/button-group';
import { Button } from '@/components/button';

type ConfirmLockUserProps = {
    onConfirm: () => void;
    loading?: boolean;
    disabled?: boolean;
};

export const ConfirmLockUser = ({
    onConfirm,
    loading,
    disabled
}: ConfirmLockUserProps) => {
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
                variant="warning"
                loading={loading}
                disabled={disabled}
            >
                Lock
            </Button>

            <Modal open={isOpen} onClose={onClose}>
                <ModalTitle>Lock User</ModalTitle>
                <ModalBody>
                    Are you sure you want to lock this user account? The user
                    will no longer be able to access the system.
                </ModalBody>
                <ButtonGroup>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="warning" onClick={onOk}>
                        Lock
                    </Button>
                </ButtonGroup>
            </Modal>
        </>
    );
};
