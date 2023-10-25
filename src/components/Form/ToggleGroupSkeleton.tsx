type ToggleGroupSkeletonProps = { className?: string };

export const ToggleGroupSkeleton = ({
    className
}: ToggleGroupSkeletonProps) => (
    <div className={className}>
        <div className="mb-2 h-5 w-3/12 bg-gray-200" />
        {[...Array(2)].map((_, index) => (
            <div
                key={index}
                className="mb-2 flex w-full items-center justify-between gap-5 border px-5 py-3 sm:py-2"
            >
                <div className="w-full">
                    <div className="mb-1 h-5 w-3/12 bg-gray-200" />
                    <div className="h-5 w-9/12 bg-gray-100" />
                </div>
                <div className="inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-gray-200" />
            </div>
        ))}
    </div>
);
