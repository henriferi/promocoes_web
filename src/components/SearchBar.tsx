interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="group flex items-center gap-3 rounded-[22px] border border-white/80 bg-white px-4 py-3 shadow-sm transition duration-300 focus-within:border-brand/40 focus-within:shadow-card sm:rounded-[26px] sm:py-4">
      <svg
        aria-hidden="true"
        className="h-5 w-5 text-ink/45 transition group-focus-within:text-brand"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20L17 17" />
      </svg>

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar produto"
        className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink/35 sm:text-base"
      />
    </label>
  );
}
