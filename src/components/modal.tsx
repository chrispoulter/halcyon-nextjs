import { Dialog, DialogPanel } from '@headlessui/react';

type ModalProps = React.PropsWithChildren<{
    open: boolean;
    onClose: () => void;
}>;

export const Modal = ({ children, open, onClose }: ModalProps) => (
    <Dialog
        open={open}
        onClose={onClose}
        className="fixed inset-0 flex flex-col items-center justify-end bg-black bg-opacity-50 p-2 sm:justify-center"
    >
        <DialogPanel className="bg-white p-8 shadow-xl sm:max-w-md">
            {children}
        </DialogPanel>
    </Dialog>
);

export const ModalTitle = ({ children }: React.PropsWithChildren) => (
    <div className="mb-2 text-lg font-semibold leading-tight text-gray-900">
        {children}
    </div>
);

export const ModalBody = ({ children }: React.PropsWithChildren) => (
    <div className="mb-5 text-sm text-gray-600">{children}</div>
);
