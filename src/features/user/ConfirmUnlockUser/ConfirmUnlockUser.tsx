import { Confirm, ConfirmProps } from '@/components/Confirm/Confirm';
import { Modal, ModalBody, ModalTitle } from '@/components/Modal/Modal';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { Button } from '@/components/Button/Button';

type ConfirmUnlockUserProps = Pick<ConfirmProps, 'children' | 'onConfirm'>;

export const ConfirmUnlockUser = ({
    children,
    onConfirm
}: ConfirmUnlockUserProps) => (
    <Confirm
        onConfirm={onConfirm}
        content={(onOk, onCancel) => (
            <Modal open={true} onClose={onCancel}>
                <ModalTitle>Unlock User</ModalTitle>
                <ModalBody>
                    Are you sure you want to unlock this user account? The user
                    will now be able to access the system.
                </ModalBody>
                <ButtonGroup>
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="warning" onClick={onOk}>
                        Unlock
                    </Button>
                </ButtonGroup>
            </Modal>
        )}
    >
        {children}
    </Confirm>
);
