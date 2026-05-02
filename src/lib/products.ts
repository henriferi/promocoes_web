import { API_URL } from "./constants";
import { parsePrice } from "./format";
import type { Product } from "../types/product";

type ProductSource = "api" | "error";

interface BackendProduct {
  id?: number | null;
  platform?: string | null;
  product_id?: string | null;
  title?: string | null;
  price?: string | number | null;
  original_price?: string | number | null;
  coupon_code?: string | null;
  coupon_discount?: string | number | null;
  has_coupon?: number | boolean | null;
  image_url?: string | null;
  product_url?: string | null;
  affiliate_url?: string | null;
  category?: string | null;
  nicho?: string | null;
  last_posted_at?: string | null;
  post_count?: number | string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface WrappedProductsResponse {
  value?: unknown;
  data?: unknown;
  products?: unknown;
}

export interface ProductsResult {
  products: Product[];
  source: ProductSource;
  message?: string;
}

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><rect width="800" height="800" fill="%23fff0f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23c06a8f" font-family="Arial, sans-serif" font-size="38">Sem imagem</text></svg>';

const normalizeText = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value.trim() || fallback : fallback;

const normalizeNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(",", "."));

    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const normalizePriceString = (value: unknown): string =>
  parsePrice(String(value ?? "")).toFixed(2);

const toTitleCase = (value: string): string =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const normalizeDateString = (...values: Array<unknown>): string => {
  for (const value of values) {
    const normalized = normalizeText(value);

    if (!normalized) {
      continue;
    }

    const parsed = new Date(normalized.replace(" ", "T"));

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date().toISOString();
};

const buildStatsLabel = (postCount: number): string =>
  postCount > 0
    ? `${postCount} ${postCount === 1 ? "postagem" : "postagens"}`
    : "Recente";

const calculateDiscountRate = (
  currentPrice: unknown,
  originalPrice: unknown,
): number => {
  const current = parsePrice(String(currentPrice ?? ""));
  const original = parsePrice(String(originalPrice ?? ""));

  if (original <= 0 || original <= current) {
    return 0;
  }

  return Math.round(((original - current) / original) * 100);
};

const buildCouponLabel = (product: BackendProduct): string | undefined => {
  const hasCoupon =
    product.has_coupon === true ||
    product.has_coupon === 1 ||
    normalizeText(product.coupon_code).length > 0 ||
    normalizeText(product.coupon_discount).length > 0;

  if (!hasCoupon) {
    return undefined;
  }

  const couponCode = normalizeText(product.coupon_code);
  const couponDiscount = normalizeText(product.coupon_discount);

  if (couponCode && couponDiscount) {
    return `Cupom ${couponCode} ${couponDiscount}`;
  }

  if (couponCode) {
    return `Cupom ${couponCode}`;
  }

  if (couponDiscount) {
    return `Cupom ${couponDiscount}`;
  }

  return "Cupom";
};

const getResponseProducts = (data: unknown): BackendProduct[] => {
  if (Array.isArray(data)) {
    return data as BackendProduct[];
  }

  if (data && typeof data === "object") {
    const wrapped = data as WrappedProductsResponse;

    if (Array.isArray(wrapped.value)) {
      return wrapped.value as BackendProduct[];
    }

    if (Array.isArray(wrapped.data)) {
      return wrapped.data as BackendProduct[];
    }

    if (Array.isArray(wrapped.products)) {
      return wrapped.products as BackendProduct[];
    }
  }

  return [];
};

const normalizeProduct = (product: BackendProduct): Product => {
  const productId = normalizeText(product.product_id);
  const fallbackId = normalizeNumber(product.id);
  const title = normalizeText(product.title, "Produto sem titulo");
  const currentPrice = normalizePriceString(product.price);
  const originalPrice = normalizePriceString(product.original_price || product.price);
  const category = normalizeText(product.category) || normalizeText(product.nicho);
  const postCount = Math.max(0, Math.trunc(normalizeNumber(product.post_count)));

  return {
    categoria: category ? toTitleCase(category) : "Sem categoria",
    itemId: Number.parseInt(productId, 10) || fallbackId || Date.now(),
    productName: title,
    offerLink: normalizeText(product.affiliate_url),
    priceMin: currentPrice,
    priceMax: originalPrice,
    imageUrl: normalizeText(product.image_url, FALLBACK_IMAGE),
    sales: postCount,
    ratingStar: "0",
    priceDiscountRate: calculateDiscountRate(product.price, product.original_price),
    createdAt: normalizeDateString(
      product.last_posted_at,
      product.updated_at,
      product.created_at,
    ),
    statsLabel: buildStatsLabel(postCount),
    couponLabel: buildCouponLabel(product),
  };
};

const normalizeProducts = (products: BackendProduct[]): Product[] =>
  products
    .map((product) => normalizeProduct(product))
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );

export const fetchProducts = async (): Promise<ProductsResult> => {
  if (!API_URL) {
    return {
      products: [],
      source: "error",
      message: "Catalogo indisponivel no momento.",
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Falha na API (${response.status})`);
    }

    const data = (await response.json()) as unknown;
    const products = getResponseProducts(data);

    if (products.length === 0) {
      throw new Error("A API retornou uma lista vazia.");
    }

    return {
      products: normalizeProducts(products),
      source: "api",
    };
  } catch {
    return {
      products: [],
      source: "error",
      message: "Nao foi possivel carregar os produtos agora.",
    };
  }
};
