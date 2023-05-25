import Link from 'next/link';

type BodyLinkProps = React.PropsWithChildren<{
    href: string;
}>;

export const BodyLink = ({ href, children }: BodyLinkProps) => (
    <Link
        href={href}
        className="text-cyan-600 underline hover:text-cyan-700 focus:text-cyan-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
    >
        {children}
    </Link>
);
