import Link from 'next/link';
import { getSession } from '@/lib/session';
import { ModeToggle } from './mode-toggle';
import { MainMenu } from './main-menu';
import { UserMenu } from './user-menu';

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
                    <MainMenu session={session} />
                    <ModeToggle />
                    <UserMenu session={session} />
                </div>
            </div>
        </header>
    );
}
