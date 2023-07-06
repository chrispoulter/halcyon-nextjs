import { Provider } from 'react-redux';
import { makeStore } from '@/redux/store';

export const queryWrapper = ({ children }: { children: React.ReactNode }) => {
    const store = makeStore();
    return <Provider store={store}>{children}</Provider>;
};
