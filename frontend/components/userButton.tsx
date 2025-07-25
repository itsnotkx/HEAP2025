import { Button } from "@heroui/button";
import { UserIcon } from "lucide-react";
import { Image } from "@heroui/react";

interface UserButtonProps {
  user?: {
    username: string;
    profilePictureUrl?: string;
  };
  onClick?: () => void;
}

export default function UserButton({ user, onClick }: UserButtonProps) {
  const isSignedIn = !!user;

  return (
    <Button
      className="flex items-center space-x-2 px-7 py-5 rounded-full"
      variant="ghost"
      onPress={onClick}
    >
      {isSignedIn ? (
        <Image
          alt={`profile`}
          className="w-8 h-8 rounded-full object-cover"
          src={user?.profilePictureUrl}
        />
      ) : (
        <>
          <UserIcon className="w-8 h-8 text-gray-400" />
          <span className="font-medium">Sign In</span>
        </>
      )}
    </Button>
  );
}
