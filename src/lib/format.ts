export const parsePrice = (value: string): number => {
  let sanitized = value.trim().replace(/[^\d.,-]/g, "");

  if (!sanitized) {
    return 0;
  }

  if (sanitized.includes(",") && sanitized.includes(".")) {
    sanitized =
      sanitized.lastIndexOf(",") > sanitized.lastIndexOf(".")
        ? sanitized.replace(/\./g, "").replace(",", ".")
        : sanitized.replace(/,/g, "");
  } else if (sanitized.includes(",")) {
    sanitized = sanitized.replace(",", ".");
  }

  const parsed = Number.parseFloat(sanitized);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatCurrency = (value: string): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(parsePrice(value));

export const formatSales = (sales: number): string => {
  if (sales >= 1000) {
    const compact = sales / 1000;
    const formatted = compact % 1 === 0 ? compact.toFixed(0) : compact.toFixed(1);

    return `${formatted.replace(".0", "").replace(".", ",")}k vendidos`;
  }

  return `${sales} vendidos`;
};

export const getRatingValue = (ratingStar: string): number => {
  const value = Number.parseFloat(ratingStar.replace(",", "."));

  return Number.isFinite(value) ? value : 0;
};

export const getStars = (ratingStar: string): boolean[] => {
  const rounded = Math.round(getRatingValue(ratingStar));

  return Array.from({ length: 5 }, (_, index) => index < rounded);
};
