export type EventStatus = "UPCOMING" | "OPEN" | "CLOSED" | "FINISHED";

export type EventEntity = {
  id: number;
  brandName: string;
  description: string;
  thumbnailImageUrl: string;
  imageUrl: string;
  startAt: string;
  endAt: string;
  status: EventStatus;
};
