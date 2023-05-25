import React, { useState } from 'react';

export type ConfirmProps = React.PropsWithChildren<{
    onConfirm: () => Promise<void>;
    content: (onOk: () => void, onCancel: () => void) => JSX.Element;
    children: React.ReactElement<
        { onClick: () => void },
        string | React.JSXElementConstructor<any>
    >;
}>;

export const Confirm = ({ children, onConfirm, content }: ConfirmProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const onOk = async () => {
        onClose();
        onConfirm();
    };

    const onOpen = () => setIsOpen(true);

    const onClose = () => setIsOpen(false);

    return (
        <>
            {React.cloneElement(children, { onClick: onOpen })}
            {isOpen && <>{content(onOk, onClose)}</>}
        </>
    );
};
