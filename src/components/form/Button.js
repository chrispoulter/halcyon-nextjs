import React from 'react';
import BaseButton from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export const Button = React.forwardRef(
    ({ loading, disabled, children, ...rest }, ref) => (
        <BaseButton disabled={loading || disabled} {...rest} ref={ref}>
            {loading ? (
                <>
                    <Spinner animation="grow" size="sm" />
                    <Spinner animation="grow" size="sm" />
                    <Spinner animation="grow" size="sm" />
                </>
            ) : (
                children
            )}
        </BaseButton>
    )
);

Button.displayName = 'Button';
