import Link from 'next/link';
import { getSession } from '@/lib/session';
import { ModeToggle } from './mode-toggle';
import { MainNav } from './main-nav';
import { UserNav } from './user-nav';

export async function Header() {
    const session = await getSession();

    return (
        <header className="mb-6 border-b">
            <div className="mx-auto flex max-w-screen-sm items-center gap-2 px-6 py-4 sm:px-0">
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="scroll-m-20 text-xl font-semibold tracking-tight"
                    >
                        Halcyon
                    </Link>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <MainNav session={session} />
                    <ModeToggle />
                    <UserNav session={session} />
                </div>
            </div>
        </header>
    );
}
