import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User } from "@/types/user.types";
import { useDeleteUserMutation } from "@/queries/use-admin";

const UserDeleteAlertDialog = ({ user }: { user: User }) => {
    const [isOpen, setIsOpen] = useState(false);
    const deleteUserMutation = useDeleteUserMutation();

    let name = "Unnamed User";
    if (user.role === "ADMIN") {
        name = user.email;
    } else {
        name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }

    const handleDelete = async () => {
        try {
            await deleteUserMutation.mutateAsync(user.id || "");

            toast.success(`User "${name}" has been deleted successfully.`);

            setIsOpen(false);
        } catch (error) {
            console.error("Failed to delete user:", error);

            toast.error("Failed to delete user. Please try again later.");
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    title="Delete User"
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                    disabled={deleteUserMutation.isPending}
                >
                    {deleteUserMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4" />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-400">Delete User</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                        Are you sure you want to delete user <strong>&quot;{name}&quot;</strong>?
                        This action cannot be undone and will permanently remove:
                        <ul className="mt-2 ml-4 list-disc space-y-1">
                            <li>All user data associated with this account</li>
                            <li>All user interactions and history</li>
                            <li>All user-created content</li>
                        </ul>
                        <br />
                        <span className="text-xs text-zinc-600">User ID: {user.id}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className="border-zinc-700 hover:bg-zinc-800"
                        disabled={deleteUserMutation.isPending}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteUserMutation.isPending}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
                    >
                        {deleteUserMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Video"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default UserDeleteAlertDialog;
