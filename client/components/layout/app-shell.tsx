import * as React from "react";
import { cn } from "@/lib/utils";
import { DevPilotIcon } from "@/components/icons/devpilot-icon";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-bold tracking-tight text-foreground", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
        <DevPilotIcon className="size-5" />
      </div>
      <span className="text-xl font-bold">DevPilot</span>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}
