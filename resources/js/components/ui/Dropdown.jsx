import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Fragment } from "react";

export default function DropDown({ buttonText = "Options", items = [], align = "right" }) {
    const alignClasses =
        align === "left"
            ? "left-0 origin-top-left"
            : "right-0 origin-top-right";

    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs0 ring-1 ring-gray-300 hover:bg-gray-50">
                {buttonText}
                <ChevronDown
                    aria-hidden="true"
                    className="-mr-1 h-5 w-5 text-gray-400 "
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
                <MenuItems className={`absolute z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md bg-white shadow-lg outline-1 outline-black/5 ${alignClasses}`}>
                    {items.map((group, groupIndex) => (
                        <div className="py-1" key={groupIndex}>
                            <MenuItem>
                                <a
                                onClick={group.onClick}
                                    href={group.href || "#"}
                                    className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 "
                                >
                                    {group.icon && (
                                        <group.icon
                                            aria-hidden="true"
                                            className="mr-3 h-5 w-5 text-gray-400 group-focus:text-gray-500 "
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
