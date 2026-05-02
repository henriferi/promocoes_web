import { BagIcon, HeartIcon, SparklesIcon } from "./Icons";

interface TopBarProps {
  favoriteCount: number;
  totalProducts: number;
  onOpenFavorites: () => void;
}

export function TopBar({
  favoriteCount,
  totalProducts,
  onOpenFavorites,
}: TopBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/70 bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="brand-title truncate text-[1.4rem] leading-none text-ink sm:text-[1.8rem]">
                Achadinhos
              </p>
            </div>
          </div>
        </div>

        <button 
          type="button"
          onClick={onOpenFavorites}
          className="relative inline-flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-extrabold text-white shadow-[0_16px_30px_rgba(255,111,165,0.32)] transition hover:-translate-y-0.5 hover:bg-brand-dark"
          aria-label={`Abrir favoritos (${favoriteCount})`}
        >
          <HeartIcon className="h-4 w-4" />
          <span>Favoritos</span>
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[11px] font-black text-brand">
            {favoriteCount}
          </span>
        </button>
      </div>
    </header>
  );
}
