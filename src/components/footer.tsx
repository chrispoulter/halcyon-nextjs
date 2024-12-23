export function Footer() {
    return (
        <footer className="mx-auto flex max-w-screen-sm justify-between gap-6 p-6">
            <div className="leading-7">
                &copy;{' '}
                <a
                    href="http://www.chrispoulter.com"
                    className="font-medium text-primary underline underline-offset-4"
                >
                    Chris Poulter
                </a>{' '}
                2024
            </div>
            <div className="leading-7">v1.0.0</div>
        </footer>
    );
}
