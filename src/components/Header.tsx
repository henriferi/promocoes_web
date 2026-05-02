interface HeaderProps {
  totalProducts: number;
  totalCategories: number;
}

export function Header({ totalProducts, totalCategories }: HeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/85 px-5 py-6 shadow-card backdrop-blur sm:px-8 sm:py-8">
      <div className="absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-peach/70 blur-3xl" />

      <div className="relative flex flex-col gap-5">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-brand">
          Curadoria com foco em conversão
        </div>

        <div className="max-w-3xl">
          <p className="font-display text-3xl leading-tight text-ink sm:text-5xl">
            Achadinhos da Shopee
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70 sm:text-base">
            Uma vitrine feminina, rápida e irresistível para destacar ofertas com
            apelo visual forte e deixar o clique no afiliado o mais natural
            possível.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          <div className="rounded-3xl border border-brand/10 bg-rose-soft px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Produtos
            </p>
            <p className="mt-1 text-lg font-extrabold text-ink">{totalProducts}</p>
          </div>
          <div className="rounded-3xl border border-brand/10 bg-cream px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Categorias
            </p>
            <p className="mt-1 text-lg font-extrabold text-ink">
              {totalCategories}
            </p>
          </div>
          <div className="col-span-2 rounded-3xl border border-brand/10 bg-white px-4 py-3 sm:col-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Destaque
            </p>
            <p className="mt-1 text-lg font-extrabold text-brand">
              ofertas com visual premium
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
