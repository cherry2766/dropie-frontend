import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Pencil, Package, CalendarDays, Home } from "lucide-react";
import type { EventStatus, EventEntity as Event } from "@/types";
import type { AdminProductItem as Product } from "@/types/admin";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useAdminEventsData } from "@/hooks/queries/use-admin-events-data";
import { useAdminProductsData } from "@/hooks/queries/use-admin-products-data";
import { useCreateEvent } from "@/hooks/mutations/admin/use-create-event";
import { useUpdateEvent } from "@/hooks/mutations/admin/use-update-event";
import { useUpdateEventStatus } from "@/hooks/mutations/admin/use-update-event-status";
import { useDeleteEvent } from "@/hooks/mutations/admin/use-delete-event";
import { useCreateProduct } from "@/hooks/mutations/admin/use-create-product";
import { useUpdateProduct } from "@/hooks/mutations/admin/use-update-product";
import { useUpdateProductStock } from "@/hooks/mutations/admin/use-update-product-stock";
import { useDeleteProduct } from "@/hooks/mutations/admin/use-delete-product";
import { showSuccessToast, showInfoToast } from "@/lib/toast";

// Tab은 이 페이지 내부에서만 쓰는 UI 상태이므로 여기에 정의
type Tab = "events" | "products";

const STATUS_STYLE: Record<EventStatus, string> = {
  OPEN: "bg-emerald-50 text-emerald-600",
  UPCOMING: "bg-blue-50 text-blue-600",
  CLOSED: "bg-[#ffd6e0] text-neutral-500",
  FINISHED: "bg-neutral-100 text-neutral-400",
};

const EVENT_FORM_INIT = { brandName: "", description: "", thumbnailImageUrl: "", imageUrl: "", startAt: "", endAt: "", status: "UPCOMING" as EventStatus };
const PRODUCT_FORM_INIT = { eventId: "", name: "", imageUrl: "", description: "", price: "", stock: "" };

