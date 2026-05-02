export type SortOption = "recent" | "price-asc" | "price-desc" | "sales";

interface FiltersProps {
  categories: string[];
  selectedCategory: string;
  selectedSort: SortOption;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
}

const sortOptions: Array<{ label: string; value: SortOption }> = [
  { label: "Mais recentes", value: "recent" },
  { label: "Menor preço", value: "price-asc" },
  { label: "Maior preço", value: "price-desc" },
  { label: "Mais vendidos", value: "sales" },
];

export function Filters({
  categories,
  selectedCategory,
  selectedSort,
  onCategoryChange,
  onSortChange,
}: FiltersProps) {
  return (
    <section className="space-y-3">
      <div className="filter-rail-shell">
        <div className="filter-rail" aria-label="Ordenacao de produtos">
          {sortOptions.map((option) => {
            const isActive = option.value === selectedSort;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSortChange(option.value)}
                className={`filter-chip ${
                  isActive
                    ? "bg-brand text-white shadow-card"
                    : "border border-brand/10 bg-white/95 text-ink/75 hover:border-brand/35 hover:text-brand"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-rail-shell">
        <div className="filter-rail" aria-label="Categorias de produtos">
          {categories.map((category) => {
            const isActive = category === selectedCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`filter-chip ${
                  isActive
                    ? "bg-brand text-white shadow-card"
                    : "border border-brand/10 bg-white/95 text-ink/75 hover:border-brand/35 hover:text-brand"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
