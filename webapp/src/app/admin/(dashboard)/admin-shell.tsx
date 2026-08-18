"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminModule } from "@/lib/rbac";
import { signOutAction } from "./actions";

type NavItem = { module: AdminModule; href: string; labelKk: string };

export function AdminShell({
  nav,
  user,
  children,
}: {
  nav: NavItem[];
  user: { name?: string | null; email?: string | null; role: "OWNER" | "ADMIN" };
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:grid lg:grid-cols-[260px_1fr]">
      {open && (
        <button
          type="button"
          aria-label="Мәзірді жабу"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-bgreen-dark text-paper transition-transform duration-200 ease-out
                    lg:static lg:translate-x-0
                    ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-3 px-5 py-6">
          <Image src="/brand/logo.png" alt="Quan Travel" width={36} height={36} className="size-9 rounded-lg" />
          <div>
            <p className="font-display text-[17px] leading-tight">Quan Travel</p>
            <p className="text-[12px] text-paper/60">Әкімшілік панель</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.module}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`block rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold
                            ${
                              active
                                ? "bg-bred text-paper"
                                : "text-paper/75 hover:bg-paper/10 hover:text-paper"
                            }`}
              >
                {item.labelKk}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-paper/10 px-5 py-4">
          <p className="truncate text-[13px] font-medium text-paper">{user.name ?? user.email}</p>
          <p className="text-[12px] text-paper/55">
            {user.role === "OWNER" ? "Иесі (Owner)" : "Администратор (Admin)"}
          </p>
          <form action={signOutAction} className="mt-3">
            <button
              type="submit"
              className="h-10 w-full rounded-lg border border-paper/20 text-[13px] font-medium text-paper/85 transition-colors
                         hover:bg-paper/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold"
            >
              Шығу
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            aria-label="Мәзірді ашу"
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-paper-dim
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <span className="font-display text-[16px] text-ink">Quan Travel Admin</span>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
