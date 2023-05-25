import React, { ErrorInfo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Error from '@/pages/500';

type ErrorBoundaryProps = React.PropsWithChildren<{
    hasError: boolean;
    setHasError: React.Dispatch<React.SetStateAction<boolean>>;
}>;

type ErrorBoundaryState = {
    hasError: boolean;
};

class ErrorBoundaryInner extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);

        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        if (!this.props.hasError && prevProps.hasError) {
            this.setState({ hasError: false });
        }
    }

    componentDidCatch(_: Error, __: ErrorInfo) {
        // console.error('client error', { error, info });
        this.props.setHasError(true);
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return <Error />;
    }
}

const ErrorBoundary = ({ children }: React.PropsWithChildren) => {
    const [hasError, setHasError] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (hasError) {
            setHasError(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.asPath]);

    return (
        <ErrorBoundaryInner hasError={hasError} setHasError={setHasError}>
            {children}
        </ErrorBoundaryInner>
    );
};

export default ErrorBoundary;
