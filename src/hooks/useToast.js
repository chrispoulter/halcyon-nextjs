import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectToast } from '../features';

export const useToast = () => {
    const { variant, message } = useSelector(selectToast);
    return useMemo(() => ({ variant, message }), [variant, message]);
};