// datetime-local 인풋은 "YYYY-MM-DDTHH:mm", API는 초 단위까지 필요
function toApiDatetime(value: string): string {
  return value.length === 16 ? `${value}:00` : value;
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("events");

  // 이벤트
  const { data: events = [] } = useAdminEventsData();
  const { data: products = [] } = useAdminProductsData();

  const [eventForm, setEventForm] = useState(EVENT_FORM_INIT);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [originalEventStatus, setOriginalEventStatus] = useState<EventStatus | null>(null);

  // 상품
  const [productForm, setProductForm] = useState(PRODUCT_FORM_INIT);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [stockValue, setStockValue] = useState("");

  // 이미지 업로드 (썸네일/상세 이미지 분리, 상품 이미지 별도)
  const thumbnailUpload = useImageUpload();
  const detailUpload = useImageUpload();
  const productImageUpload = useImageUpload();

  // 이벤트 mutations
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const updateEventStatusMutation = useUpdateEventStatus();
  const deleteEventMutation = useDeleteEvent();

  // 상품 mutations
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const updateProductStockMutation = useUpdateProductStock();
  const deleteProductMutation = useDeleteProduct();

  const isEventSubmitting =
    createEventMutation.isPending ||
    updateEventMutation.isPending ||
    updateEventStatusMutation.isPending ||
    thumbnailUpload.isUploading ||
    detailUpload.isUploading;

  const isProductSubmitting =
    createProductMutation.isPending ||
    updateProductMutation.isPending ||
    productImageUpload.isUploading;

  // 이벤트 등록/수정
  async function handleEventSubmit() {
    if (!eventForm.brandName || !eventForm.startAt || !eventForm.endAt) return;
    if (thumbnailUpload.isUploading || detailUpload.isUploading) return;

    try {
      if (editingEventId !== null) {
        await updateEventMutation.mutateAsync({
          eventId: editingEventId,
          data: {
            brandName: eventForm.brandName,
            description: eventForm.description,
            thumbnailImageUrl: eventForm.thumbnailImageUrl,
            imageUrl: eventForm.imageUrl,
            startAt: toApiDatetime(eventForm.startAt),
            endAt: toApiDatetime(eventForm.endAt),
          },
        });
        if (eventForm.status !== originalEventStatus) {
          await updateEventStatusMutation.mutateAsync({
            eventId: editingEventId,
            status: eventForm.status,
          });
        }
        setEditingEventId(null);
        setOriginalEventStatus(null);
        showSuccessToast("이벤트가 수정되었습니다.");
      } else {
        await createEventMutation.mutateAsync({
          brandName: eventForm.brandName,
          description: eventForm.description,
          thumbnailImageUrl: eventForm.thumbnailImageUrl,
          imageUrl: eventForm.imageUrl,
          startAt: toApiDatetime(eventForm.startAt),
          endAt: toApiDatetime(eventForm.endAt),
        });
        showSuccessToast("이벤트가 등록되었습니다.");
      }
      setEventForm(EVENT_FORM_INIT);
      thumbnailUpload.reset();
      detailUpload.reset();
    } catch {
      // 에러는 mutation의 onError에서 toast 처리
    }
  }

  function handleEditEvent(event: Event) {
    setEditingEventId(event.id);
    setOriginalEventStatus(event.status);
    setEventForm({ brandName: event.brandName, description: event.description, thumbnailImageUrl: event.thumbnailImageUrl, imageUrl: event.imageUrl, startAt: event.startAt.slice(0, 16), endAt: event.endAt.slice(0, 16), status: event.status });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteEvent(id: number) {
    try {
      await deleteEventMutation.mutateAsync(id);
      showSuccessToast("이벤트가 삭제되었습니다.");
    } catch {
      // 에러는 mutation의 onError에서 toast 처리
    }
  }

  // 상품 등록/수정
  async function handleProductSubmit() {
    if (!productForm.eventId) { showInfoToast("이벤트를 선택해주세요."); return; }
    if (!productForm.name) { showInfoToast("상품명을 입력해주세요."); return; }
    if (!productForm.price) { showInfoToast("가격을 입력해주세요."); return; }
    if (!productForm.stock) { showInfoToast("재고 수량을 입력해주세요."); return; }
    if (productImageUpload.isUploading) return;

    try {
      if (editingProductId !== null) {
        await updateProductMutation.mutateAsync({
          productId: editingProductId,
          data: {
            name: productForm.name,
            imageUrl: productForm.imageUrl,
            description: productForm.description,
            price: Number(productForm.price),
          },
        });
        await updateProductStockMutation.mutateAsync({
          productId: editingProductId,
          stock: Number(productForm.stock),
        });
        setEditingProductId(null);
        showSuccessToast("상품이 수정되었습니다.");
      } else {
        await createProductMutation.mutateAsync({
          eventId: Number(productForm.eventId),
          name: productForm.name,
          imageUrl: productForm.imageUrl,
          description: productForm.description,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
        });
        showSuccessToast("상품이 등록되었습니다.");
      }
      setProductForm(PRODUCT_FORM_INIT);
      productImageUpload.reset();
    } catch {
      // 에러는 mutation의 onError에서 toast 처리
    }
  }

  function handleEditProduct(product: Product) {
    setEditingProductId(product.id);
    setProductForm({ eventId: String(product.eventId), name: product.name, imageUrl: product.imageUrl, description: product.description, price: String(product.price), stock: String(product.stock) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteProduct(id: number) {
    try {
      await deleteProductMutation.mutateAsync(id);
      showSuccessToast("상품이 삭제되었습니다.");
    } catch {
      // 에러는 mutation의 onError에서 toast 처리
    }
  }

  async function handleStockSave(id: number) {
    try {
      await updateProductStockMutation.mutateAsync({ productId: id, stock: Number(stockValue) });
      setEditingStockId(null);
      setStockValue("");
      showSuccessToast("재고가 수정되었습니다.");
    } catch {
      // 에러는 mutation의 onError에서 toast 처리
    }
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
                      <option value="FINISHED">FINISHED</option>
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
                    <label className="relative flex h-40 cursor-pointer items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-400 transition hover:border-[#f48b94] hover:text-[#f48b94] overflow-hidden">
                      {thumbnailUpload.isUploading
                        ? <span className="text-xs text-neutral-400">업로드 중...</span>
                        : eventForm.thumbnailImageUrl
                          ? <img src={eventForm.thumbnailImageUrl} alt="썸네일" className="h-full w-full object-cover" />
                          : "+ 이미지 업로드"
                      }
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={thumbnailUpload.isUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await thumbnailUpload.upload(file);
                          if (url) setEventForm((p) => ({ ...p, thumbnailImageUrl: url }));
                        }}
                      />
                    </label>
                    <p className="mt-1 text-xs text-neutral-400">목록 카드에 표시되는 이미지</p>
                  </div>
                  <div>
                    <label className={labelCls}>상세 이미지</label>
                    <label className="relative flex h-40 cursor-pointer items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-400 transition hover:border-[#f48b94] hover:text-[#f48b94] overflow-hidden">
                      {detailUpload.isUploading
                        ? <span className="text-xs text-neutral-400">업로드 중...</span>
                        : eventForm.imageUrl
                          ? <img src={eventForm.imageUrl} alt="상세" className="h-full w-full object-cover" />
                          : "+ 이미지 업로드"
                      }
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={detailUpload.isUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await detailUpload.upload(file);
                          if (url) setEventForm((p) => ({ ...p, imageUrl: url }));
                        }}
                      />
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
                    <button
                      onClick={() => { setEditingEventId(null); setOriginalEventStatus(null); setEventForm(EVENT_FORM_INIT); thumbnailUpload.reset(); detailUpload.reset(); }}
                      className="h-10 rounded-xl border border-neutral-200 px-5 text-sm font-semibold text-neutral-500 hover:bg-neutral-50"
                    >
                      취소
                    </button>
                  )}
                  <button
                    onClick={handleEventSubmit}
                    disabled={isEventSubmitting}
                    className="h-10 rounded-xl bg-[#f48b94] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ee7b86] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isEventSubmitting ? "처리 중..." : editingEventId !== null ? "수정 완료" : "이벤트 등록"}
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
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              disabled={deleteEventMutation.isPending}
                              className="flex h-8 items-center gap-1 rounded-lg border border-red-100 px-3 text-xs font-medium text-red-400 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
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
                  <p className="mt-1 text-xs text-neutral-400">상품이 속할 이벤트를 선택하세요</p>
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
                    <label className={labelCls}>상품 이미지</label>
                    <label className="relative flex h-48 cursor-pointer items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-400 transition hover:border-[#f48b94] hover:text-[#f48b94] overflow-hidden">
                      {productImageUpload.isUploading
                        ? <span className="text-xs text-neutral-400">업로드 중...</span>
                        : productForm.imageUrl
                          ? <img src={productForm.imageUrl} alt="상품" className="h-full w-full object-cover" />
                          : "+ 이미지 업로드"
                      }
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={productImageUpload.isUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await productImageUpload.upload(file);
                          if (url) setProductForm((p) => ({ ...p, imageUrl: url }));
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className={labelCls}>재고 수량</label>
                      <input type="number" value={productForm.stock} onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))} placeholder="예: 100" className={inputCls} />
                    </div>
                    <div className="flex-1">
                      <label className={labelCls}>상품 설명</label>
                      <textarea value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} placeholder="상품에 대한 설명을 입력하세요" className="w-full h-[calc(100%-1.5rem)] min-h-[80px] rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-[#f48b94] focus:ring-1 focus:ring-[#f48b94] resize-none" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {editingProductId !== null && (
                    <button
                      onClick={() => { setEditingProductId(null); setProductForm(PRODUCT_FORM_INIT); productImageUpload.reset(); }}
                      className="h-10 rounded-xl border border-neutral-200 px-5 text-sm font-semibold text-neutral-500 hover:bg-neutral-50"
                    >
                      취소
                    </button>
                  )}
                  <button
                    onClick={handleProductSubmit}
                    disabled={isProductSubmitting}
                    className="h-10 rounded-xl bg-[#f48b94] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ee7b86] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isProductSubmitting ? "처리 중..." : editingProductId !== null ? "수정 완료" : "상품 등록"}
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
                      <th className="pb-3 pr-4 w-[30%]">상품명</th>
                      <th className="pb-3 pr-4 w-[15%]">이벤트</th>
                      <th className="pb-3 pr-4 w-[17%]">가격</th>
                      <th className="pb-3 pr-4 w-[10%]">재고</th>
                      <th className="pb-3 w-[28%]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {products.map((product) => {
                      return (
                        <tr key={product.id}>
                          <td className="py-3 pr-4 font-semibold text-neutral-800">{product.name}</td>
                          <td className="py-3 pr-4">
                            <span className="rounded-full bg-[#ffd6e0] px-2.5 py-0.5 text-xs font-semibold text-[#f48b94]">
                              {product.eventBrandName}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-neutral-600">{product.price.toLocaleString()}원</td>
                          <td className="py-3 pr-4">
                            {editingStockId === product.id ? (
                              <div className="flex items-center gap-1">
                                <input type="number" value={stockValue} onChange={(e) => setStockValue(e.target.value)} className="h-8 w-20 rounded-lg border border-[#f48b94] bg-neutral-50 px-2 text-sm outline-none" autoFocus />
                                <button
                                  onClick={() => handleStockSave(product.id)}
                                  disabled={updateProductStockMutation.isPending}
                                  className="h-8 rounded-lg bg-[#f48b94] px-2 text-xs font-semibold text-white disabled:opacity-60"
                                >
                                  {updateProductStockMutation.isPending ? "..." : "저장"}
                                </button>
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
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={deleteProductMutation.isPending}
                                className="flex h-8 items-center gap-1 rounded-lg border border-red-100 px-3 text-xs font-medium text-red-400 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                              >
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
