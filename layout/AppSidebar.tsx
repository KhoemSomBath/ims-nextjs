'use client';

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useSidebar} from "@/context/SidebarContext";
import {
    BoxesIcon,
    ChevronDownIcon, ClockIcon,
    CurrencyIcon, FileTextIcon, HourglassIcon, LayersIcon,
    LayoutDashboardIcon,
    MoreHorizontal,
    PackageIcon, PieChart, RepeatIcon, Settings,
    ShieldIcon,
    ShoppingCartIcon, SlidersHorizontal,
    TagsIcon, TrendingUpIcon,
    TruckIcon,
    UsersIcon,
    WarehouseIcon,
} from "lucide-react";

// Type definitions
type SubItem = {
    name: string;
    path: string;
    new?: boolean;
    icon: React.ReactNode;
};

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: SubItem[];
};

type NavGroup = {
    name: string;
    items: NavItem[];
};

// Memoized navigation configuration
const useNavConfig = () => {
    return useMemo(() => [
        {
            name: "main",
            items: [
                {
                    icon: <LayoutDashboardIcon/>,
                    name: "Dashboard",
                    path: "/",
                },
                {
                    icon: <UsersIcon/>,
                    name: "User Profile",
                    path: "/profile",
                },
            ],
        },
        {
            name: "product",
            items: [
                {
                    icon: <PackageIcon/>,
                    name: "Products",
                    path: "/products",
                },
                {
                    icon: <TagsIcon/>,
                    name: "Categories",
                    path: "/categories",
                },
            ],
        },
        {
            name: "inventory",
            items: [
                {
                    icon: <WarehouseIcon />,
                    name: "Warehouse",
                    path: "/warehouse",  // This could be the default sub-item path
                    subItems: [
                        {
                            name: "ALL Warehouse",
                            path: "/warehouse",
                            icon: <BoxesIcon className="w-4 h-4" />
                        },
                        {
                            name: "Stock Levels",
                            path: "/warehouse/stock",
                            icon: <LayersIcon className="w-4 h-4" />
                        },
                        {
                            name: "Stock Adjustments",
                            path: "/warehouse/adjustments",
                            icon: <SlidersHorizontal className="w-4 h-4" />
                        },
                        {
                            name: "Movements",
                            path: "/warehouse/movements",
                            icon: <RepeatIcon className="w-4 h-4" />
                        }
                    ]
                },
                {
                    icon: <TruckIcon />,
                    name: "Suppliers",
                    path: "/suppliers",
                },
                {
                    icon: <ShoppingCartIcon />,
                    name: "Purchase",
                    path: "/purchase",
                    subItems: [
                        {
                            name: "Purchase Orders",
                            path: "/purchase/orders",
                            icon: <FileTextIcon className="w-4 h-4" />
                        },
                        {
                            name: "Purchase History",
                            path: "/purchase/history",
                            icon: <ClockIcon className="w-4 h-4" />
                        }

                    ]
                },
                // Optional additional main items
                {
                    icon: <PieChart />,
                    name: "Reports",
                    path: "/inventory/reports",
                    subItems: [
                        {
                            name: "Inventory Valuation",
                            path: "/inventory/reports/valuation",
                            icon: <TrendingUpIcon className="w-4 h-4" />
                        },
                        {
                            name: "Stock Aging",
                            path: "/inventory/reports/aging",
                            icon: <HourglassIcon className="w-4 h-4" />
                        }
                    ]
                }
            ]
        },
        {
            name: "administrator",
            items: [
                {
                    icon: <UsersIcon/>,
                    name: "Users",
                    path: "/users",
                },
                {
                    icon: <ShieldIcon/>,
                    name: "Roles",
                    path: "/roles",
                },
                {
                    icon: <CurrencyIcon/>,
                    name: "Currency",
                    path: "/currency",
                },
                {
                    icon: <Settings/>,
                    name: "Settings",
                    path: "/settings",
                },
            ],
        },
    ] as NavGroup[], []);
};

