import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Pencil, Package, CalendarDays, Home } from "lucide-react";
import type { EventStatus, EventEntity as Event, ProductEntity as Product } from "@/types";

// Tab은 이 페이지 내부에서만 쓰는 UI 상태이므로 여기에 정의
type Tab = "events" | "products";

const STATUS_STYLE: Record<EventStatus, string> = {
  OPEN: "bg-emerald-50 text-emerald-600",
  UPCOMING: "bg-blue-50 text-blue-600",
  CLOSED: "bg-[#ffd6e0] text-neutral-500",
  FINISHED: "bg-neutral-100 text-neutral-400",
};

const INITIAL_EVENTS: Event[] = [
  { id: 1, brandName: "노티드", description: "노티드 봄 시즌 한정 드롭", thumbnailImageUrl: "", imageUrl: "", startAt: "2026-04-01T20:00", endAt: "2026-04-01T22:00", status: "OPEN" },
  { id: 2, brandName: "런던베이글뮤지엄", description: "런던베이글 신메뉴 드롭", thumbnailImageUrl: "", imageUrl: "", startAt: "2026-04-05T12:00", endAt: "2026-04-05T14:00", status: "UPCOMING" },
  { id: 3, brandName: "카페노티드", description: "카페노티드 시즌 종료", thumbnailImageUrl: "", imageUrl: "", startAt: "2026-03-28T18:00", endAt: "2026-03-28T20:00", status: "CLOSED" },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, eventId: 1, name: "초코두바이도넛", imageUrl: "", description: "진한 초콜릿 두바이 도넛", price: 5500, stock: 30 },
  { id: 2, eventId: 1, name: "말차두바이도넛", imageUrl: "", description: "말차 크림 두바이 도넛", price: 5500, stock: 15 },
  { id: 3, eventId: 2, name: "소금버터베이글", imageUrl: "", description: "고소한 소금버터 베이글", price: 4500, stock: 50 },
];

