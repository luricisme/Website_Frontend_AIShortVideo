import VideoCard, { VideoCardProps } from "@/app/(user)/_components/video-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user.types";
import Link from "next/link";

const VideoGrid = ({ videos }: { videos: VideoCardProps[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
        ))}
    </div>
);

interface ProfilePageProps {
    activeTab: string;
    onTabChange?: (tab: string) => void;
    onEditProfile?: () => void;
    videos?: VideoCardProps[];
    user: User;
    isFetching: boolean;
    isOtherUser: boolean; // Optional prop to indicate if it's another user's profile
}

const ProfilePage = ({
    activeTab,
    onTabChange = () => {},
    onEditProfile = () => {},
    videos = [], // Default to empty array if no videos provided
    user,
    isFetching,
    isOtherUser = false, // Default to false if not specified
}: ProfilePageProps) => {
    console.log(">>> ProfilePage user:", user);

    return (
        <div className="min-h-screen text-white mb-10">
            <div className="mx-auto max-w-6xl px-4">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
                    <Avatar className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center">
                        <AvatarImage
                            src={user?.avatar || undefined}
                            alt={`${user?.firstName} ${user?.lastName}`}
                        />
                        <AvatarFallback>
                            {user?.firstName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex flex-col space-y-2">
                            <h1 className="text-2xl font-bold">
                                {user?.firstName} {user?.lastName}
                            </h1>
                            <p className="text-zinc-400">@{user?.username}</p>
                        </div>
                        {isOtherUser == false ? (
                            <div className="my-4 flex flex-wrap gap-2">
                                <button
                                    onClick={onEditProfile}
                                    className="px-4 py-1.5 border border-zinc-600 rounded-lg text-sm hover:bg-zinc-800 transition-colors"
                                    disabled={isFetching}
                                >
                                    Edit Profile
                                </button>
                                <Button
                                    variant="secondary"
                                    className="px-4 py-1.5 text-sm hover:bg-purple-600 transition-colors"
                                >
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                            </div>
                        ) : null}

                        <div className="flex space-x-8 mb-4">
                            <div className="text-center">
                                <div className="font-bold">
                                    {user?.followers?.totalElements ?? 0}
                                </div>
                                <div className="text-zinc-400 text-sm">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold">
                                    {user?.followings?.totalElements ?? 0}
                                </div>
                                <div className="text-zinc-400 text-sm">Following</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio and Links */}
                <div className="mb-8">
                    <p className="text-white mb-2">{user?.bio}</p>
                    {user?.instagram && (
                        <div className="flex items-center space-x-2 text-zinc-400">
                            <span className="text-sm">{user?.instagram}</span>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="border-b border-zinc-800 mb-6">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => onTabChange("my-videos")}
                            className={`pb-4 text-sm font-medium ${
                                activeTab === "my-videos"
                                    ? "text-white border-b-2 border-white"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            My Videos
                        </button>
                        <button
                            onClick={() => onTabChange("liked-videos")}
                            className={`pb-4 text-sm font-medium ${
                                activeTab === "liked-videos"
                                    ? "text-white border-b-2 border-white"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            Liked Videos
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "my-videos" && <VideoGrid videos={videos} />}
                {activeTab === "liked-videos" && <VideoGrid videos={videos} />}
            </div>
        </div>
    );
};
export default ProfilePage;
