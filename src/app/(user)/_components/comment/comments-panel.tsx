import CommentItem from "@/app/(user)/_components/comment/comment-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/providers/user-store-provider";
import { useSubmitCommentMutation, useVideoCommentQuery } from "@/queries/useVideo";
import { Video } from "@/types/video.types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const CommentsPanel = React.memo(({ video }: { video: Video }) => {
    const [inputValue, setInputValue] = useState("");
    const [isPollingEnabled, setIsPollingEnabled] = useState(true);
    const [editingCommentId, setEditingCommentId] = useState<string | number | null>(null);

    const { user } = useUserStore((state) => state);

    const {
        data: comments = [],
        isLoading,
        isError,
        error,
        dataUpdatedAt = 0,
    } = useVideoCommentQuery(video.id, {
        polling: isPollingEnabled,
        pollingInterval: 10000,
    });

    const submitCommentMutation = useSubmitCommentMutation();

    const userInfo = useMemo(
        () => ({
            id: user?.id,
            username: user?.username,
            avatar: user?.avatar,
        }),
        [user?.id, user?.username, user?.avatar]
    );

    // Tạm dừng polling khi user đang typing
    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;

        if (inputValue.trim()) {
            setIsPollingEnabled(false);
            timeoutId = setTimeout(() => {
                setIsPollingEnabled(true);
            }, 5000);
        } else {
            setIsPollingEnabled(true);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [inputValue]);

    // Pause polling khi component không visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPollingEnabled(!document.hidden);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    // Memoize handler functions
    const handleCommentSubmit = useCallback(async () => {
        if (!inputValue.trim()) {
            return;
        }

        if (!userInfo.id) {
            console.error("User not logged in");
            return;
        }

        submitCommentMutation.mutate(
            {
                userId: userInfo.id as number,
                videoId: video.id,
                content: inputValue.trim(),
                avatar: userInfo.avatar || undefined,
                username: userInfo.username || "Anonymous",
            },
            {
                onSuccess: () => {
                    setInputValue("");
                    setIsPollingEnabled(true);
                },
            }
        );
    }, [inputValue, userInfo, video.id, submitCommentMutation]);

    const handleClearInput = useCallback(() => {
        setInputValue("");
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCommentSubmit();
            }
        },
        [handleCommentSubmit]
    );

    const handleRetry = useCallback(() => {
        setIsPollingEnabled(true);
    }, []);

    const handleEditStart = useCallback((commentId: string | number) => {
        setEditingCommentId(commentId);
        setIsPollingEnabled(false); // Pause polling while editing
    }, []);

    const handleEditEnd = useCallback(() => {
        setEditingCommentId(null);
        setIsPollingEnabled(true); // Resume polling after editing
    }, []);

    // Memoize formatted time để tránh re-render
    const renderedComments = useMemo(() => {
        return comments.map((comment) => (
            <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={userInfo.id}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                isEditing={editingCommentId === comment.id}
                videoId={video.id}
            />
        ));
    }, [comments, userInfo.id, editingCommentId, video.id, handleEditStart, handleEditEnd]);

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 px-4 pt-4 pb-2 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-white">{video.title}</h3>
                        <p className="text-sm text-gray-400">Comments for video #{video.id}</p>
                    </div>

                    {/* Polling indicator  */}
                    {process.env.NODE_ENV === "development" && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    isPollingEnabled ? "bg-green-500" : "bg-red-500"
                                }`}
                            />
                            <span>{isPollingEnabled ? "Live" : "Paused"}</span>
                            <span>({new Date(dataUpdatedAt).toLocaleTimeString()})</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Comment list - Scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="px-4 py-4 space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-8">
                            <p className="text-sm text-red-400">
                                Error loading comments:{" "}
                                {error instanceof Error ? error.message : "Unknown error"}
                            </p>
                            <Button
                                onClick={handleRetry}
                                className="mt-2 text-xs text-blue-400 underline"
                            >
                                Retry
                            </Button>
                        </div>
                    ) : comments.length > 0 ? (
                        <>{renderedComments}</>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-sm text-gray-500">
                                No comments yet. Be the first to comment!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Comment input - Fixed at bottom */}
            <div className="flex-shrink-0 border-t border-white/10 p-4 bg-sidebar/90">
                <div className="flex items-start gap-3 mb-3">
                    <Avatar className="flex-shrink-0">
                        <AvatarImage
                            src={userInfo.avatar || undefined}
                            alt={userInfo.username || "User"}
                            className="w-8 h-8 rounded-full"
                        />
                        <AvatarFallback className="w-8 h-8 rounded-full bg-gray-600">
                            {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <Textarea
                            style={{ resize: "none" }}
                            className="w-full min-h-[40px] max-h-24"
                            rows={1}
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Enter your comment here..."
                            disabled={submitCommentMutation.isPending}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        variant={"ghost"}
                        size="sm"
                        className="rounded-full"
                        onClick={handleClearInput}
                        disabled={submitCommentMutation.isPending}
                    >
                        <span className="text-sm">Cancel</span>
                    </Button>
                    <Button
                        size="sm"
                        className="rounded-full"
                        onClick={handleCommentSubmit}
                        disabled={submitCommentMutation.isPending || !inputValue.trim()}
                    >
                        <span className="text-sm">
                            {submitCommentMutation.isPending ? "Submitting..." : "Comment"}
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
});

CommentsPanel.displayName = "CommentsPanel";

export default CommentsPanel;
