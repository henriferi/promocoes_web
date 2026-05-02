import { useEffect, useState } from "react";
import type { Product } from "../types/product";
import {
  formatCurrency,
  formatSales,
  getRatingValue,
  getStars,
  parsePrice,
} from "../lib/format";
import { HeartIcon } from "./Icons";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  highlight?: boolean;
}

export function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  highlight = false,
}: ProductCardProps) {
  const [clicked, setClicked] = useState(false);
  const stars = getStars(product.ratingStar);
  const ratingValue = getRatingValue(product.ratingStar);
  const priceMin = parsePrice(product.priceMin);
  const priceMax = parsePrice(product.priceMax);
  const hasOriginalPrice = priceMax > priceMin;
  const metaLabel = product.statsLabel ?? formatSales(product.sales);
  const showDiscountBadge = product.priceDiscountRate > 0;
  const showRating = ratingValue > 0;
  const hasCoupon = Boolean(product.couponLabel);
  const hasOfferLink = product.offerLink.trim().length > 0;

  useEffect(() => {
    if (!clicked) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setClicked(false);
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [clicked]);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-[22px] border bg-white/92 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-card sm:rounded-[28px] ${
        highlight ? "border-brand/35" : "border-white/80"
      }`}
    >
      <div className="relative">
        <div className="absolute left-2.5 top-2.5 z-10 flex max-w-[calc(100%-3.5rem)] flex-wrap items-center gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
          {showDiscountBadge ? (
            <span className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand shadow-sm sm:px-3 sm:text-[11px] sm:tracking-[0.18em]">
              {product.priceDiscountRate}% OFF
            </span>
          ) : null}
          {hasCoupon ? (
            <span className="rounded-full bg-ink px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white shadow-sm sm:px-3 sm:text-[11px] sm:tracking-[0.18em]">
              {product.couponLabel}
            </span>
          ) : null}
          {highlight ? (
            <span className="rounded-full bg-brand px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white shadow-sm sm:px-3 sm:text-[11px] sm:tracking-[0.18em]">
              Top
            </span>
          ) : null}
        </div>

        <button
          type="button"
          aria-label={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          onClick={onToggleFavorite}
          className={`absolute right-2.5 top-2.5 z-10 rounded-full border p-2 shadow-sm transition duration-300 sm:right-4 sm:top-4 sm:p-3 ${
            isFavorite
              ? "border-brand/25 bg-brand text-white"
              : "border-white/80 bg-white/90 text-ink/60 hover:border-brand/25 hover:text-brand"
          }`}
        >
          <HeartIcon
            aria-hidden="true"
            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>

        <div className="aspect-square overflow-hidden bg-rose-soft">
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="max-w-[55%] truncate rounded-full bg-mist px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/60 sm:px-3 sm:text-[11px] sm:tracking-[0.18em]">
              {product.categoria}
            </span>
          </div>

          <h3 className="line-clamp-2 min-h-10 text-sm font-extrabold leading-5 text-ink sm:min-h-[3.25rem] sm:text-base sm:leading-6">
            {product.productName}
          </h3>

          <div className="space-y-0.5">
            <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-end sm:gap-2">
              <p className="text-lg font-black tracking-tight text-brand sm:text-2xl">
                {formatCurrency(product.priceMin)}
              </p>
              {hasOriginalPrice ? (
                <p className="text-[11px] font-semibold text-ink/45 line-through sm:pb-1 sm:text-xs">
                  {formatCurrency(product.priceMax)}
                </p>
              ) : null}
            </div>
          </div>

          {showRating ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 text-amber-400 sm:gap-1">
                {stars.map((isFilled, index) => (
                  <svg
                    key={`${product.itemId}-star-${index}`}
                    aria-hidden="true"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    viewBox="0 0 20 20"
                    fill={isFilled ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M10 2.5l2.2 4.46 4.92.72-3.56 3.47.84 4.9L10 13.8l-4.4 2.25.84-4.9L2.88 7.68l4.92-.72L10 2.5Z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-bold text-ink sm:text-sm">
                {ratingValue.toFixed(1)}
              </span>
            </div>
          ) : null}
        </div>

        {hasOfferLink ? (
          <a
            href={product.offerLink}
            target="_blank"
            rel="noreferrer"
            onClick={() => setClicked(true)}
            className={`mt-auto inline-flex items-center justify-center rounded-[16px] px-3 py-2.5 text-xs font-extrabold text-white transition duration-300 sm:rounded-[20px] sm:px-4 sm:py-3 sm:text-sm ${
              clicked
                ? "bg-ink shadow-[0_12px_28px_rgba(67,49,60,0.22)]"
                : "bg-brand shadow-[0_16px_30px_rgba(255,111,165,0.35)] hover:-translate-y-0.5 hover:bg-brand-dark"
            }`}
          >
            {clicked ? "Abrindo oferta..." : "Ver oferta"}
          </a>
        ) : (
          <span className="mt-auto inline-flex items-center justify-center rounded-[16px] bg-ink/10 px-3 py-2.5 text-xs font-extrabold text-ink/45 sm:rounded-[20px] sm:px-4 sm:py-3 sm:text-sm">
            Oferta indisponivel
          </span>
        )}
      </div>
    </article>
  );
}
