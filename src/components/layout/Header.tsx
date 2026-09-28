"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { MAIN_NAV_ITEMS } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isHomepage = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || !isHomepage
          ? "bg-wbre-deepNavy/95 backdrop-blur-md border-b border-wbre-primaryGold/20 shadow-navy-depth py-3.5"
          : "bg-wbre-deepNavy/40 backdrop-blur-sm border-b border-white/5 py-4 sm:py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Institutional Title */}
        <Logo size="md" href="/" priority />

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1.5 lg:gap-2">
          {MAIN_NAV_ITEMS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-200 rounded-md relative",
                  isActive
                    ? "text-wbre-lightGold font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
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

        {/* Primary Desktop Action CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/verify"
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-300 hover:text-wbre-lightGold px-3 py-2 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-wbre-primaryGold" />
            <span>Verify</span>
          </Link>

          <Button href="/apply" variant="gold" size="sm">
            Apply For A Record
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          <Button href="/apply" variant="gold" size="sm" className="text-[10px] px-3 py-1.5">
            Apply
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-wbre-primaryGold"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-wbre-deepNavy/98 backdrop-blur-xl border-b border-wbre-primaryGold/30 px-5 pt-4 pb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-1">
            {MAIN_NAV_ITEMS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium uppercase tracking-wider rounded-md transition-colors flex items-center justify-between",
                    isActive
                      ? "bg-wbre-primaryGold/15 text-wbre-lightGold font-semibold border-l-2 border-wbre-primaryGold"
                      : "text-slate-200 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="text-xs text-wbre-primaryGold">Active</span>}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Button href="/apply" variant="gold" size="md" className="w-full">
              Apply For A Record
            </Button>
            <Button href="/verify" variant="outline-gold" size="md" className="w-full">
              <ShieldCheck className="w-4 h-4 mr-2 text-wbre-primaryGold" />
              Verify A Record
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
