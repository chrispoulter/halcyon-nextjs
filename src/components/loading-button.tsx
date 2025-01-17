import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';

type LoadingButtonProps = { loading?: boolean } & ButtonProps;

export function LoadingButton({
    loading,
    children,
    disabled,
    ...rest
}: LoadingButtonProps) {
    return (
        <Button {...rest} disabled={disabled || loading}>
            {loading ? <Loader2 className="animate-spin" /> : children}
        </Button>
    );
}
