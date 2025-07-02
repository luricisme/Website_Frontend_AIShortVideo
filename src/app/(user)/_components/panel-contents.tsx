"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    EmailShareButton,
    EmailIcon,
} from "react-share";

import { Video } from "@/types/video.types";
import { formatTimeAgo } from "@/utils/common";
import { Button } from "@/components/ui/button";
import { envPublic } from "@/constants/env.public";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/providers/user-store-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSubmitCommentMutation, useVideoCommentQuery } from "@/queries/useVideo";

export const CommentsPanel = React.memo(({ video }: { video: Video }) => {
    const [inputValue, setInputValue] = useState("");
    const [isPollingEnabled, setIsPollingEnabled] = useState(true);
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

    // Memoize formatted time để tránh re-render
    const renderedComments = useMemo(() => {
        return comments.map((comment) => {
            const isNewComment = Date.now() - new Date(comment.createdAt).getTime() < 60000;
            const timeAgo = formatTimeAgo(comment.createdAt);

            return (
                <div key={comment.id} className="flex gap-3">
                    <Avatar className="flex-shrink-0">
                        <AvatarImage
                            src={comment.avatar || "https://via.placeholder.com/40"}
                            alt={comment.username}
                            className="w-8 h-8 rounded-full"
                        />
                        <AvatarFallback className="w-8 h-8 rounded-full bg-gray-600">
                            {comment.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium truncate">{comment.username}</span>
                            <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo}</span>
                            {isNewComment && (
                                <span className="text-xs bg-white text-black px-1 rounded flex-shrink-0">
                                    new
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-300 mt-1 break-words leading-relaxed">
                            {comment.content}
                        </p>
                    </div>
                </div>
            );
        });
    }, [comments]);

    // Debug re-render
    console.log(">>> CommentsPanel render", {
        videoId: video.id,
        commentsCount: comments.length,
        isPollingEnabled,
        inputValue: inputValue.length,
        dataUpdatedAt: new Date(dataUpdatedAt).toLocaleTimeString(),
    });

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

export const DetailsPanel = ({ video }: { video: Video }) => {
    return (
        <div className="flex flex-col gap-4 p-4">
            <div>
                <h3 className="text-lg font-medium mb-2">Video Details</h3>
                <div className="text-sm text-gray-300 space-y-2">
                    <p>
                        <span className="text-gray-400">Title:</span> {video.title}
                    </p>
                    <p>
                        <span className="text-gray-400">View count:</span>{" "}
                        {video.viewCnt.toLocaleString()}
                    </p>
                    <p>
                        <span className="text-gray-400">Duration:</span>{" "}
                        {Math.floor(video.length / 60)}:
                        {(video.length % 60).toString().padStart(2, "0")}
                    </p>
                    <p>
                        <span className="text-gray-400">ID Video:</span> {video.id}
                    </p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-sm text-gray-300">{video.script}</p>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-2">Author</h3>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage
                            src={video.user.avatar || "https://via.placeholder.com/40"}
                            alt={video.user.username}
                            className="w-8 h-8 rounded-full"
                        />
                        <AvatarFallback className="w-8 h-8 rounded-full bg-gray-600">
                            {video.user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">
                            {video.user.firstName} {video.user.lastName}
                        </p>
                        <p className="text-xs text-gray-400">@{video.user.username}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const SharePanel = ({ video }: { video: Video }) => {
    const [copied, setCopied] = useState(false);
    const videoUrl = `${envPublic.NEXT_PUBLIC_URL}/shorts/${video.id}`;
    // const videoUrl = "https://dantri.com.vn/";

    const handleCopy = () => {
        navigator.clipboard.writeText(videoUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <p className="text-sm text-gray-300">Chia sẻ video &quot;{video.title}&quot; qua:</p>

            <div className="grid grid-cols-3 gap-4">
                <FacebookShareButton url={videoUrl}>
                    <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-colors">
                        <FacebookIcon size={48} round />
                        <span className="text-sm">Facebook</span>
                    </div>
                </FacebookShareButton>

                <TwitterShareButton url={videoUrl} title={video.title}>
                    <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-colors">
                        <TwitterIcon size={48} round />
                        <span className="text-sm">Twitter</span>
                    </div>
                </TwitterShareButton>

                <WhatsappShareButton url={videoUrl} title={video.title}>
                    <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-colors">
                        <WhatsappIcon size={48} round />
                        <span className="text-sm">WhatsApp</span>
                    </div>
                </WhatsappShareButton>

                <EmailShareButton
                    url={videoUrl}
                    subject={video.title}
                    body={`Xem video này: ${videoUrl}`}
                >
                    <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-colors">
                        <EmailIcon size={48} round />
                        <span className="text-sm">Email</span>
                    </div>
                </EmailShareButton>

                <div
                    onClick={() => alert("Embed tính năng chưa hỗ trợ")}
                    className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-colors"
                >
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xl">💻</span>
                    </div>
                    <span className="text-sm">Embed</span>
                </div>

                <div
                    onClick={handleCopy}
                    className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-colors"
                >
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xl">🔗</span>
                    </div>
                    <span className="text-sm">{copied ? "Đã sao chép!" : "Link"}</span>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Link video:</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={videoUrl}
                        readOnly
                        className="flex-1 bg-gray-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none"
                    />
                    <button
                        onClick={handleCopy}
                        className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-sm transition-colors"
                    >
                        {copied ? "Đã sao chép!" : "Sao chép"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const PlaylistPanel = ({ video }: { video: Video }) => {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-300">Video hiện tại: &quot;{video.title}&quot;</p>

            <div className="flex flex-col gap-3">
                <h3 className="text-lg font-medium">Danh sách phát đề xuất</h3>

                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-md transition-colors"
                    >
                        <div className="w-20 h-12 bg-gray-700 rounded-md flex items-center justify-center">
                            <span className="text-xs text-gray-300">Thumbnail</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">Video đề xuất #{i + 1}</p>
                            <p className="text-xs text-gray-400">
                                {Math.floor(Math.random() * 1000)}K lượt xem •{" "}
                                {Math.floor(Math.random() * 10) + 1} ngày trước
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
