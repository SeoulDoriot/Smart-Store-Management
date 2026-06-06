import { AdminShell } from "@/components/layout/AdminShell";
import {
  Store,
  MessageCircle,
  CreditCard,
  Globe,
  Shield,
} from "lucide-react";

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-bordergray bg-white p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-offwhite text-textgray">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-textdark">{title}</h3>
          <p className="mt-0.5 text-xs text-textgray">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "h-10 w-full rounded-lg border border-bordergray bg-offwhite px-3 text-sm text-textdark placeholder-textgray focus:border-textdark focus:outline-none";

export default function AdminSettingsPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-textdark">Settings</h1>
        <p className="mt-1 text-sm text-textgray">
          Configure your store settings
        </p>
      </div>

      <div className="space-y-5">
        {/* Shop Info */}
        <SettingsCard
          icon={<Store size={18} />}
          title="Shop Information"
          description="Basic store details shown on receipts and notifications"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-textgray">
                Store Name
              </label>
              <input
                className={inputCls}
                defaultValue="Lumière Beauty"
                readOnly
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-textgray">
                Phone
              </label>
              <input
                className={inputCls}
                defaultValue="+855 12 345 678"
                readOnly
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-textgray">
                Address
              </label>
              <input
                className={inputCls}
                defaultValue="St 240, BKK1, Phnom Penh"
                readOnly
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-textgray">
            Editing shop info will be available when backend is connected.
          </p>
        </SettingsCard>

        {/* Telegram */}
        <SettingsCard
          icon={<MessageCircle size={18} />}
          title="Telegram Notifications"
          description="Configure bot token and chat IDs for order alerts"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-textgray">
                Bot Token
              </label>
              <input
                className={inputCls}
                type="password"
                placeholder="Set via TELEGRAM_BOT_TOKEN env var"
                readOnly
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-textgray">
                Owner Chat ID
              </label>
              <input
                className={inputCls}
                placeholder="e.g. 123456789"
                readOnly
              />
            </div>
          </div>
          <div className="mt-3 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
            Telegram bot token must be set as a backend environment variable.
            Never expose it in frontend code.
          </div>
        </SettingsCard>

        {/* Payment */}
        <SettingsCard
          icon={<CreditCard size={18} />}
          title="Payment Methods"
          description="Configure available payment channels"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              { label: "KHQR / Bakong", active: true },
              { label: "ABA Pay", active: true },
              { label: "ACLEDA", active: true },
              { label: "Wing", active: true },
              { label: "Cash on Delivery", active: true },
              { label: "Pay at Store", active: true },
            ].map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between rounded-lg border border-bordergray px-3 py-2.5"
              >
                <span className="text-xs font-medium text-textdark">
                  {m.label}
                </span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    m.active ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-textgray">
            Payment method management will be available in Version 2.
          </p>
        </SettingsCard>

        {/* Locale */}
        <SettingsCard
          icon={<Globe size={18} />}
          title="Language & Currency"
          description="Store display defaults"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-textgray">
                Default Language
              </label>
              <select className={inputCls} defaultValue="en" disabled>
                <option value="en">English</option>
                <option value="km">Khmer</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-textgray">
                Currency
              </label>
              <input className={inputCls} defaultValue="USD ($)" readOnly />
            </div>
          </div>
        </SettingsCard>

        {/* Security */}
        <SettingsCard
          icon={<Shield size={18} />}
          title="Security"
          description="Environment variable status"
        >
          <div className="space-y-2">
            {[
              { key: "NEXT_PUBLIC_SUPABASE_URL", desc: "Supabase project URL" },
              { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", desc: "Supabase anon key" },
              { key: "SUPABASE_SERVICE_ROLE_KEY", desc: "Server-only admin key" },
              { key: "OPENROUTER_API_KEY", desc: "AI advisor API key" },
              { key: "TELEGRAM_BOT_TOKEN", desc: "Telegram bot token" },
            ].map((env) => (
              <div
                key={env.key}
                className="flex items-center justify-between rounded-lg bg-offwhite px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium text-textdark">
                    {env.key}
                  </p>
                  <p className="text-[10px] text-textgray">{env.desc}</p>
                </div>
                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-textgray">
                  Not set
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            Never expose SUPABASE_SERVICE_ROLE_KEY, OPENROUTER_API_KEY, or
            TELEGRAM_BOT_TOKEN in frontend code.
          </div>
        </SettingsCard>
      </div>
    </AdminShell>
  );
}
