import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Edit, Loader2 } from "lucide-react";

import { Video } from "@/types/video.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpdateVideoTitleMutation } from "@/queries/useVideo";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


const EditVideoInfoDialog = ({ video }: { video: Video }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(video.title || "");
    const updateVideoTitleMutation = useUpdateVideoTitleMutation();

    // Reset title when video changes or dialog opens
    useEffect(() => {
        if (isOpen) {
            setTitle(video.title || "");
        }
    }, [isOpen, video.title]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Video title cannot be empty.");

            return;
        }

        if (title.trim() === video.title) {
            setIsOpen(false);
            return;
        }

        try {
            await updateVideoTitleMutation.mutateAsync({
                videoId: video.id,
                title: title.trim(),
            });

            toast.success(`Video title updated to "${title.trim()}".`);

            setIsOpen(false);
        } catch (error) {
            console.error("Update video title error:", error);

            toast.error("Failed to update video title. Please try again later.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    title="Edit video"
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                    disabled={updateVideoTitleMutation.isPending}
                >
                    {updateVideoTitleMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Edit className="w-4 h-4" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-white">Edit Video Information</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Update your video information. Make sure the information is accurate.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                            <Label htmlFor="title" className="text-zinc-300">
                                Video Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter video title..."
                                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                maxLength={100}
                                disabled={updateVideoTitleMutation.isPending}
                            />
                            <div className="text-xs text-zinc-500">
                                {title.length}/100 characters
                            </div>
                        </div>

                        {/* ⚠️ Video info for context */}
                        <div className="text-xs text-zinc-600 space-y-1">
                            <p>Video ID: {video.id}</p>
                            <p>Views: {(video.viewCnt || 0).toLocaleString()}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="border-zinc-700 hover:bg-zinc-800"
                                disabled={updateVideoTitleMutation.isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={
                                updateVideoTitleMutation.isPending ||
                                !title.trim() ||
                                title.trim() === video.title
                            }
                        >
                            {updateVideoTitleMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditVideoInfoDialog;
