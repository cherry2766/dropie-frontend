export const QUERY_KEYS = {
  me: ["me"],
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
