export const PageTitle = ({ children }: React.PropsWithChildren) => (
    <h1 className="mb-5 border-b pb-3 text-3xl font-light leading-tight text-gray-900">
        {children}
    </h1>
);

export const PageSubTitle = ({ children }: React.PropsWithChildren) => (
    <small className="block text-2xl text-gray-500">{children}</small>
);
