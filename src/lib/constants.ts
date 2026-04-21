export const QUERY_KEYS = {
  me: ["me"],
  events: {
    all: ["events"],
    list: (page: number, size: number) => ["events", "list", page, size],
    detail: (id: number) => ["events", "detail", id],
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
