import { Confirm, ConfirmProps } from '@/components/Confirm/Confirm';
import { Modal, ModalBody, ModalTitle } from '@/components/Modal/Modal';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { Button } from '@/components/Button/Button';

type ConfirmDeleteAccountProps = Pick<ConfirmProps, 'children' | 'onConfirm'>;

export const ConfirmDeleteAccount = ({
    children,
    onConfirm
}: ConfirmDeleteAccountProps) => (
    <Confirm
        onConfirm={onConfirm}
        content={(onOk, onCancel) => (
            <Modal open={true} onClose={onCancel}>
                <ModalTitle>Delete Account</ModalTitle>
                <ModalBody>
                    Are you sure you want to delete your account? All of your
                    data will be permanently removed. This action cannot be
                    undone.
                </ModalBody>
                <ButtonGroup>
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={onOk}>
                        Delete
                    </Button>
                </ButtonGroup>
            </Modal>
        )}
    >
        {children}
    </Confirm>
);
