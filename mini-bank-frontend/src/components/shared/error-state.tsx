import { Button } from "@/components/ui/button";

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
      <p className="text-sm text-rose-700">{message}</p>
      <Button className="mt-3" variant="danger" onClick={onRetry}>
        Thử lại
      </Button>
    </div>
  );
}
