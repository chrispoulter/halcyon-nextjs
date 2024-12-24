import Link from 'next/link';
import { logoutAction } from '@/app/actions/logoutAction';
import { Button } from '@/components/ui/button';
import { HasPermission } from '@/components/has-permission';
import { ModeToggle } from '@/components/mode-toggle';
import { UserNav } from '@/components/user-nav';
import { Role } from '@/lib/definitions';
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
                    <nav className="flex gap-2">
                        <HasPermission
                            session={session}
                            requiredRoles={[
                                Role.SYSTEM_ADMINISTRATOR,
                                Role.USER_ADMINISTRATOR,
                            ]}
                        >
                            <Button asChild variant="link">
                                <Link href="/user">Users</Link>
                            </Button>
                        </HasPermission>
                    </nav>

                    <ModeToggle />

                    <UserNav session={session} onLogout={logoutAction} />
                </div>
            </div>
        </header>
    );
}
