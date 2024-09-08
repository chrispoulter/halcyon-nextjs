type InputSkeletonProps = { className?: string };

export const InputSkeleton = ({ className }: InputSkeletonProps) => (
    <div className={className}>
        <div className="mb-2 h-5 w-4/12 bg-gray-200" />
        <div className="h-11 w-full border bg-gray-100 sm:h-9" />
    </div>
);
