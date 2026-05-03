import type { TagEntity } from "@/types/tag";

export type ProductEntity = {
  id: number;
  eventId: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  stock: number;
  tags: TagEntity[];
};
