import { Confirm, ConfirmProps } from '@/components/Confirm/Confirm';
import { Modal, ModalBody, ModalTitle } from '@/components/Modal/Modal';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { Button } from '@/components/Button/Button';

type ConfirmDeleteUserProps = Pick<ConfirmProps, 'children' | 'onConfirm'>;

export const ConfirmDeleteUser = ({
    children,
    onConfirm
}: ConfirmDeleteUserProps) => (
    <Confirm
        onConfirm={onConfirm}
        content={(onOk, onCancel) => (
            <Modal open={true} onClose={onCancel}>
                <ModalTitle>Delete User</ModalTitle>
                <ModalBody>
                    Are you sure you want to delete this user account? All of
                    the data will be permanently removed. This action cannot be
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
