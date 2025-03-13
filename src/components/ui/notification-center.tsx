import { useState } from "react";
import { Bell, X, Check, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationBadge } from "@/components/ui/notification-badge";
import {
  useNotifications,
  NotificationType,
} from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NotificationCenterProps {
  maxHeight?: string;
  showTabs?: boolean;
}

export function NotificationCenter({
  maxHeight = "400px",
  showTabs = true,
}: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
  } = useNotifications();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | NotificationType>("all");

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "order":
        return "🛒";
      case "delivery":
        return "🚚";
      case "promo":
        return "🎁";
      case "system":
        return "⚙️";
      default:
        return "📣";
    }
  };

  const filteredNotifications = notifications.filter(
    (notification) => activeTab === "all" || notification.type === activeTab,
  );

  const handleNotificationClick = (id: string, actionUrl?: string) => {
    markAsRead(id);
    if (actionUrl) {
      window.location.href = actionUrl;
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <NotificationBadge
              count={unreadCount}
              className="absolute -top-1 -right-1"
              pulse
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={markAllAsRead}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={clearNotifications}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear all
            </Button>
          </div>
        </div>

        {showTabs && (
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
          >
            <div className="px-4 pt-2">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="order">Orders</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
                <TabsTrigger value="promo">Promos</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        )}

        <ScrollArea className={`max-h-[${maxHeight}]`}>
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>No notifications</p>
            </div>
          ) : (
            <div>
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${!notification.read ? "bg-muted/20" : ""}`}
                  onClick={() =>
                    handleNotificationClick(
                      notification.id,
                      notification.actionUrl,
                    )
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm leading-none">
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(notification.timestamp, {
                              addSuffix: true,
                            })}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      {notification.actionUrl && (
                        <div className="flex items-center text-xs text-primary mt-1">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View details
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
