import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { SortIcon } from '@/components/sort-icon';
import { UserSort } from '@/features/user/user-types';
import { cn } from '@/lib/utils';

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

type SortUserDropdownProps = {
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
        <MenuButton
            aria-label="Sort"
            disabled={isLoading}
            className="h-full w-full bg-gray-300 px-5 py-2 font-light text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 sm:py-1"
        >
            <SortIcon className="h-4 w-4" />
        </MenuButton>

        <MenuItems className="absolute right-0 z-10 mt-1 w-44 border bg-white shadow focus:outline-none">
            {options.map(({ value, label }) => (
                <MenuItem key={value} disabled={selected === value}>
                    {({ focus, disabled }) => (
                        <button
                            type="button"
                            onClick={() => onSelect(value)}
                            disabled={disabled}
                            className={cn(
                                'w-full px-5 py-3 text-left text-sm text-gray-800',
                                {
                                    'bg-gray-200': focus,
                                    'bg-cyan-600 text-white': disabled
                                }
                            )}
                        >
                            {label}
                        </button>
                    )}
                </MenuItem>
            ))}
        </MenuItems>
    </Menu>
);
