import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <span className="ml-4">Loading...</span>
      </div>
    </main>
  );
}
