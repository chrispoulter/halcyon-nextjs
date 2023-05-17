import { Confirm, ConfirmProps } from '@/components/Confirm/Confirm';
import { Modal, ModalBody, ModalTitle } from '@/components/Modal/Modal';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { Button } from '@/components/Button/Button';

type ConfirmLockUserProps = Pick<ConfirmProps, 'children' | 'onConfirm'>;

export const ConfirmLockUser = ({
    children,
    onConfirm
}: ConfirmLockUserProps) => (
    <Confirm
        onConfirm={onConfirm}
        content={(onOk, onCancel) => (
            <Modal open={true} onClose={onCancel}>
                <ModalTitle>Lock User</ModalTitle>
                <ModalBody>
                    Are you sure you want to lock this user account? The user
                    will no longer be able to access the system.
                </ModalBody>
                <ButtonGroup>
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="warning" onClick={onOk}>
                        Lock
                    </Button>
                </ButtonGroup>
            </Modal>
        )}
    >
        {children}
    </Confirm>
);
