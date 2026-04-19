export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={`h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-[#f48b94] ${className ?? ""}`}
    />
  );
}
