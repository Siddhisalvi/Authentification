import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { authClient } from "@/lib/auth-client";

export function DialogCloseButton({
  userId,
  banned,
  onUserUpdated,
}: {
  userId: string;
  banned: boolean | null;
  onUserUpdated: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">{banned ? "Enable" : "Disable"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you user</DialogTitle>
          <DialogDescription>
            {banned
              ? "Do You want to enable this user?"
              : "Do you want to Disable this user?"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="mx-auto flex gap-6">
            <DialogClose asChild>
              <Button
                size="lg"
                variant="default"
                onClick={async () => {
                  if (banned) {
                    await authClient.admin.unbanUser({ userId });
                  } else {
                    await authClient.admin.banUser({ userId });
                  }
                  
                  onUserUpdated(); //trigger data refresh after the action
                }}
              >
                Confirm
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button size="lg" type="button" variant="destructive">
                Close
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
