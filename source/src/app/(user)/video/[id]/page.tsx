import { use } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EllipsisVertical, Hash } from "lucide-react";
import Image from "next/image";
import CustomVideoPlayer from "@/app/(user)/_components/custom-video-player";

const VIDEO_LIST = [
    {
        id: 1,
        title: "AI Portraits",
        description: "A collection of AI-generated portraits.",
        thumbnail:
            "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
        duration: 324,
        views: 123456,
        author: {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            avatar: "https://example.com/john-doe.jpg",
        },
    },
    {
        id: 2,
        title: "AI Portraits",
        description: "A collection of AI-generated portraits.",
        thumbnail:
            "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        source: "https://www.w3schools.com/tags/mov_bbb.mp4",
        duration: 324,
        views: 123456,
        author: {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            avatar: "https://example.com/john-doe.jpg",
        },
    },
    {
        id: 3,
        title: "AI Portraits",
        description: "A collection of AI-generated portraits.",
        thumbnail:
            "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
        duration: 324,
        views: 123456,
        author: {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            avatar: "https://example.com/john-doe.jpg",
        },
    },
    {
        id: 4,
        title: "AI Portraits",
        description: "A collection of AI-generated portraits.",
        thumbnail:
            "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
        duration: 324,
        views: 123456,
        author: {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            avatar: "https://example.com/john-doe.jpg",
        },
    },
    {
        id: 5,
        title: "AI Portraits",
        description: "A collection of AI-generated portraits.",
        thumbnail:
            "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
        duration: 324,
        views: 123456,
        author: {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            avatar: "https://example.com/john-doe.jpg",
        },
    },
    {
        id: 6,
        title: "AI Portraits",
        description: "A collection of AI-generated portraits.",
        thumbnail:
            "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
        duration: 324,
        views: 123456,
        author: {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            avatar: "https://example.com/john-doe.jpg",
        },
    },
];

type Params = {
    id: string;
};

const VideoDetail = ({ params }: { params: Promise<Params> }) => {
    const { id } = use(params);
    const video = VIDEO_LIST.find((video) => video.id === parseInt(id));

    console.log("VideoDetail", video);

    return (
        <div className="grid grid-cols-3">
            <div className="mt-auto">
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-center gap-2 text-gray-400 bg-sidebar/80 rounded-md px-4 py-2.5 w-fit">
                        <Hash color="#fff" size={35} strokeWidth={2} />
                        <div className="flex flex-col text-sm">
                            <span className="text-white font-medium cursor-pointer hover:underline">
                                tagname
                            </span>
                            <span>6,7N video</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold text-white">{video?.title}</h1>
                    <p className="text-sm text-gray-400">{video?.description}</p>
                    <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={video?.author.avatar} />
                            <AvatarFallback>{video?.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">
                                {video?.author.name}
                            </span>
                            <span className="text-xs text-gray-400">@{video?.author.username}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-4 h-[calc(100vh-80px)]">
                <CustomVideoPlayer src={video?.source || ""} />
                <div className="flex flex-col justify-end gap-3">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col items-center gap-1 text-white text-sm">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                <Image
                                    src={"/icon/like-icon.svg"}
                                    alt="Like"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            </div>

                            <span className="font-medium">107 N</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-white text-sm">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                <Image
                                    src={"/icon/dislike-icon.svg"}
                                    alt="Dislike"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            </div>

                            <span className="font-medium w-11 truncate">Không thích video này</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-white text-sm">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                <Image
                                    src={"/icon/comment-icon.svg"}
                                    alt="Comment"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            </div>

                            <span className="font-medium">604</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-white text-sm">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                <Image
                                    src={"/icon/share-icon.svg"}
                                    alt="Share"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            </div>

                            <span className="font-medium truncate">Chia sẻ</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-white text-sm">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                <EllipsisVertical />
                            </div>
                        </div>
                    </div>
                    <Avatar className="w-11 h-11 rounded-md">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <div></div>
        </div>
    );
};
export default VideoDetail;
