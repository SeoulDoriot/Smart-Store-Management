"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import {
  UserCog,
  Plus,
  ShieldCheck,
  Mail,
  Lock,
  Pencil,
  X,
  Check,
} from "lucide-react";

// ── Mock roles & permission rules ────────────────────────────────────────────
type Role = "Boss" | "Cashier" | "Stock Manager";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

// Which admin areas each role may open. "all" = every page.
const ROLE_ACCESS: Record<Role, string[] | "all"> = {
  Boss: "all",
  Cashier: ["POS", "Orders (limited)"],
  "Stock Manager": ["Products", "Stock"],
};

const ROLE_BADGE: Record<Role, string> = {
  Boss: "bg-textdark text-white",
  Cashier: "bg-softpink text-textdark",
  "Stock Manager": "bg-softgreen text-green-800",
};

function permissionSummary(role: Role): string {
  const access = ROLE_ACCESS[role];
  if (access === "all") return "Full access to every admin page";
  return `Can access: ${access.join(", ")}`;
}

const MOCK_STAFF: StaffMember[] = [
  {
    id: "s1",
    name: "Sokha Chan",
    email: "sokha@lumiere.shop",
    role: "Boss",
    active: true,
  },
  {
    id: "s2",
    name: "Dara Pich",
    email: "dara@lumiere.shop",
    role: "Cashier",
    active: true,
  },
  {
    id: "s3",
    name: "Nita Sok",
    email: "nita@lumiere.shop",
    role: "Stock Manager",
    active: true,
  },
  {
    id: "s4",
    name: "Vichea Lim",
    email: "vichea@lumiere.shop",
    role: "Cashier",
    active: false,
  },
];

