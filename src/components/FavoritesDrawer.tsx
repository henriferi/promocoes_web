import { useEffect } from "react";
import type { Product } from "../types/product";
import { EmptyState } from "./EmptyState";
import { CloseIcon, HeartIcon } from "./Icons";
import { ProductCard } from "./ProductCard";

interface FavoritesDrawerProps {
  products: Product[];
  favoriteIds: number[];
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (itemId: number) => void;
}

export function FavoritesDrawer({
  products,
  favoriteIds,
  isOpen,
  onClose,
  onToggleFavorite,
}: FavoritesDrawerProps) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Fechar favoritos"
        onClick={onClose}
        className={`absolute inset-0 bg-ink/35 backdrop-blur-[2px] transition duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        aria-label="Produtos favoritados"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[24rem] flex-col border-l border-white/70 bg-[#fffafb] shadow-[0_20px_60px_rgba(67,49,60,0.18)] transition duration-300 sm:max-w-[28rem] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-brand/10 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
              <HeartIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl text-ink">Favoritos</p>
              <p className="text-sm text-ink/60">
                {favoriteIds.length} {favoriteIds.length === 1 ? "item salvo" : "itens salvos"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-brand/10 bg-white p-2 text-ink/65 transition hover:border-brand/35 hover:text-brand"
            aria-label="Fechar painel de favoritos"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
          {products.length === 0 ? (
            <EmptyState
              title="Nenhum favorito salvo"
              description="Toque no coração dos produtos para montar sua seleção e acessar tudo aqui depois."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product, index) => (
                <div
                  key={product.itemId}
                  className="animate-enter"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <ProductCard
                    product={product}
                    isFavorite={favoriteIds.includes(product.itemId)}
                    onToggleFavorite={() => onToggleFavorite(product.itemId)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