const EVENT_FORM_INIT = { brandName: "", description: "", thumbnailImageUrl: "", imageUrl: "", startAt: "", endAt: "", status: "UPCOMING" as EventStatus };
const PRODUCT_FORM_INIT = { eventId: "", name: "", imageUrl: "", description: "", price: "", stock: "" };

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("events");

  // 이벤트
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [eventForm, setEventForm] = useState(EVENT_FORM_INIT);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  // 상품
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [productForm, setProductForm] = useState(PRODUCT_FORM_INIT);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [stockValue, setStockValue] = useState("");

  // 이벤트 등록/수정
  function handleEventSubmit() {
    if (!eventForm.brandName || !eventForm.startAt || !eventForm.endAt) return;
    if (editingEventId !== null) {
      setEvents((prev) => prev.map((e) => e.id === editingEventId ? { ...e, ...eventForm } : e));
      setEditingEventId(null);
    } else {
      setEvents((prev) => [...prev, { id: Date.now(), ...eventForm }]);
    }
    setEventForm(EVENT_FORM_INIT);
  }

  function handleEditEvent(event: Event) {
    setEditingEventId(event.id);
    setEventForm({ brandName: event.brandName, description: event.description, thumbnailImageUrl: event.thumbnailImageUrl, imageUrl: event.imageUrl, startAt: event.startAt, endAt: event.endAt, status: event.status });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDeleteEvent(id: number) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  // 상품 등록/수정
  function handleProductSubmit() {
    if (!productForm.name || !productForm.eventId || !productForm.price) return;
    if (editingProductId !== null) {
      setProducts((prev) => prev.map((p) => p.id === editingProductId ? { ...p, ...productForm, eventId: Number(productForm.eventId), price: Number(productForm.price), stock: Number(productForm.stock) } : p));
      setEditingProductId(null);
    } else {
      setProducts((prev) => [...prev, { id: Date.now(), eventId: Number(productForm.eventId), name: productForm.name, imageUrl: productForm.imageUrl, description: productForm.description, price: Number(productForm.price), stock: Number(productForm.stock) }]);
    }
    setProductForm(PRODUCT_FORM_INIT);
  }

  function handleEditProduct(product: Product) {
    setEditingProductId(product.id);
    setProductForm({ eventId: String(product.eventId), name: product.name, imageUrl: product.imageUrl, description: product.description, price: String(product.price), stock: String(product.stock) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDeleteProduct(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function handleStockSave(id: number) {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock: Number(stockValue) } : p));
    setEditingStockId(null);
    setStockValue("");
  }

  const inputCls = "h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-[#f48b94] focus:ring-1 focus:ring-[#f48b94]";
  const labelCls = "mb-1 block text-xs font-semibold text-neutral-600";

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold tracking-tight text-[#f48b94]">Dropie</span>
            <span className="text-lg font-semibold text-neutral-500">관리자</span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-500 shadow-sm transition hover:border-[#f4c9cf] hover:text-[#f48b94]"
          >
            <Home className="h-4 w-4" />
            홈으로
          </Link>
        </div>

        {/* 탭 */}
        <div className="mb-6 flex gap-1 rounded-2xl border border-neutral-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setTab("events")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${tab === "events" ? "bg-[#f48b94] text-white shadow" : "text-neutral-500 hover:bg-neutral-50"}`}
          >
            <CalendarDays className="h-4 w-4" />
            이벤트 관리
          </button>
          <button
            onClick={() => setTab("products")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${tab === "products" ? "bg-[#f48b94] text-white shadow" : "text-neutral-500 hover:bg-neutral-50"}`}
          >
            <Package className="h-4 w-4" />
            상품 관리
          </button>
        </div>

        {/* 이벤트 관리 */}
        {tab === "events" && (
          <div className="space-y-5">
            {/* 등록 폼 */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 border-l-4 border-[#f48b94] pl-3 text-base font-bold text-neutral-900">
                {editingEventId !== null ? "이벤트 수정" : "이벤트 등록"}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>브랜드명</label>
                    <input value={eventForm.brandName} onChange={(e) => setEventForm((p) => ({ ...p, brandName: e.target.value }))} placeholder="예: 노티드" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>상태</label>
                    <select value={eventForm.status} onChange={(e) => setEventForm((p) => ({ ...p, status: e.target.value as EventStatus }))} className={inputCls}>
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="OPEN">OPEN</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>브랜드 설명</label>
                  <textarea value={eventForm.description} onChange={(e) => setEventForm((p) => ({ ...p, description: e.target.value }))} placeholder="브랜드 및 이벤트에 대한 설명을 입력하세요" rows={3} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-[#f48b94] focus:ring-1 focus:ring-[#f48b94] resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>썸네일 이미지</label>
                    <label className="flex h-20 cursor-pointer items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-400 transition hover:border-[#f48b94] hover:text-[#f48b94]">
                      {eventForm.thumbnailImageUrl ? <span className="text-xs text-neutral-600 truncate px-2">{eventForm.thumbnailImageUrl}</span> : "+ 이미지 업로드"}
                      <input type="file" className="hidden" onChange={(e) => setEventForm((p) => ({ ...p, thumbnailImageUrl: e.target.files?.[0]?.name ?? "" }))} />
                    </label>
                    <p className="mt-1 text-xs text-neutral-400">목록 카드에 표시되는 이미지</p>
                  </div>
                  <div>
                    <label className={labelCls}>상세 이미지</label>
                    <label className="flex h-20 cursor-pointer items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-400 transition hover:border-[#f48b94] hover:text-[#f48b94]">
                      {eventForm.imageUrl ? <span className="text-xs text-neutral-600 truncate px-2">{eventForm.imageUrl}</span> : "+ 이미지 업로드"}
                      <input type="file" className="hidden" onChange={(e) => setEventForm((p) => ({ ...p, imageUrl: e.target.files?.[0]?.name ?? "" }))} />
                    </label>
                    <p className="mt-1 text-xs text-neutral-400">이벤트 상세 페이지에 표시되는 이미지</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>판매 시작일시</label>
                    <input type="datetime-local" value={eventForm.startAt} onChange={(e) => setEventForm((p) => ({ ...p, startAt: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>판매 종료일시</label>
                    <input type="datetime-local" value={eventForm.endAt} onChange={(e) => setEventForm((p) => ({ ...p, endAt: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {editingEventId !== null && (
                    <button onClick={() => { setEditingEventId(null); setEventForm(EVENT_FORM_INIT); }} className="h-10 rounded-xl border border-neutral-200 px-5 text-sm font-semibold text-neutral-500 hover:bg-neutral-50">
                      취소
                    </button>
                  )}
                  <button onClick={handleEventSubmit} className="h-10 rounded-xl bg-[#f48b94] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ee7b86]">
                    {editingEventId !== null ? "수정 완료" : "이벤트 등록"}
                  </button>
                </div>
              </div>
            </div>

            {/* 이벤트 목록 */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 border-l-4 border-[#f48b94] pl-3 text-base font-bold text-neutral-900">이벤트 목록</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 text-left text-xs font-semibold text-neutral-400">
                      <th className="pb-3 pr-4">브랜드명</th>
                      <th className="pb-3 pr-4">상태</th>
                      <th className="pb-3 pr-4">판매 시작</th>
                      <th className="pb-3 pr-4">판매 종료</th>
                      <th className="pb-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="py-3 pr-4 font-semibold text-neutral-800">{event.brandName}</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLE[event.status]}`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-neutral-600">{event.startAt.replace("T", " ")}</td>
                        <td className="py-3 pr-4 text-neutral-600">{event.endAt.replace("T", " ")}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button onClick={() => handleEditEvent(event)} className="flex h-8 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50">
                              <Pencil className="h-3 w-3" /> 수정
                            </button>
                            <button onClick={() => handleDeleteEvent(event.id)} className="flex h-8 items-center gap-1 rounded-lg border border-red-100 px-3 text-xs font-medium text-red-400 hover:bg-red-50">
                              <Trash2 className="h-3 w-3" /> 삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 상품 관리 */}
        {tab === "products" && (
          <div className="space-y-5">
            {/* 등록 폼 */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 border-l-4 border-[#f48b94] pl-3 text-base font-bold text-neutral-900">
                {editingProductId !== null ? "상품 수정" : "상품 등록"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>이벤트 선택</label>
                  <select value={productForm.eventId} onChange={(e) => setProductForm((p) => ({ ...p, eventId: e.target.value }))} className={inputCls}>
                    <option value="">이벤트를 선택하세요</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>{e.brandName} — {e.startAt.replace("T", " ")} ~ {e.endAt.slice(11)}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-neutral-400">상품이 속할 이벤트를 선택하세요 (eventId로 전달돼요)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>상품명</label>
                    <input value={productForm.name} onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))} placeholder="예: 초코두바이도넛" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>가격 (원)</label>
                    <input type="number" value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} placeholder="예: 5500" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>재고 수량</label>
                    <input type="number" value={productForm.stock} onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))} placeholder="예: 100" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>상품 이미지</label>
                    <label className="flex h-10 cursor-pointer items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-400 transition hover:border-[#f48b94] hover:text-[#f48b94]">
                      {productForm.imageUrl ? <span className="text-xs text-neutral-600 truncate px-2">{productForm.imageUrl}</span> : "+ 이미지 업로드"}
                      <input type="file" className="hidden" onChange={(e) => setProductForm((p) => ({ ...p, imageUrl: e.target.files?.[0]?.name ?? "" }))} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>상품 설명</label>
                  <textarea value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} placeholder="상품에 대한 설명을 입력하세요" rows={3} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-[#f48b94] focus:ring-1 focus:ring-[#f48b94] resize-none" />
                </div>
                <div className="flex justify-end gap-2">
                  {editingProductId !== null && (
                    <button onClick={() => { setEditingProductId(null); setProductForm(PRODUCT_FORM_INIT); }} className="h-10 rounded-xl border border-neutral-200 px-5 text-sm font-semibold text-neutral-500 hover:bg-neutral-50">
                      취소
                    </button>
                  )}
                  <button onClick={handleProductSubmit} className="h-10 rounded-xl bg-[#f48b94] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ee7b86]">
                    {editingProductId !== null ? "수정 완료" : "상품 등록"}
                  </button>
                </div>
              </div>
            </div>

            {/* 상품 목록 */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 border-l-4 border-[#f48b94] pl-3 text-base font-bold text-neutral-900">상품 목록</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 text-left text-xs font-semibold text-neutral-400">
                      <th className="pb-3 pr-4">상품명</th>
                      <th className="pb-3 pr-4">이벤트</th>
                      <th className="pb-3 pr-4">가격</th>
                      <th className="pb-3 pr-4">재고</th>
                      <th className="pb-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {products.map((product) => {
                      const event = events.find((e) => e.id === product.eventId);
                      return (
                        <tr key={product.id}>
                          <td className="py-3 pr-4 font-semibold text-neutral-800">{product.name}</td>
                          <td className="py-3 pr-4">
                            <span className="rounded-full bg-[#ffd6e0] px-2.5 py-0.5 text-xs font-semibold text-[#f48b94]">
                              {event?.brandName ?? "-"}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-neutral-600">{product.price.toLocaleString()}원</td>
                          <td className="py-3 pr-4">
                            {editingStockId === product.id ? (
                              <div className="flex items-center gap-1">
                                <input type="number" value={stockValue} onChange={(e) => setStockValue(e.target.value)} className="h-8 w-20 rounded-lg border border-[#f48b94] bg-neutral-50 px-2 text-sm outline-none" autoFocus />
                                <button onClick={() => handleStockSave(product.id)} className="h-8 rounded-lg bg-[#f48b94] px-2 text-xs font-semibold text-white">저장</button>
                                <button onClick={() => setEditingStockId(null)} className="h-8 rounded-lg border border-neutral-200 px-2 text-xs text-neutral-500">취소</button>
                              </div>
                            ) : (
                              <span className="font-semibold text-neutral-800">{product.stock}</span>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button onClick={() => handleEditProduct(product)} className="flex h-8 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50">
                                <Pencil className="h-3 w-3" /> 수정
                              </button>
                              <button onClick={() => { setEditingStockId(product.id); setStockValue(String(product.stock)); }} className="flex h-8 items-center gap-1 rounded-lg border border-blue-100 px-3 text-xs font-medium text-blue-500 hover:bg-blue-50">
                                <Package className="h-3 w-3" /> 재고
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="flex h-8 items-center gap-1 rounded-lg border border-red-100 px-3 text-xs font-medium text-red-400 hover:bg-red-50">
                                <Trash2 className="h-3 w-3" /> 삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
