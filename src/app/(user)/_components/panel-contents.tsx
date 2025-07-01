"use client";

import { commentApiRequests } from "@/apiRequests/comment";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { envPublic } from "@/constants/env.public";
import { Comment } from "@/types/comment.types";
import { UserLocalStorage } from "@/types/user.types";
import { Video } from "@/types/video.types";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useCallback, useEffect, useState } from "react";
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

export const CommentsPanel = ({ video }: { video: Video }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [inputValue, setInputValue] = useState("");
    const userInfo: UserLocalStorage | null =
        typeof window !== "undefined"
            ? (() => {
                  const item = localStorage.getItem("user");
                  return item ? (JSON.parse(item) as UserLocalStorage) : null;
              })()
            : null;

    const fetchComments = useCallback(async () => {
        try {
            const response = await commentApiRequests.getComments(video.id);
            if (response.status === 200) {
                setComments(response.data.items);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }, [video.id]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 pt-4 pb-2 border-b border-white/10">
                <h3 className="text-lg font-medium text-white">{video.title}</h3>
                <p className="text-sm text-gray-400">Comments for video #{video.id}</p>
            </div>

            {/* Comment list */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <Avatar>
                                <AvatarImage
                                    src={comment.avatar || "https://via.placeholder.com/40"}
                                    alt={comment.username}
                                    className="w-8 h-8 rounded-full"
                                />
                                <AvatarFallback className="w-8 h-8 rounded-full bg-gray-600">
                                    {comment.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{comment.username}</span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(comment.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300">{comment.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">
                        No comments yet. Be the first to comment!
                    </p>
                )}
            </div>

            {/* Comment input */}
            <div className="mt-auto border-t border-white/10 p-4">
                <div className="flex items-start gap-3">
                    <Avatar>
                        <AvatarImage
                            src={userInfo?.avatar || "https://via.placeholder.com/40"}
                            alt={userInfo?.name || "User"}
                            className="w-8 h-8 rounded-full"
                        />
                        <AvatarFallback className="w-8 h-8 rounded-full bg-gray-600">
                            {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                    </Avatar>

                    <Textarea
                        style={{ resize: "none" }}
                        className="max-h-24 flex-1"
                        rows={1}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter your comment here..."
                    />
                </div>

                <div className="flex justify-end gap-2 mt-2">
                    <Button
                        variant={"ghost"}
                        className="rounded-full"
                        onClick={() => setInputValue("")}
                    >
                        <span className="text-sm">Cancel</span>
                    </Button>
                    <Button className="rounded-full">
                        <span className="text-sm">Comment</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const DetailsPanel = ({ video }: { video: Video }) => {
    return (
        <div className="flex flex-col gap-4 p-4">
            <div>
                <h3 className="text-lg font-medium mb-2">Thông tin chi tiết</h3>
                <div className="text-sm text-gray-300 space-y-2">
                    <p>
                        <span className="text-gray-400">Tiêu đề:</span> {video.title}
                    </p>
                    <p>
                        <span className="text-gray-400">Lượt xem:</span>{" "}
                        {video.viewCnt.toLocaleString()}
                    </p>
                    <p>
                        <span className="text-gray-400">Thời lượng:</span>{" "}
                        {Math.floor(video.length / 60)}:
                        {(video.length % 60).toString().padStart(2, "0")}
                    </p>
                    <p>
                        <span className="text-gray-400">ID Video:</span> {video.id}
                    </p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-2">Mô tả</h3>
                <p className="text-sm text-gray-300">{video.script}</p>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-2">Tác giả</h3>
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