const AppSidebar: React.FC = () => {

    const {isExpanded, isMobileOpen, isHovered, setIsHovered} = useSidebar();
    const pathname = usePathname();
    const [openSubmenu, setOpenSubmenu] = useState<{ type: string; index: number } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const allNavGroups = useNavConfig();

    // Memoize the active path check
    const isActive = useCallback(
        (path: string) => {
            if (path === "/") {
                return pathname === "/";
            }
            return pathname.startsWith(path);
        },
        [pathname]
    );

    // Check if current path matches any submenu item on route change
    useEffect(() => {
        let submenuMatched = false;

        allNavGroups.forEach((group) => {
            group.items.forEach((nav, index) => {
                if (nav.subItems) {
                    const hasActiveSubItem = nav.subItems.some((subItem) => isActive(subItem.path));
                    if (hasActiveSubItem) {
                        setOpenSubmenu({type: group.name, index});
                        submenuMatched = true;
                    }
                }
            });
        });

        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [pathname, isActive, allNavGroups]);

    // Update submenu heights when opened
    useEffect(() => {
        if (openSubmenu) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            const element = subMenuRefs.current[key];
            if (element) {
                setSubMenuHeight((prev) => ({
                    ...prev,
                    [key]: element.scrollHeight,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = useCallback((index: number, menuType: string) => {
        setOpenSubmenu((prev) =>
            prev?.type === menuType && prev.index === index
                ? null
                : {type: menuType, index}
        );
    }, []);

    // Memoized menu item component
    const MenuItem = React.memo(({
                                     nav,
                                     menuType,
                                     index,
                                     isActive,
                                     isExpanded,
                                     isHovered,
                                     isMobileOpen
                                 }: {
        nav: NavItem;
        menuType: string;
        index: number;
        isActive: (path: string) => boolean;
        isExpanded: boolean;
        isHovered: boolean;
        isMobileOpen: boolean;
    }) => {
        const hasSubItems = !!nav.subItems;
        const isSubmenuOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        const showText = isExpanded || isHovered || isMobileOpen;

        if (hasSubItems) {
            return (
                <>
                    <button
                        onClick={() => handleSubmenuToggle(index, menuType)}
                        className={`menu-item group ${
                            isSubmenuOpen ? "menu-item-active" : "menu-item-inactive"
                        } cursor-pointer`}
                        aria-expanded={isSubmenuOpen}
                        aria-controls={`submenu-${menuType}-${index}`}
                    >
                    <span className={isSubmenuOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"}>
                        {nav.icon}
                    </span>
                        {/* Always render text but control visibility */}
                        <span className={`menu-item-text   ${
                            showText ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0 ml-0'
                        }`}>
                            {nav.name}
                        </span>
                        {/* Always render chevron but control visibility */}
                        <ChevronDownIcon
                            className={`ml-auto w-5 h-5 ${
                                showText ? 'opacity-100' : 'opacity-0 w-0'
                            } ${
                                isSubmenuOpen ? "rotate-180 text-brand-500" : ""
                            }`}
                        />
                    </button>

                    {/* Always render submenu container but control height */}
                    <div
                        ref={(el) => {
                            subMenuRefs.current[`${menuType}-${index}`] = el;
                        }}
                        id={`submenu-${menuType}-${index}`}
                        className="overflow-hidden  "
                        style={{
                            height: isSubmenuOpen ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px",
                        }}
                        aria-hidden={!isSubmenuOpen}
                    >
                        <ul className={`mt-2 space-y-1   ${
                            showText ? 'ml-9' : 'ml-0'
                        }`}>
                            {nav.subItems?.map((subItem) => (
                                <SubMenuItem
                                    key={subItem.path}
                                    subItem={subItem}
                                    isActive={isActive}
                                />
                            ))}
                        </ul>
                    </div>
                </>
            );
        }

        return nav.path ? (
            <Link
                href={nav.path}
                className={`menu-item group ${
                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
                aria-current={isActive(nav.path) ? "page" : undefined}
            >
            <span className={isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}>
                {nav.icon}
            </span>
                {/* Always render text but control visibility */}
                <span className={`menu-item-text   ${
                    showText ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0 ml-0'
                }`}>
                {nav.name}
            </span>
            </Link>
        ) : null;
    });
    MenuItem.displayName = 'MenuItem';


    const SubMenuItem = React.memo(({
                                        subItem,
                                        isActive
                                    }: {
        subItem: SubItem;
        isActive: (path: string) => boolean;
    }) => {
        const isItemActive = isActive(subItem.path);

        return (
            <li key={subItem.path}>
                <Link
                    href={subItem.path}
                    className={`menu-dropdown-item flex items-center gap-2 ${
                        isItemActive ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                    }`}
                    aria-current={isItemActive ? "page" : undefined}
                >
                    {/* Icon if present */}
                    {subItem.icon && (
                        <span className="text-muted-foreground">
                        {subItem.icon}
                    </span>
                    )}

                    {/* Name */}
                    <span>{subItem.name}</span>

                </Link>
            </li>
        );
    });

    SubMenuItem.displayName = 'SubMenuItem';


    const GroupHeader = React.memo(function GroupHeader({
                                                            groupName,
                                                            isExpanded,
                                                            isHovered,
                                                            isMobileOpen
                                                        }: {
        groupName: string;
        isExpanded: boolean;
        isHovered: boolean;
        isMobileOpen: boolean;
    }) {
        const showText = isExpanded || isHovered || isMobileOpen;

        return (
            <h2 className={`
            relative mb-2 h-5 text-xs uppercase leading-[20px] text-gray-400 
            "lg:justify-center" : "justify-start"
            flex items-center overflow-hidden
        `}>
                {/* Group Name */}
                <span className={`
                absolute   ease-in-out
                ${showText ? 'opacity-100 delay-100 translate-x-0' : 'opacity-0 -translate-x-4'}
            `}>
                {groupName}
            </span>

                {/* Three Dots Icon */}
                <span className={`
                absolute left-1/2 -translate-x-1/2   ease-in-out
                ${!showText ? 'opacity-100 delay-100' : 'opacity-0 translate-x-4'}
            `}>
                <MoreHorizontal className="w-4 h-4"/>
            </span>
            </h2>
        );
    });
    GroupHeader.displayName = 'GroupHeader';

// Memoized logo component with smooth transitions
    const Logo = React.memo(function Logo({
                                              isExpanded,
                                              isHovered,
                                              isMobileOpen
                                          }: {
        isExpanded: boolean;
        isHovered: boolean;
        isMobileOpen: boolean;
    }) {
        const showText = isExpanded || isHovered || isMobileOpen;

        return (
            <Link
                href="/"
                aria-label="Home"
                className="flex items-center h-12 overflow-hidden relative"
            >
                {/* Logo icon - always visible */}
                <div className="flex items-center justify-center w-8 h-8 bg-brand-500 text-white rounded-lg z-10 ">
                    <span className="font-bold text-sm">IMS</span>
                </div>

                {/* Text that slides in/out */}
                <span className={`
                ml-3 text-lg font-semibold dark:text-white whitespace-nowrap
                  ease-in-out
                ${showText ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}
            `}>
                IMS System
            </span>
            </Link>
        );
    });
    Logo.displayName = 'Logo';


    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen z-50 border-r border-gray-200 
    ${
                isExpanded || isMobileOpen
                    ? "w-[290px]   ease-out"
                    : isHovered
                        ? "w-[290px]   ease-out"
                        : "w-[90px]   ease-in"
            }
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Main navigation"
        >
            <div className={`py-4 flex justify-center`}>
                <Logo
                    isExpanded={isExpanded}
                    isHovered={isHovered}
                    isMobileOpen={isMobileOpen}
                />
            </div>

            <div className="flex flex-col overflow-y-auto  ease-linear no-scrollbar">
                <nav>
                    <div className="flex flex-col gap-2">
                        {allNavGroups.map((group) => (
                            <div key={group.name} className="mb-2">
                                <GroupHeader
                                    groupName={group.name}
                                    isExpanded={isExpanded}
                                    isHovered={isHovered}
                                    isMobileOpen={isMobileOpen}
                                />
                                <ul className="flex flex-col gap-2.5">
                                    {group.items.map((nav, index) => (
                                        <li key={`${group.name}-${nav.name}-${index}`}>
                                            <MenuItem
                                                nav={nav}
                                                menuType={group.name}
                                                index={index}
                                                isActive={isActive}
                                                isExpanded={isExpanded}
                                                isHovered={isHovered}
                                                isMobileOpen={isMobileOpen}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;