export const QUERY_KEYS = {
  me: ["me"],
  orders: {
    all: ["orders"],
    list: (page: number, size: number) => ["orders", "list", page, size],
    detail: (id: number) => ["orders", "detail", id],
  },
  events: {
    all: ["events"],
    list: (page: number, size: number, status?: string) =>
      status ? ["events", "list", page, size, status] : ["events", "list", page, size],
    detail: (id: number) => ["events", "detail", id],
    lineup: ["events", "lineup"],
  },
  tags: {
    all: ["tags"],
    list: ["tags", "list"],
  },
  addresses: {
    all: ["addresses"],
  },
  admin: {
    events: {
      all: ["admin", "events"],
    },
    products: {
      all: ["admin", "products"],
    },
  },
} as const;
