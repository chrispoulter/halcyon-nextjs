import { UserSort } from '@/models/user.types';
import clsx from 'clsx';
import { Menu } from '@headlessui/react';
import { SortIcon } from '@/components/Icons/SortIcon';

const options = [
    {
        value: UserSort.NAME_ASC,
        label: 'Name A-Z'
    },
    {
        value: UserSort.NAME_DESC,
        label: 'Name Z-A'
    },
    {
        value: UserSort.EMAIL_ADDRESS_ASC,
        label: 'Email Address A-Z'
    },
    {
        value: UserSort.EMAIL_ADDRESS_DESC,
        label: 'Email Address Z-A'
    }
];

export type SortUserDropdownProps = {
    selected?: UserSort;
    onSelect: (value: UserSort) => void;
    isLoading?: boolean;
};

export const SortUserDropdown = ({
    selected,
    onSelect,
    isLoading
}: SortUserDropdownProps) => (
    <Menu as="div" className="relative">
        <Menu.Button
            aria-label="Sort"
            disabled={isLoading}
            className="h-full w-full bg-gray-300 px-5 py-2 font-light text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 sm:py-1"
        >
            <SortIcon className="h-4 w-4" />
        </Menu.Button>

        <Menu.Items className="absolute right-0 z-10 mt-1 w-44 border bg-white shadow focus:outline-none">
            {options.map(({ value, label }) => (
                <Menu.Item key={value} disabled={selected === value}>
                    {({ active, disabled }) => (
                        <button
                            type="button"
                            onClick={() => onSelect(value)}
                            disabled={disabled}
                            className={clsx(
                                'w-full px-5 py-3 text-left text-sm text-gray-800',
                                {
                                    'bg-gray-200': active,
                                    'bg-cyan-600 text-white': disabled
                                }
                            )}
                        >
                            {label}
                        </button>
                    )}
                </Menu.Item>
            ))}
        </Menu.Items>
    </Menu>
);
