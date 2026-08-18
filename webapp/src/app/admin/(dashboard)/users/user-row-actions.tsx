"use client";

import { toggleUserStatus, deleteAdminUser } from "./actions";

export function UserRowActions({ userId, status }: { userId: string; status: "ACTIVE" | "BLOCKED" }) {
  return (
    <div className="flex items-center gap-2">
      <form action={toggleUserStatus.bind(null, userId)}>
        <button
          type="submit"
          className="h-9 rounded-md border border-line px-3 text-[13px] font-medium text-ink transition-colors
                     hover:bg-paper-dim focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold"
        >
          {status === "ACTIVE" ? "Бұғаттау" : "Белсендіру"}
        </button>
      </form>
      <form
        action={deleteAdminUser.bind(null, userId)}
        onSubmit={(event) => {
          if (!window.confirm("Бұл администраторды жою керек пе? Әрекетті қайтару мүмкін емес.")) {
            event.preventDefault();
          }
        }}
      >
        <button
          type="submit"
          className="h-9 rounded-md border border-bred-light/40 px-3 text-[13px] font-medium text-bred-dark transition-colors
                     hover:bg-bred/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold"
        >
          Жою
        </button>
      </form>
    </div>
  );
}
