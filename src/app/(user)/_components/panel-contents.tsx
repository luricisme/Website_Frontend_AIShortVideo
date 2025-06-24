import { VideoType } from "./video-detail";

export const CommentsPanel = ({ video }: { video: VideoType }) => {
    return (
        <>
            <div className="mb-4">
                <h3 className="text-lg font-medium text-white">{video.title}</h3>
                <p className="text-sm text-gray-400">Bình luận cho video #{video.id}</p>
            </div>

            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-600"></div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Người dùng {i + 1}</span>
                            <span className="text-xs text-gray-400">2 giờ trước</span>
                        </div>
                        <p className="text-sm text-gray-300">
                            Đây là bình luận mẫu cho video {video.id}. Nội dung bình luận số {i + 1}
                            .
                        </p>
                    </div>
                </div>
            ))}
        </>
    );
};

export const DetailsPanel = ({ video }: { video: VideoType }) => {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h3 className="text-lg font-medium mb-2">Thông tin chi tiết</h3>
                <div className="text-sm text-gray-300 space-y-2">
                    <p>
                        <span className="text-gray-400">Tiêu đề:</span> {video.title}
                    </p>
                    <p>
                        <span className="text-gray-400">Lượt xem:</span>{" "}
                        {video.views.toLocaleString()}
                    </p>
                    <p>
                        <span className="text-gray-400">Thời lượng:</span>{" "}
                        {Math.floor(video.duration / 60)}:
                        {(video.duration % 60).toString().padStart(2, "0")}
                    </p>
                    <p>
                        <span className="text-gray-400">ID Video:</span> {video.id}
                    </p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-2">Mô tả</h3>
                <p className="text-sm text-gray-300">{video.description}</p>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-2">Tác giả</h3>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600"></div>
                    <div>
                        <p className="text-sm font-medium">{video.author.name}</p>
                        <p className="text-xs text-gray-400">@{video.author.username}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const SharePanel = ({ video }: { video: VideoType }) => {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-300">Chia sẻ video &quot;{video.title}&quot; qua:</p>

            <div className="grid grid-cols-3 gap-4">
                {["Facebook", "Twitter", "WhatsApp", "Email", "Embed", "Link"].map((platform) => (
                    <div
                        key={platform}
                        className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-colors"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                            <span className="text-2xl">📤</span>
                        </div>
                        <span className="text-sm">{platform}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Link video:</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={`https://example.com/shorts/${video.id}`}
                        readOnly
                        className="flex-1 bg-gray-800 text-white text-sm rounded-md px-3 py-2 focus:outline-none"
                    />
                    <button className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-sm transition-colors">
                        Sao chép
                    </button>
                </div>
            </div>
        </div>
    );
};

export const PlaylistPanel = ({ video }: { video: VideoType }) => {
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
