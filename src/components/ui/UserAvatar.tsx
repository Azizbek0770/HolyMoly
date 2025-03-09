import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface UserAvatarProps {
  className?: string;
  showName?: boolean;
}

export default function UserAvatar({
  className = "",
  showName = false,
}: UserAvatarProps) {
  const { user } = useAuth();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
          alt={user.name}
        />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      {showName && <span className="font-medium">{user.name}</span>}
    </div>
  );
}
