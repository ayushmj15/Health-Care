"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { signOut } from "@/app/actions";
import { getNotifications, markNotificationsRead } from "@/lib/services/admin";
import { timeAgo } from "@/lib/utils";
import type { AppNotification } from "@/types";

export function NotificationsDropdown({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getNotifications(userId).then(setNotifications).catch(() => {});
    }
  }, [open, userId]);

  const unread = notifications.filter((n) => !n.is_read).length;

  async function markAll() {
    await markNotificationsRead(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    toast.success("All notifications marked as read");
  }

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <DropdownMenuLabel className="p-0 text-sm">Notifications</DropdownMenuLabel>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={markAll}>
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </Button>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          <div className="flex flex-col">
            {notifications.length === 0 && (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">No notifications yet</p>
            )}
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="cursor-pointer items-start gap-3 px-4 py-3" asChild>
                <a href={n.link ?? "#"}>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          n.is_read ? "bg-muted-foreground/40" : "bg-primary"
                        }`}
                      />
                      <p className="text-sm font-medium">{n.title}</p>
                    </div>
                    {n.message && <p className="text-xs text-muted-foreground">{n.message}</p>}
                    <p className="text-[11px] text-muted-foreground/70">{timeAgo(n.created_at)}</p>
                  </div>
                </a>
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserMenu({
  name,
  email,
  avatar,
  role,
  isAdmin,
}: {
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  isAdmin: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar ?? undefined} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-teal text-[10px] text-white">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs font-normal text-muted-foreground">{email}</p>
          <Badge variant="secondary" className="mt-2 capitalize">
            {role}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/dashboard/profile">Profile</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/dashboard/settings">Settings</a>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <a href="/admin">Admin dashboard</a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/dashboard/emergency" className="text-red-500">
            Emergency
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut()} className="cursor-pointer">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
