import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features';

export const useAuth = () => {
    const currentUser = useSelector(selectCurrentUser);
    return useMemo(() => ({ currentUser }), [currentUser]);
};
