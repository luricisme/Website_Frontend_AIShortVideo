import VideoCard from "@/app/(user)/_components/video-card";
import { TrendingUp } from "lucide-react";

const VIDEO_CATEGORIES = [
    {
        id: 2,
        name: "Animation",
    },
    {
        id: 3,
        name: "Creative",
    },
    {
        id: 4,
        name: "Education",
    },
    {
        id: 5,
        name: "Music",
    },
];

const VIDEO_TRENDING_TAGS = [
    {
        id: 1,
        name: "#AIPortraits",
    },
    {
        id: 2,
        name: "#MusicVideos",
    },
    {
        id: 3,
        name: "#AnimatedStories",
    },
    {
        id: 4,
        name: "#NatureScenes",
    },
    {
        id: 5,
        name: "#ArtificialCreativity",
    },
];

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

const VideoCategory = ({ name }: { name: string }) => {
    return (
        <div className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-[#2A2A2A] cursor-pointer hover:bg-[#7C4DFF] transition-colors duration-200">
            {name}
        </div>
    );
};

const VideoTrendingTag = ({ name }: { name: string }) => {
    return (
        <div
            className="px-3 py-[6px] rounded-full text-[#7C4DFF] text-xs font-bold"
            style={{
                background: "rgba(124, 77, 255, 0.2)",
            }}
        >
            {name}
        </div>
    );
};

export default function Home() {
    return (
        <div>
            <div className="flex flex-col gap-4">
                {/* Video categories */}
                <div className="flex items-center gap-2.5">
                    <div className="px-4 py-2 text-sm font-bold text-white rounded-full bg-[#7C4DFF] cursor-pointer">
                        All
                    </div>
                    {VIDEO_CATEGORIES.map((category) => {
                        return <VideoCategory key={category.id} name={category.name} />;
                    })}
                </div>

                {/* Video trending tags */}
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-white text-[18px]">Trending Now</h2>
                        <TrendingUp color="#7C4DFF" strokeWidth={3} />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        {VIDEO_TRENDING_TAGS.map((tag) => {
                            return <VideoTrendingTag key={tag.id} name={tag.name} />;
                        })}
                    </div>
                </div>

                {/* Video list */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
                    {/* Video Card */}
                    {VIDEO_LIST.map((video) => {
                        return <VideoCard key={video.id} video={video} />;
                    })}
                </div>
            </div>
        </div>
    );
}
