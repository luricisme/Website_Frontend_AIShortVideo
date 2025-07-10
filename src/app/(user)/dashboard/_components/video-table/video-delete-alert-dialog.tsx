import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";

import { Video } from "@/types/video.types";
import { Button } from "@/components/ui/button";
import { useDeleteVideoMutation } from "@/queries/useVideo";
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

const DeleteVideoAlertDialog = ({ video }: { video: Video }) => {
    const [isOpen, setIsOpen] = useState(false);
    const deleteVideoMutation = useDeleteVideoMutation();

    const handleDelete = async () => {
        try {
            await deleteVideoMutation.mutateAsync(video.id);

            toast.success(
                `Video "${video.title || "Untitled Video"}" has been deleted successfully.`
            );

            setIsOpen(false);
        } catch (error) {
            console.error("Delete video error:", error);

            toast.error("Failed to delete video. Please try again later.");
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    title="Delete video"
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                    disabled={deleteVideoMutation.isPending}
                >
                    {deleteVideoMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4" />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-400">Delete Video</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                        Are you sure you want to delete{" "}
                        <strong>&quot;{video.title || "Untitled Video"}&quot;</strong>? This action
                        cannot be undone and will permanently remove:
                        <ul className="mt-2 ml-4 list-disc space-y-1">
                            <li>The video and all its data</li>
                            <li>All comments and interactions</li>
                            <li>View statistics and analytics</li>
                        </ul>
                        <br />
                        <span className="text-xs text-zinc-600">Video ID: {video.id}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className="border-zinc-700 hover:bg-zinc-800"
                        disabled={deleteVideoMutation.isPending}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteVideoMutation.isPending}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
                    >
                        {deleteVideoMutation.isPending ? (
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

export default DeleteVideoAlertDialog;
