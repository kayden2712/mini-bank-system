import * as React from "react";

import { cn } from "@/utils/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-offset-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-500",
        className,
      )}
      {...props}
    />
  );
}