export default function AdminStaffPage() {
  // Mock: the person viewing this page. Only a Boss may manage staff access.
  const [viewerRole, setViewerRole] = useState<Role>("Boss");
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [adding, setAdding] = useState(false);

  const canManage = viewerRole === "Boss";

  return (
    <AdminShell>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-textdark">Staff Access</h1>
          <p className="mt-1 text-sm text-textgray">
            Manage who can sign in to the admin and what they can do.
          </p>
        </div>

        {/* Mock role simulator — demo the Access Denied gate */}
        <label className="flex items-center gap-2 text-xs text-textgray">
          View as
          <select
            value={viewerRole}
            onChange={(e) => setViewerRole(e.target.value as Role)}
            className="rounded-lg border border-bordergray bg-white px-2 py-1.5 text-xs text-textdark focus:border-textdark focus:outline-none"
          >
            <option>Boss</option>
            <option>Cashier</option>
            <option>Stock Manager</option>
          </select>
        </label>
      </div>

      {!canManage ? (
        <AccessDenied role={viewerRole} />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-textgray">
              {staff.filter((s) => s.active).length} active ·{" "}
              {staff.length} total
            </p>
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 rounded-xl bg-textdark px-3.5 py-2 text-sm font-medium text-white hover:opacity-80"
            >
              <Plus size={15} />
              Add Staff
            </button>
          </div>

          {/* Staff list */}
          <div className="grid gap-3 md:grid-cols-2">
            {staff.map((m) => (
              <div
                key={m.id}
                className="rounded-card border border-bordergray bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-offwhite text-sm font-semibold text-textdark">
                      {m.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-textdark">
                        {m.name}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-textgray">
                        <Mail size={11} />
                        {m.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${ROLE_BADGE[m.role]}`}
                  >
                    {m.role}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-1.5 rounded-xl bg-offwhite px-3 py-2 text-[11px] text-textgray">
                  <ShieldCheck size={13} className="mt-px shrink-0" />
                  <span>{permissionSummary(m.role)}</span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() =>
                      setStaff((prev) =>
                        prev.map((s) =>
                          s.id === m.id ? { ...s, active: !s.active } : s
                        )
                      )
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      m.active
                        ? "bg-green-50 text-green-700"
                        : "bg-bordergray/40 text-textgray"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        m.active ? "bg-green-500" : "bg-textgray"
                      }`}
                    />
                    {m.active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => setEditing(m)}
                    className="flex items-center gap-1.5 rounded-lg border border-bordergray px-2.5 py-1.5 text-xs text-textdark hover:bg-offwhite"
                  >
                    <Pencil size={12} />
                    Edit permissions
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Role reference */}
          <div className="mt-6 rounded-card border border-bordergray bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-textdark">
              Role permissions
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.keys(ROLE_ACCESS) as Role[]).map((role) => (
                <div
                  key={role}
                  className="rounded-xl border border-bordergray p-3"
                >
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${ROLE_BADGE[role]}`}
                  >
                    {role}
                  </span>
                  <p className="mt-2 text-xs text-textgray">
                    {permissionSummary(role)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {(editing || adding) && (
        <StaffModal
          member={editing}
          onClose={() => {
            setEditing(null);
            setAdding(false);
          }}
          onSave={(data) => {
            if (editing) {
              setStaff((prev) =>
                prev.map((s) => (s.id === editing.id ? { ...s, ...data } : s))
              );
            } else {
              setStaff((prev) => [
                {
                  id: `s_${Date.now().toString(36)}`,
                  active: true,
                  ...data,
                } as StaffMember,
                ...prev,
              ]);
            }
            setEditing(null);
            setAdding(false);
          }}
        />
      )}
    </AdminShell>
  );
}

function AccessDenied({ role }: { role: Role }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-bordergray bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <Lock size={22} className="text-red-500" />
      </div>
      <h2 className="text-lg font-semibold text-textdark">Access Denied</h2>
      <p className="mt-1 max-w-sm text-sm text-textgray">
        Your role ({role}) does not have permission to manage staff access. Only
        the Boss can add staff or change permissions.
      </p>
      <p className="mt-3 max-w-sm text-xs text-textgray">
        Allowed for your role: {permissionSummary(role).replace("Can access: ", "")}
      </p>
    </div>
  );
}

function StaffModal({
  member,
  onClose,
  onSave,
}: {
  member: StaffMember | null;
  onClose: () => void;
  onSave: (data: Partial<StaffMember>) => void;
}) {
  const [name, setName] = useState(member?.name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [role, setRole] = useState<Role>(member?.role ?? "Cashier");
  const [active, setActive] = useState(member?.active ?? true);

  const preview = useMemo(() => permissionSummary(role), [role]);
  const valid = name.trim() && email.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="animate-menu-in w-full max-w-sm rounded-[20px] border border-bordergray bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-textdark">
            <UserCog size={17} />
            {member ? "Edit permissions" : "Add staff"}
          </h2>
          <button
            onClick={onClose}
            className="text-textgray hover:text-textdark"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-textgray">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-xl border border-bordergray px-3 text-sm text-textdark focus:border-textdark focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-textgray">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="h-10 w-full rounded-xl border border-bordergray px-3 text-sm text-textdark focus:border-textdark focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-textgray">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="h-10 w-full rounded-xl border border-bordergray bg-white px-3 text-sm text-textdark focus:border-textdark focus:outline-none"
            >
              <option>Boss</option>
              <option>Cashier</option>
              <option>Stock Manager</option>
            </select>
          </div>
          <div className="flex items-start gap-1.5 rounded-xl bg-offwhite px-3 py-2 text-[11px] text-textgray">
            <ShieldCheck size={13} className="mt-px shrink-0" />
            <span>{preview}</span>
          </div>
          <label className="flex items-center gap-2 text-sm text-textdark">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 rounded border-bordergray"
            />
            Active (can sign in)
          </label>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="h-10 flex-1 rounded-xl border border-bordergray text-sm text-textdark hover:bg-offwhite"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() =>
              onSave({ name: name.trim(), email: email.trim(), role, active })
            }
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-textdark text-sm font-medium text-white hover:opacity-80 disabled:opacity-40"
          >
            <Check size={15} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
