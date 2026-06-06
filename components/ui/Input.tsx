import { useId, type InputHTMLAttributes, type ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  rightIconLabel?: string;
};

export default function Input({
  rightIcon,
  onRightIconClick,
  rightIconLabel = "Toggle field visibility",
  id,
  placeholder,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const label = typeof placeholder === "string" ? placeholder : undefined;

  return (
    <div className="relative">
      <input
        {...props}
        id={inputId}
        placeholder=" "
        aria-label={props["aria-label"] ?? label}
        className={`peer h-14 w-full rounded-full border border-zinc-200 bg-white px-6 text-sm text-zinc-900 outline-none transition focus:border-[#5f97ee] focus:ring-4 focus:ring-[#5f97ee]/15 ${
          rightIcon ? "pr-14" : ""
        } ${className}`}
      />

      {label && (
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute left-5 top-0 -translate-y-1/2 rounded-full bg-white px-2 text-[11px] font-semibold leading-none text-[#5f97ee] transition-all duration-200 peer-placeholder-shown:left-6 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-zinc-400 peer-focus:left-5 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-white peer-focus:px-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[#5f97ee]"
        >
          {label}
        </label>
      )}

      {rightIcon && (
        onRightIconClick ? (
          <button
            type="button"
            onClick={onRightIconClick}
            aria-label={rightIconLabel}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-600"
          >
            {rightIcon}
          </button>
        ) : (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
            {rightIcon}
          </div>
        )
      )}
    </div>
  );
}
