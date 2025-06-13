import ShortsViewer from "@/app/(user)/_components/shorts-viewer ";

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
    // Giữ nguyên các video khác...
    {
        id: 2,
        title: "Đồi Núi Tự Nhiên",
        description: "Cảnh quay tuyệt đẹp về thiên nhiên.",
        thumbnail:
            "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bmF0dXJlfGVufDB8fDB8fHww",
        source: "https://www.w3schools.com/tags/mov_bbb.mp4",
        duration: 245,
        views: 87321,
        author: {
            id: 2,
            name: "Minh Hà",
            username: "minhha",
            avatar: "https://example.com/minhha.jpg",
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

export default function Home() {
    return (
        <ShortsViewer
            videos={VIDEO_LIST}
            initialVideoIndex={0}
            updateUrl={false} // Không cập nhật URL cho homepage
            urlPath="/" // Không cần thiết vì updateUrl = false
        />
    );
}
