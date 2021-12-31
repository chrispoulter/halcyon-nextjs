import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectModal } from '../features';

export const useModal = () => {
    const { title, body, onOk } = useSelector(selectModal);
    return useMemo(() => ({ title, body, onOk }), [{ title, body, onOk }]);
};
