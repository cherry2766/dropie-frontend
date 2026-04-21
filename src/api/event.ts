import api from "@/lib/api";
import type { EventListItem, EventDetailEntity, PaginatedResponse } from "@/types/event";

export async function getEvents(
  page = 1,
  size = 6,
): Promise<PaginatedResponse<EventListItem>> {
  const res = await api.get<PaginatedResponse<EventListItem>>("/events", { params: { page, size } });
  return res.data;
}

export async function getEventDetail(eventId: number): Promise<EventDetailEntity> {
  const res = await api.get<EventDetailEntity>(`/events/${eventId}`);
  return res.data;
}
