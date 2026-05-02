import type { ReactNode } from "react";
import type { Product } from "../types/product";
import { ProductCard } from "./ProductCard";

interface ProductSectionProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  products: Product[];
  favoriteIds: number[];
  onToggleFavorite: (itemId: number) => void;
  variant?: "default" | "feature";
}

export function ProductSection({
  title,
  subtitle,
  icon,
  products,
  favoriteIds,
  onToggleFavorite,
  variant = "default",
}: ProductSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
              {icon}
            </span>
            <h2 className="font-display text-xl text-ink sm:text-3xl">{title}</h2>
          </div>
          <p className="mt-1 text-xs text-ink/65 sm:text-sm">{subtitle}</p>
        </div>

        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-ink/45 shadow-sm">
          {products.length} itens
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard
            key={product.itemId}
            product={product}
            isFavorite={favoriteIds.includes(product.itemId)}
            onToggleFavorite={() => onToggleFavorite(product.itemId)}
            highlight={variant === "feature" && index < 2}
          />
        ))}
      </div>
    </section>
  );
}
