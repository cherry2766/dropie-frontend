export const QUERY_KEYS = {
  tags: {
    all: ["tags"],
    list: ["tags", "list"],
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
