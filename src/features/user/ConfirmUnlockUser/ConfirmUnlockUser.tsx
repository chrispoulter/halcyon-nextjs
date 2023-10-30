import { useState } from 'react';
import { Modal, ModalBody, ModalTitle } from '@/components/Modal/Modal';
import { ButtonGroup } from '@/components/Button/ButtonGroup';
import { Button } from '@/components/Button/Button';

type ConfirmUnlockUserProps = {
    onConfirm: () => void;
    loading?: boolean;
    disabled?: boolean;
};

export const ConfirmUnlockUser = ({
    onConfirm,
    loading,
    disabled
}: ConfirmUnlockUserProps) => {
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
                Unlock
            </Button>

            <Modal open={isOpen} onClose={onClose}>
                <ModalTitle>Unlock User</ModalTitle>
                <ModalBody>
                    Are you sure you want to unlock this user account? The user
                    will now be able to access the system.
                </ModalBody>
                <ButtonGroup>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="warning" onClick={onOk}>
                        Unlock
                    </Button>
                </ButtonGroup>
            </Modal>
        </>
    );
};
