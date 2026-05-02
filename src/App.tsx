import { useEffect, useRef, useState } from "react";
import { EmptyState } from "./components/EmptyState";
import { FavoritesDrawer } from "./components/FavoritesDrawer";
import { Filters, type SortOption } from "./components/Filters";
import { BagIcon } from "./components/Icons";
import { ProductCard } from "./components/ProductCard";
import { SearchBar } from "./components/SearchBar";
import { TopBar } from "./components/TopBar";
import { FAVORITES_STORAGE_KEY } from "./lib/constants";
import { parsePrice } from "./lib/format";
import { fetchProducts } from "./lib/products";
import type { Product } from "./types/product";

const PRODUCTS_BATCH_SIZE = 50;

const readFavorites = (): number[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue) as number[];

    return Array.isArray(parsedValue)
      ? parsedValue.filter((value) => typeof value === "number")
      : [];
  } catch {
    return [];
  }
};

const sortProducts = (products: Product[], selectedSort: SortOption): Product[] => {
  return [...products].sort((left, right) => {
    switch (selectedSort) {
      case "price-asc":
        return parsePrice(left.priceMin) - parsePrice(right.priceMin);
      case "price-desc":
        return parsePrice(right.priceMin) - parsePrice(left.priceMin);
      case "sales":
        return right.sales - left.sales;
      case "recent":
      default:
        return (
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        );
    }
  });
};

const filterProducts = (
  products: Product[],
  searchTerm: string,
  selectedCategory: string,
): Product[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.productName.toLowerCase().includes(normalizedSearch);
    const matchesCategory =
      selectedCategory === "Todas" || product.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState<SortOption>("recent");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [favoriteIds, setFavoriteIds] = useState<number[]>(readFavorites);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setLoading(true);

      const result = await fetchProducts();

      if (cancelled) {
        return;
      }

      setProducts(result.products);
      setStatusMessage(result.message ?? null);
      setLoading(false);
    };

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favoriteIds),
      );
    } catch {
      // Ignore storage errors to keep favoriting functional in memory.
    }
  }, [favoriteIds]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;

    if (isFavoritesOpen) {
      body.style.overflow = "hidden";
    }

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isFavoritesOpen]);

  const categories = [
    "Todas",
    ...Array.from(new Set(products.map((product) => product.categoria))),
  ];
  const filteredProducts = filterProducts(products, searchTerm, selectedCategory);
  const sortedProducts = sortProducts(filteredProducts, selectedSort);
  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < sortedProducts.length;
  const favoriteProducts = sortProducts(
    products.filter((product) => favoriteIds.includes(product.itemId)),
    "recent",
  );

  const emptyStateTitle =
    products.length === 0 ? "Catalogo indisponivel" : "Nenhum produto encontrado";
  const emptyStateDescription =
    products.length === 0
      ? "Tente novamente em instantes para carregar a vitrine."
      : "Ajuste a busca ou os filtros para encontrar mais produtos.";

  const toggleFavorite = (itemId: number) => {
    setFavoriteIds((currentFavorites) =>
      currentFavorites.includes(itemId)
        ? currentFavorites.filter((favoriteId) => favoriteId !== itemId)
        : [...currentFavorites, itemId],
    );
  };

  useEffect(() => {
    setVisibleCount(PRODUCTS_BATCH_SIZE);
    setIsLoadingMore(false);
  }, [searchTerm, selectedCategory, selectedSort, products]);

  useEffect(() => {
    if (!hasMoreProducts || !loadMoreRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          setIsLoadingMore(true);
        }
      },
      {
        rootMargin: "240px 0px",
      },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreProducts, visibleCount]);

  useEffect(() => {
    if (!isLoadingMore) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setVisibleCount((currentCount) =>
        Math.min(currentCount + PRODUCTS_BATCH_SIZE, sortedProducts.length),
      );
      setIsLoadingMore(false);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isLoadingMore, sortedProducts.length]);

  return (
    <main className="min-h-screen">
      <TopBar
        favoriteCount={favoriteIds.length}
        totalProducts={products.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      <FavoritesDrawer
        products={favoriteProducts}
        favoriteIds={favoriteIds}
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        onToggleFavorite={toggleFavorite}
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-3 pb-12 pt-24 sm:px-5 sm:pb-16 sm:pt-28 lg:px-8">
        <section className="rounded-[24px] border border-white/80 bg-white/85 p-3 shadow-card backdrop-blur sm:rounded-[32px] sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <Filters
              categories={categories}
              selectedCategory={selectedCategory}
              selectedSort={selectedSort}
              onCategoryChange={setSelectedCategory}
              onSortChange={setSelectedSort}
            />
          </div>

          {statusMessage ? (
            <div className="mt-4 rounded-[24px] border border-brand/15 bg-rose-soft px-4 py-3 text-sm font-semibold text-ink/75">
              {statusMessage}
            </div>
          ) : null}
        </section>

        {loading ? (
          <section className="space-y-4">
            <div>
              <h2 className="font-display text-xl text-ink sm:text-3xl">
                Carregando vitrine
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`loading-card-${index}`}
                  className="animate-pulse overflow-hidden rounded-[22px] border border-white/80 bg-white/75 shadow-sm sm:rounded-[28px]"
                >
                  <div className="aspect-square bg-rose-soft" />
                  <div className="space-y-2 p-3 sm:space-y-3 sm:p-4">
                    <div className="h-3 w-20 rounded-full bg-brand/15" />
                    <div className="h-4 w-full rounded-full bg-brand/10" />
                    <div className="h-4 w-2/3 rounded-full bg-brand/10" />
                    <div className="h-6 w-24 rounded-full bg-brand/15" />
                    <div className="h-10 w-full rounded-[16px] bg-brand/20 sm:h-12 sm:rounded-[20px]" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <BagIcon className="h-[18px] w-[18px]" />
                </span>
                <h2 className="font-display text-xl text-ink sm:text-3xl">
                  Produtos
                </h2>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <EmptyState
                title={emptyStateTitle}
                description={emptyStateDescription}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleProducts.map((product, index) => (
                    <div
                      key={product.itemId}
                      className="animate-enter"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <ProductCard
                        product={product}
                        isFavorite={favoriteIds.includes(product.itemId)}
                        onToggleFavorite={() => toggleFavorite(product.itemId)}
                        highlight={selectedSort !== "recent" && index < 2}
                      />
                    </div>
                  ))}
                </div>

                {hasMoreProducts ? (
                  <div
                    ref={loadMoreRef}
                    className="flex justify-center pt-4"
                  >
                    <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink/45 shadow-sm">
                      {isLoadingMore
                        ? "Carregando mais produtos"
                        : "Role para carregar mais"}
                    </span>
                  </div>
                ) : null}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
