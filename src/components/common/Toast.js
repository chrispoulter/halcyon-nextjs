import React from 'react';
import { useDispatch } from 'react-redux';
import BootstrapToast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { useToast } from '../../hooks';
import { toast } from '../../features';

export const Toast = () => {
    const dispatch = useDispatch();

    const { variant, message } = useToast();
    console.log({ variant, message });

    const hideToast = () =>
        dispatch(
            toast({
                variant: undefined,
                message: undefined
            })
        );

    return (
        <ToastContainer position="bottom-end" className="p-3">
            <BootstrapToast
                bg={variant}
                onClose={() => hideToast()}
                show={!!message}
                delay={5000}
                autohide
            >
                <BootstrapToast.Body className="d-flex">
                    <div className="text-white">{message}</div>
                    <button
                        type="button"
                        onClick={() => hideToast()}
                        className="btn-close btn-close-white me-2 m-auto"
                    />
                </BootstrapToast.Body>
            </BootstrapToast>
        </ToastContainer>
    );
};
