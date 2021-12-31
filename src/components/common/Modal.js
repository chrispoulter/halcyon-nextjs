import React from 'react';
import { useDispatch } from 'react-redux';
import BoostrapModal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useModal } from '../../hooks';
import { showModal } from '../../features';

export const Modal = () => {
    const dispatch = useDispatch();

    const { title, body, onOk } = useModal();

    const hideModal = () =>
        dispatch(
            showModal({
                invariant: undefined,
                message: undefined
            })
        );

    const onConfirm = async () => {
        await onOk();

        dispatch(
            showModal({
                invariant: undefined,
                message: undefined
            })
        );
    };

    return (
        <BoostrapModal show={!!title} onHide={hideModal}>
            <BoostrapModal.Header closeButton>
                <BoostrapModal.Title>{title}</BoostrapModal.Title>
            </BoostrapModal.Header>
            <BoostrapModal.Body>{body}</BoostrapModal.Body>
            <BoostrapModal.Footer>
                <Button variant="secondary" onClick={hideModal}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                    Ok
                </Button>
            </BoostrapModal.Footer>
        </BoostrapModal>
    );
};
