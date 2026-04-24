import api from "@/lib/api";
import type { EventListItem, EventDetailEntity, LineupRound, PaginatedResponse } from "@/types/event";

export async function getEvents(
  page = 1,
  size = 6,
  status?: string,
): Promise<PaginatedResponse<EventListItem>> {
  const res = await api.get<PaginatedResponse<EventListItem>>("/events", {
    params: { page, size, ...(status && { status }) },
  });
  return res.data;
}

export async function getEventLineup(): Promise<LineupRound[]> {
  const res = await api.get<LineupRound[]>("/events/lineup");
  return res.data;
}

export async function getEventDetail(eventId: number): Promise<EventDetailEntity> {
  const res = await api.get<EventDetailEntity>(`/events/${eventId}`);
  return res.data;
}
