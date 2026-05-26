const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? `API error ${res.status}`);
  }
  return data as T;
}

export const api = {
  products: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch<{ products: any[]; pagination: any }>(`/api/products${qs}`);
    },
    bySlug: (slug: string) =>
      apiFetch<{ product: any }>(`/api/products/${slug}`),
  },
  categories: {
    list: () => apiFetch<{ categories: any[] }>('/api/categories'),
  },
  checkout: (payload: any) =>
    apiFetch<{ orderId: string; orderNumber: string }>('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  orders: {
    byId: (orderId: string) => apiFetch<{ order: any }>(`/api/orders/${orderId}`),
  },
};
