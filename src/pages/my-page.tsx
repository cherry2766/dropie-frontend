import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { User, MapPin, LogOut, Plus, Package, Camera, Pencil, Check, X as XIcon } from "lucide-react";
import { useLogoutMutation } from "@/hooks/mutations/auth/use-logout";
import { useWithdrawUser } from "@/hooks/mutations/user/use-withdraw-user";
import { useUpdateNickname } from "@/hooks/mutations/user/use-update-nickname";
import { useUpdateProfileImage } from "@/hooks/mutations/user/use-update-profile-image";
import { useAddressesData } from "@/hooks/queries/use-addresses-data";
import { useMeData } from "@/hooks/queries/use-me-data";
import { useMyOrdersData } from "@/hooks/queries/use-my-orders-data";
import type { OrderStatus } from "@/types/order";
import { useUpdateAddress } from "@/hooks/mutations/address/use-update-address";
import { useDeleteAddress } from "@/hooks/mutations/address/use-delete-address";
import AddAddressModal from "@/components/my/add-address-modal";
import OrderDetailSheet from "@/components/my/order-detail-sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { showSuccessToast } from "@/lib/toast";

type Tab = "orders" | "address";

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "결제 대기",
  PAID: "결제 완료",
  CANCELED: "취소됨",
};

const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-600",
  PAID: "bg-emerald-50 text-emerald-600",
  CANCELED: "bg-neutral-100 text-neutral-400",
};

export default function MyPage() {
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawUser();
  const updateNicknameMutation = useUpdateNickname();
  const updateProfileImageMutation = useUpdateProfileImage();
  const { data: me } = useMeData();
  const [tab, setTab] = useState<Tab>("orders");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleNicknameEditStart() {
    setNicknameInput(me?.nickname ?? "");
    setEditingNickname(true);
  }

  async function handleNicknameSave() {
    if (!nicknameInput.trim()) return;
    await updateNicknameMutation.mutateAsync(nicknameInput.trim());
    setEditingNickname(false);
  }

  function handleProfileImageClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) updateProfileImageMutation.mutate(file);
    e.target.value = "";
  }

  const { data: addresses = [] } = useAddressesData();
  const { data: ordersData } = useMyOrdersData();
  const orders = ordersData?.content ?? [];
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  async function handleDeleteAddress(id: number) {
    try {
      await deleteAddressMutation.mutateAsync(id);
      showSuccessToast("배송지가 삭제되었습니다.");
    } catch {
      // 에러는 mutation의 onError에서 toast 처리
    }
  }

  return (
    <div className="pb-6">
      {/* 프로필 */}
      <div className="mb-5 flex items-center justify-between rounded-2xl bg-[#fff0f3] px-5 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleProfileImageClick}
            disabled={updateProfileImageMutation.isPending}
            className="relative h-14 w-14 shrink-0"
          >
            {me?.profileImageUrl ? (
              <img
                src={me.profileImageUrl}
                alt="프로필"
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f48b94]">
                <User className="h-7 w-7 text-white" />
              </div>
            )}
            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
              <Camera className="h-3 w-3 text-neutral-500" />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div>
            {editingNickname ? (
              <div className="flex items-center gap-1.5">
                <input
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNicknameSave()}
                  className="h-8 w-32 rounded-lg border border-[#f48b94] px-2 text-sm font-bold text-neutral-900 outline-none focus:ring-1 focus:ring-[#f48b94]"
                  autoFocus
                />
                <button
                  onClick={handleNicknameSave}
                  disabled={updateNicknameMutation.isPending}
                  className="text-[#f48b94] disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => setEditingNickname(false)} className="text-neutral-400">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <p className="text-base font-bold text-neutral-900">{me?.nickname ?? ""}님</p>
                <button onClick={handleNicknameEditStart} className="text-neutral-400 hover:text-neutral-600">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <p className="mt-0.5 text-sm text-neutral-500">{me?.email ?? ""}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </button>
      </div>

      {/* 탭 */}
      <div className="-mx-4 mb-4 flex border-b border-neutral-100">
        <button
          onClick={() => setTab("orders")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-colors ${tab === "orders" ? "border-b-2 border-[#f48b94] text-[#f48b94]" : "text-neutral-400"}`}
        >
          <Package className="h-4 w-4" />
          주문 내역
        </button>
        <button
          onClick={() => setTab("address")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-colors ${tab === "address" ? "border-b-2 border-[#f48b94] text-[#f48b94]" : "text-neutral-400"}`}
        >
          <MapPin className="h-4 w-4" />
          배송지 관리
        </button>
      </div>

      {/* 주문 내역 */}
      {tab === "orders" && (
        <div className="space-y-2">
          {orders.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-400">주문 내역이 없어요.</p>
          ) : (
            orders.map((order) => (
              <button
                key={order.orderId}
                onClick={() => setSelectedOrderId(order.orderId)}
                className="w-full rounded-2xl border border-neutral-100 px-4 py-3 text-left transition hover:border-[#f4c9cf] hover:bg-[#fffafb]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-neutral-400">{order.createdAt.replace("T", " ").slice(0, 16)}</p>
                    <p className="mt-0.5 text-sm font-bold text-[#f48b94]">{order.brandName}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{order.orderNumber}</p>
                    <p className="mt-0.5 text-sm font-bold text-neutral-900">{order.totalPrice.toLocaleString()}원</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ORDER_STATUS_STYLE[order.status]}`}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* 배송지 관리 */}
      {tab === "address" && (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-2xl border border-neutral-100 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#fff0f3] px-2 py-0.5 text-xs font-semibold text-[#f48b94]">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                      기본
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button
                      onClick={() => updateAddressMutation.mutate({ addressId: addr.id, data: { isDefault: true } })}
                      disabled={updateAddressMutation.isPending}
                      className="text-xs text-[#f48b94] hover:underline disabled:opacity-50 transition-colors"
                    >
                      기본으로 설정
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    disabled={deleteAddressMutation.isPending}
                    className="text-xs text-neutral-400 hover:text-red-400 disabled:opacity-50 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm font-semibold text-neutral-800">
                {addr.receiverName} · {addr.phone}
              </p>
              <p className="mt-0.5 text-sm text-neutral-600">{addr.address1}</p>
              {addr.address2 && <p className="text-sm text-neutral-500">{addr.address2}</p>}
              <p className="text-xs text-neutral-400">{addr.zipcode}</p>
            </div>
          ))}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 py-4 text-sm font-medium text-neutral-500 transition hover:border-[#f48b94] hover:text-[#f48b94]"
          >
            <Plus className="h-4 w-4" />
            배송지 추가
          </button>
        </div>
      )}

      {/* 비밀번호 변경 / 회원 탈퇴 */}
      <div className="mt-10 flex items-center justify-end gap-4">
        <Link to="/forgot-password" className="text-xs text-neutral-400 underline underline-offset-2 hover:text-neutral-600 transition-colors">
          비밀번호 변경
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-xs text-neutral-400 underline underline-offset-2 hover:text-red-400 transition-colors">
              회원 탈퇴
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>정말 탈퇴하시겠어요?</AlertDialogTitle>
              <AlertDialogDescription>
                탈퇴하면 계정 정보와 주문 내역을 더 이상 확인할 수 없어요.
                이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => withdraw()}
                disabled={isWithdrawing}
                className="bg-red-500 hover:bg-red-600 focus:ring-red-500 disabled:opacity-60"
              >
                {isWithdrawing ? "탈퇴 처리 중..." : "탈퇴하기"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <AddAddressModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        isFirstAddress={addresses.length === 0}
      />

      <OrderDetailSheet
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
}
