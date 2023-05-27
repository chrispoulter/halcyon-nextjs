import { BodyLink } from '@/components/BodyLink/BodyLink';
import { currentYear } from '@/utils/date';
import { config } from '@/utils/client';

export const Footer = () => (
    <footer className="container mx-auto mb-3 mt-8 flex max-w-screen-md justify-between border-t p-3 text-sm text-gray-400">
        <p>
            &copy;{' '}
            <BodyLink href="https://www.chrispoulter.com">
                Chris Poulter
            </BodyLink>{' '}
            {currentYear}
        </p>
        <p>v{config.NEXT_PUBLIC_GITVERSION_SEMVER}</p>
    </footer>
);
