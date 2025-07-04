"use client";

import React, { useState } from "react";
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
import { envPublic } from "@/constants/env.public";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
