import Link from 'next/link';
import { logoutAction } from '@/app/account/actions/logout-action';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { getSession } from '@/lib/session';

export async function Header() {
    const session = await getSession();

    return (
        <header className="mb-6 border-b">
            <div className="mx-auto flex max-w-screen-sm items-center gap-2 px-6 py-4 sm:px-0">
                <div className="flex items-center gap-2">
                    <Button
                        asChild
                        variant="link"
                        className="scroll-m-20 text-xl font-semibold tracking-tight"
                    >
                        <Link href="/">Halcyon</Link>
                    </Button>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <MainNav session={session} />
                    <ModeToggle />
                    <UserNav session={session} onLogout={logoutAction} />
                </div>
            </div>
        </header>
    );
}
