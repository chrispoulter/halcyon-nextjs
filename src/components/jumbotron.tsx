export const Jumbotron = ({ children }: React.PropsWithChildren) => (
    <section className="mb-3 flex min-h-96 items-center bg-gray-200">
        <div className="container mx-auto max-w-screen-md justify-center p-10 px-5">
            {children}
        </div>
    </section>
);

export const JumbotronTitle = ({ children }: React.PropsWithChildren) => (
    <h1 className="mb-3 border-b border-gray-400 pb-3 text-4xl font-light leading-tight text-gray-900">
        {children}
    </h1>
);

export const JumbotronBody = ({ children }: React.PropsWithChildren) => (
    <p className="mb-5 text-lg font-thin leading-relaxed text-gray-700">
        {children}
    </p>
);
