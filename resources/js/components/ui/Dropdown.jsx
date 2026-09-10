import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Fragment } from "react";

export default function DropDown({ buttonText = "Options", items = [] }) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:ring-white/5 dark:hover:bg-white/20">
                {buttonText}
                <ChevronDown
                    aria-hidden="true"
                    className="-mr-1 h-5 w-5 text-gray-400 dark:text-gray-500"
                />
            </MenuButton>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg outline-1 outline-black/5 dark:divide-white/10 dark:bg-gray-800 dark:shadow-none dark:outline-white/10">
                    {items.map((group, groupIndex) => (
                        <div className="py-1" key={groupIndex}>
                            <MenuItem>
                                <a
                                onClick={group.onClick}
                                    href={group.href || "#"}
                                    className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 dark:text-gray-300 dark:focus:bg-white/5 dark:focus:text-white"
                                >
                                    {group.icon && (
                                        <group.icon
                                            aria-hidden="true"
                                            className="mr-3 h-5 w-5 text-gray-400 group-focus:text-gray-500 dark:text-gray-500 dark:group-focus:text-white"
                                        />
                                    )}
                                    {group.label}
                                </a>
                            </MenuItem>
                        </div>
                    ))}
                </MenuItems>
            </Transition>
        </Menu>
    );
}
