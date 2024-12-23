import Link from 'next/link';
import { logoutAction } from '@/app/actions/logoutAction';
import { ModeToggle } from '@/components/mode-toggle';
import { UserMenu } from '@/components/user-menu';
import { getSession } from '@/lib/session';

export async function Header() {
    const session = await getSession();

    return (
        <header className="mx-auto flex max-w-screen-sm items-center justify-between gap-2 p-6">
            <Link
                href="/"
                className="scroll-m-20 text-xl font-semibold tracking-tight"
            >
                Halcyon
            </Link>
            <ModeToggle />
            <UserMenu session={session} onLogout={logoutAction} />
        </header>
    );
}
