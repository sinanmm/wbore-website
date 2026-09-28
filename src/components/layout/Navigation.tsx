import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV_ITEMS, NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface NavigationProps {
  items?: NavItem[];
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
}

export function Navigation({
  items = MAIN_NAV_ITEMS,
  className,
  itemClassName,
  activeClassName,
}: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-1.5 lg:gap-2", className)}>
      {items.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-200 rounded-md relative",
              isActive
                ? activeClassName || "text-wbre-lightGold font-semibold"
                : "text-slate-300 hover:text-white hover:bg-white/5",
              itemClassName
            )}
          >
            {link.name}
            {isActive && (
              <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-wbre-primaryGold rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default Navigation;
